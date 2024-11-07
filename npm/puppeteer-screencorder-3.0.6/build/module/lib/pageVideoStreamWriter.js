import { EventEmitter } from 'events';
import os from 'os';
import { extname } from 'path';
import { PassThrough, Writable } from 'stream';
import ffmpeg, { setFfmpegPath } from 'fluent-ffmpeg';
import { SupportedFileFormats, VIDEO_WRITE_STATUS, } from './pageVideoStreamTypes';
/**
 * @ignore
 */
const SUPPORTED_FILE_FORMATS = [
    SupportedFileFormats.MP4,
    SupportedFileFormats.AVI,
    SupportedFileFormats.MOV,
    SupportedFileFormats.WEBM,
];
/**
 * @ignore
 */
export default class PageVideoStreamWriter extends EventEmitter {
    screenLimit = 10;
    screenCastFrames = [];
    duration = '00:00:00:00';
    frameGain = 0;
    frameLoss = 0;
    status = VIDEO_WRITE_STATUS.NOT_STARTED;
    options;
    videoMediatorStream = new PassThrough();
    writerPromise;
    constructor(destinationSource, options) {
        super();
        if (options) {
            this.options = options;
        }
        const isWritable = this.isWritableStream(destinationSource);
        this.configureFFmPegPath();
        if (isWritable) {
            this.configureVideoWritableStream(destinationSource);
        }
        else {
            this.configureVideoFile(destinationSource);
        }
    }
    get videoFrameSize() {
        const { width, height } = this.options.videoFrame;
        return width !== null && height !== null ? `${width}x${height}` : '100%';
    }
    get autopad() {
        const autopad = this.options.autopad;
        return !autopad
            ? { activation: false }
            : { activation: true, color: autopad.color };
    }
    getFfmpegPath() {
        if (this.options.ffmpeg_Path) {
            return this.options.ffmpeg_Path;
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const ffmpeg = require('@ffmpeg-installer/ffmpeg');
            if (ffmpeg.path) {
                return ffmpeg.path;
            }
            return null;
        }
        catch (e) {
            return null;
        }
    }
    getDestinationPathExtension(destinationFile) {
        const fileExtension = extname(destinationFile);
        return fileExtension.includes('.')
            ? fileExtension.replace('.', '')
            : fileExtension;
    }
    configureFFmPegPath() {
        const ffmpegPath = this.getFfmpegPath();
        if (!ffmpegPath) {
            throw new Error('FFmpeg path is missing, \n Set the FFMPEG_PATH env variable');
        }
        setFfmpegPath(ffmpegPath);
    }
    isWritableStream(destinationSource) {
        if (destinationSource && typeof destinationSource !== 'string') {
            if (!(destinationSource instanceof Writable) ||
                !('writable' in destinationSource) ||
                !destinationSource.writable) {
                throw new Error('Output should be a writable stream');
            }
            return true;
        }
        return false;
    }
    configureVideoFile(destinationPath) {
        const fileExt = this.getDestinationPathExtension(destinationPath);
        if (!SUPPORTED_FILE_FORMATS.includes(fileExt)) {
            throw new Error('File format is not supported');
        }
        this.writerPromise = new Promise((resolve) => {
            const outputStream = this.getDestinationStream();
            outputStream
                .on('error', (e) => {
                this.handleWriteStreamError(e.message);
                resolve(false);
            })
                .on('stderr', (e) => {
                this.handleWriteStreamError(e);
                resolve(false);
            })
                .on('end', () => resolve(true))
                .save(destinationPath);
            if (fileExt == SupportedFileFormats.WEBM) {
                outputStream
                    .videoCodec('libvpx')
                    .videoBitrate(this.options.videoBitrate || 1000, true)
                    .outputOptions('-flags', '+global_header', '-psnr');
            }
        });
    }
    configureVideoWritableStream(writableStream) {
        this.writerPromise = new Promise((resolve) => {
            const outputStream = this.getDestinationStream();
            outputStream
                .on('error', (e) => {
                writableStream.emit('error', e);
                resolve(false);
            })
                .on('stderr', (e) => {
                writableStream.emit('error', { message: e });
                resolve(false);
            })
                .on('end', () => {
                writableStream.end();
                resolve(true);
            });
            outputStream.toFormat('mp4');
            outputStream.addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov');
            outputStream.pipe(writableStream);
        });
    }
    getOutputOption() {
        const cpu = Math.max(1, os.cpus().length - 1);
        const videoOutputOptions = this.options.videOutputOptions ?? [];
        const outputOptions = [];
        outputOptions.push(`-crf ${this.options.videoCrf ?? 23}`);
        outputOptions.push(`-preset ${this.options.videoPreset || 'ultrafast'}`);
        outputOptions.push(`-pix_fmt ${this.options.videoPixelFormat || 'yuv420p'}`);
        outputOptions.push(`-minrate ${this.options.videoBitrate || 1000}`);
        outputOptions.push(`-maxrate ${this.options.videoBitrate || 1000}`);
        outputOptions.push('-framerate 1');
        outputOptions.push(`-threads ${cpu}`);
        outputOptions.push(`-loglevel error`);
        videoOutputOptions.forEach((options) => {
            outputOptions.push(options);
        });
        return outputOptions;
    }
    addVideoMetadata(outputStream) {
        const metadataOptions = this.options.metadata ?? [];
        for (const metadata of metadataOptions) {
            outputStream.outputOptions('-metadata', metadata);
        }
    }
    getDestinationStream() {
        const outputStream = ffmpeg({
            source: this.videoMediatorStream,
            priority: 20,
        })
            .videoCodec(this.options.videoCodec || 'libx264')
            .size(this.videoFrameSize)
            .aspect(this.options.aspectRatio || '4:3')
            .autopad(this.autopad.activation, this.autopad?.color)
            .inputFormat('image2pipe')
            .inputFPS(this.options.fps)
            .outputOptions(this.getOutputOption())
            .on('progress', (progressDetails) => {
            this.duration = progressDetails.timemark;
        });
        this.addVideoMetadata(outputStream);
        if (this.options.recordDurationLimit) {
            outputStream.duration(this.options.recordDurationLimit);
        }
        return outputStream;
    }
    handleWriteStreamError(errorMessage) {
        this.emit('videoStreamWriterError', errorMessage);
        if (this.status !== VIDEO_WRITE_STATUS.IN_PROGRESS &&
            errorMessage.includes('pipe:0: End of file')) {
            return;
        }
        return console.error(`Error unable to capture video stream: ${errorMessage}`);
    }
    findSlot(timestamp) {
        if (this.screenCastFrames.length === 0) {
            return 0;
        }
        let i;
        let frame;
        for (i = this.screenCastFrames.length - 1; i >= 0; i--) {
            frame = this.screenCastFrames[i];
            if (timestamp > frame.timestamp) {
                break;
            }
        }
        return i + 1;
    }
    insert(frame) {
        // reduce the queue into half when it is full
        if (this.screenCastFrames.length === this.screenLimit) {
            const numberOfFramesToSplice = Math.floor(this.screenLimit / 2);
            const framesToProcess = this.screenCastFrames.splice(0, numberOfFramesToSplice);
            this.processFrameBeforeWrite(framesToProcess, this.screenCastFrames[0].timestamp);
        }
        const insertionIndex = this.findSlot(frame.timestamp);
        if (insertionIndex === this.screenCastFrames.length) {
            this.screenCastFrames.push(frame);
        }
        else {
            this.screenCastFrames.splice(insertionIndex, 0, frame);
        }
    }
    trimFrame(fameList, chunckEndTime) {
        return fameList.map((currentFrame, index) => {
            const endTime = index !== fameList.length - 1
                ? fameList[index + 1].timestamp
                : chunckEndTime;
            const duration = endTime - currentFrame.timestamp;
            return {
                ...currentFrame,
                duration,
            };
        });
    }
    processFrameBeforeWrite(frames, chunckEndTime) {
        const processedFrames = this.trimFrame(frames, chunckEndTime);
        processedFrames.forEach(({ blob, duration }) => {
            this.write(blob, duration);
        });
    }
    write(data, durationSeconds = 1) {
        this.status = VIDEO_WRITE_STATUS.IN_PROGRESS;
        const totalFrames = durationSeconds * this.options.fps;
        const floored = Math.floor(totalFrames);
        let numberOfFPS = Math.max(floored, 1);
        if (floored === 0) {
            this.frameGain += 1 - totalFrames;
        }
        else {
            this.frameLoss += totalFrames - floored;
        }
        while (1 < this.frameLoss) {
            this.frameLoss--;
            numberOfFPS++;
        }
        while (1 < this.frameGain) {
            this.frameGain--;
            numberOfFPS--;
        }
        for (let i = 0; i < numberOfFPS; i++) {
            this.videoMediatorStream.write(data);
        }
    }
    drainFrames(stoppedTime) {
        this.processFrameBeforeWrite(this.screenCastFrames, stoppedTime);
        this.screenCastFrames = [];
    }
    stop(stoppedTime = Date.now() / 1000) {
        if (this.status === VIDEO_WRITE_STATUS.COMPLETED) {
            return this.writerPromise;
        }
        this.drainFrames(stoppedTime);
        this.videoMediatorStream.end();
        this.status = VIDEO_WRITE_STATUS.COMPLETED;
        return this.writerPromise;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVZpZGVvU3RyZWFtV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYWdlVmlkZW9TdHJlYW1Xcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUN0QyxPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFDcEIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUUvQyxPQUFPLE1BQU0sRUFBRSxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV0RCxPQUFPLEVBRUwsb0JBQW9CLEVBQ3BCLGtCQUFrQixHQUVuQixNQUFNLHdCQUF3QixDQUFDO0FBRWhDOztHQUVHO0FBQ0gsTUFBTSxzQkFBc0IsR0FBRztJQUM3QixvQkFBb0IsQ0FBQyxHQUFHO0lBQ3hCLG9CQUFvQixDQUFDLEdBQUc7SUFDeEIsb0JBQW9CLENBQUMsR0FBRztJQUN4QixvQkFBb0IsQ0FBQyxJQUFJO0NBQzFCLENBQUM7QUFFRjs7R0FFRztBQUNILE1BQU0sQ0FBQyxPQUFPLE9BQU8scUJBQXNCLFNBQVEsWUFBWTtJQUM1QyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQzFCLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztJQUN2QixRQUFRLEdBQUcsYUFBYSxDQUFDO0lBQ3pCLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDZCxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBRWIsTUFBTSxHQUFHLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztJQUN4QyxPQUFPLENBQWU7SUFFdEIsbUJBQW1CLEdBQWdCLElBQUksV0FBVyxFQUFFLENBQUM7SUFDckQsYUFBYSxDQUFtQjtJQUV4QyxZQUFZLGlCQUFvQyxFQUFFLE9BQXNCO1FBQ3RFLEtBQUssRUFBRSxDQUFDO1FBRVIs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