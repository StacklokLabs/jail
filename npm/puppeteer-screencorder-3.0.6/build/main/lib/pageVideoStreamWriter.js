"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const os_1 = __importDefault(require("os"));
const path_1 = require("path");
const stream_1 = require("stream");
const fluent_ffmpeg_1 = __importStar(require("fluent-ffmpeg"));
const pageVideoStreamTypes_1 = require("./pageVideoStreamTypes");
/**
 * @ignore
 */
const SUPPORTED_FILE_FORMATS = [
    pageVideoStreamTypes_1.SupportedFileFormats.MP4,
    pageVideoStreamTypes_1.SupportedFileFormats.AVI,
    pageVideoStreamTypes_1.SupportedFileFormats.MOV,
    pageVideoStreamTypes_1.SupportedFileFormats.WEBM,
];
/**
 * @ignore
 */
class PageVideoStreamWriter extends events_1.EventEmitter {
    constructor(destinationSource, options) {
        super();
        this.screenLimit = 10;
        this.screenCastFrames = [];
        this.duration = '00:00:00:00';
        this.frameGain = 0;
        this.frameLoss = 0;
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.NOT_STARTED;
        this.videoMediatorStream = new stream_1.PassThrough();
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
        const fileExtension = (0, path_1.extname)(destinationFile);
        return fileExtension.includes('.')
            ? fileExtension.replace('.', '')
            : fileExtension;
    }
    configureFFmPegPath() {
        const ffmpegPath = this.getFfmpegPath();
        if (!ffmpegPath) {
            throw new Error('FFmpeg path is missing, \n Set the FFMPEG_PATH env variable');
        }
        (0, fluent_ffmpeg_1.setFfmpegPath)(ffmpegPath);
    }
    isWritableStream(destinationSource) {
        if (destinationSource && typeof destinationSource !== 'string') {
            if (!(destinationSource instanceof stream_1.Writable) ||
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
            if (fileExt == pageVideoStreamTypes_1.SupportedFileFormats.WEBM) {
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
        var _a, _b;
        const cpu = Math.max(1, os_1.default.cpus().length - 1);
        const videoOutputOptions = (_a = this.options.videOutputOptions) !== null && _a !== void 0 ? _a : [];
        const outputOptions = [];
        outputOptions.push(`-crf ${(_b = this.options.videoCrf) !== null && _b !== void 0 ? _b : 23}`);
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
        var _a;
        const metadataOptions = (_a = this.options.metadata) !== null && _a !== void 0 ? _a : [];
        for (const metadata of metadataOptions) {
            outputStream.outputOptions('-metadata', metadata);
        }
    }
    getDestinationStream() {
        var _a;
        const outputStream = (0, fluent_ffmpeg_1.default)({
            source: this.videoMediatorStream,
            priority: 20,
        })
            .videoCodec(this.options.videoCodec || 'libx264')
            .size(this.videoFrameSize)
            .aspect(this.options.aspectRatio || '4:3')
            .autopad(this.autopad.activation, (_a = this.autopad) === null || _a === void 0 ? void 0 : _a.color)
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
        if (this.status !== pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.IN_PROGRESS &&
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
            return Object.assign(Object.assign({}, currentFrame), { duration });
        });
    }
    processFrameBeforeWrite(frames, chunckEndTime) {
        const processedFrames = this.trimFrame(frames, chunckEndTime);
        processedFrames.forEach(({ blob, duration }) => {
            this.write(blob, duration);
        });
    }
    write(data, durationSeconds = 1) {
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.IN_PROGRESS;
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
        if (this.status === pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.COMPLETED) {
            return this.writerPromise;
        }
        this.drainFrames(stoppedTime);
        this.videoMediatorStream.end();
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.COMPLETED;
        return this.writerPromise;
    }
}
exports.default = PageVideoStreamWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVZpZGVvU3RyZWFtV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYWdlVmlkZW9TdHJlYW1Xcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUFzQztBQUN0Qyw0Q0FBb0I7QUFDcEIsK0JBQStCO0FBQy9CLG1DQUErQztBQUUvQywrREFBc0Q7QUFFdEQsaUVBS2dDO0FBRWhDOztHQUVHO0FBQ0gsTUFBTSxzQkFBc0IsR0FBRztJQUM3QiwyQ0FBb0IsQ0FBQyxHQUFHO0lBQ3hCLDJDQUFvQixDQUFDLEdBQUc7SUFDeEIsMkNBQW9CLENBQUMsR0FBRztJQUN4QiwyQ0FBb0IsQ0FBQyxJQUFJO0NBQzFCLENBQUM7QUFFRjs7R0FFRztBQUNILE1BQXFCLHFCQUFzQixTQUFRLHFCQUFZO0lBYTdELFlBQVksaUJBQW9DLEVBQUUsT0FBc0I7UUFDdEUsS0FBSyxFQUFFLENBQUM7UUFiTyxnQkFBVyxHQUFHLEVBQUUsQ0FBQztRQUMxQixxQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDdkIsYUFBUSxHQUFHLGFBQWEsQ0FBQztRQUN6QixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUViLFdBQU0sR0FBRyx5Q0FBa0IsQ0FBQyxXQUFXLENBQUM7UUFHeEMsd0JBQW1CLEdBQWdCLElBQUksb0JBQVcsRUFBRSxDQUFDO1FBTTNELElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7U0FDeEI7UUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzQixJQUFJLFVBQVUsRUFBRTtZQUNkLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxpQkFBNkIsQ0FBQyxDQUFD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