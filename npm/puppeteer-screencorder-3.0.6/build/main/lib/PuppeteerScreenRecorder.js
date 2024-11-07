"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerScreenRecorder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const pageVideoStreamCollector_1 = require("./pageVideoStreamCollector");
const pageVideoStreamWriter_1 = __importDefault(require("./pageVideoStreamWriter"));
/**
 * @ignore
 * @default
 * @description This will be option passed to the puppeteer screen recorder
 */
const defaultPuppeteerScreenRecorderOptions = {
    followNewTab: true,
    fps: 15,
    quality: 100,
    ffmpeg_Path: null,
    videoFrame: {
        width: null,
        height: null,
    },
    aspectRatio: '4:3',
};
/**
 * PuppeteerScreenRecorder class is responsible for managing the video
 *
 * ```typescript
 * const screenRecorderOptions = {
 *  followNewTab: true,
 *  fps: 15,
 * }
 * const savePath = "./test/demo.mp4";
 * const screenRecorder = new PuppeteerScreenRecorder(page, screenRecorderOptions);
 * await screenRecorder.start(savePath);
 *  // some puppeteer action or test
 * await screenRecorder.stop()
 * ```
 */
class PuppeteerScreenRecorder {
    constructor(page, options = {}) {
        this.isScreenCaptureEnded = null;
        this.options = Object.assign({}, defaultPuppeteerScreenRecorderOptions, options);
        this.streamReader = new pageVideoStreamCollector_1.pageVideoStreamCollector(page, this.options);
        this.page = page;
    }
    /**
     * @ignore
     */
    setupListeners() {
        this.page.once('close', async () => await this.stop());
        this.streamReader.on('pageScreenFrame', (pageScreenFrame) => {
            this.streamWriter.insert(pageScreenFrame);
        });
        this.streamWriter.once('videoStreamWriterError', () => this.stop());
    }
    /**
     * @ignore
     */
    async ensureDirectoryExist(dirPath) {
        return new Promise((resolve, reject) => {
            try {
                fs_1.default.mkdirSync(dirPath, { recursive: true });
                return resolve(dirPath);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * @ignore
     * @private
     * @method startStreamReader
     * @description start listening for video stream from the page.
     * @returns PuppeteerScreenRecorder
     */
    async startStreamReader() {
        this.setupListeners();
        await this.streamReader.start();
        return this;
    }
    /**
     * @public
     * @method getRecordDuration
     * @description return the total duration of the video recorded,
     *  1. if this method is called before calling the stop method, it would be return the time till it has recorded.
     *  2. if this method is called after stop method, it would give the total time for recording
     * @returns total duration of video
     */
    getRecordDuration() {
        if (!this.streamWriter) {
            return '00:00:00:00';
        }
        return this.streamWriter.duration;
    }
    /**
     *
     * @public
     * @method start
     * @param savePath accepts a path string to store the video
     * @description Start the video capturing session
     * @returns PuppeteerScreenRecorder
     * @example
     * ```
     *  const savePath = './test/demo.mp4'; //.mp4 is required
     *  await recorder.start(savePath);
     * ```
     */
    async start(savePath) {
        await this.ensureDirectoryExist((0, path_1.dirname)(savePath));
        this.streamWriter = new pageVideoStreamWriter_1.default(savePath, this.options);
        return this.startStreamReader();
    }
    /**
     *
     * @public
     * @method startStream
     * @description Start the video capturing session in a stream
     * @returns {PuppeteerScreenRecorder}
     * @example
     * ```
     *  const stream = new PassThrough();
     *  await recorder.startStream(stream);
     * ```
     */
    async startStream(stream) {
        this.streamWriter = new pageVideoStreamWriter_1.default(stream, this.options);
        return this.startStreamReader();
    }
    /**
     * @public
     * @method stop
     * @description stop the video capturing session
     * @returns indicate whether stop is completed correct or not, if true without any error else false.
     */
    async stop() {
        if (this.isScreenCaptureEnded !== null) {
            return this.isScreenCaptureEnded;
        }
        await this.streamReader.stop();
        this.isScreenCaptureEnded = await this.streamWriter.stop();
        return this.isScreenCaptureEnded;
    }
}
exports.PuppeteerScreenRecorder = PuppeteerScreenRecorder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVwcGV0ZWVyU2NyZWVuUmVjb3JkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL1B1cHBldGVlclNjcmVlblJlY29yZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDRDQUFvQjtBQUNwQiwrQkFBK0I7QUFLL0IseUVBQXNFO0FBRXRFLG9GQUE0RDtBQUU1RDs7OztHQUlHO0FBQ0gsTUFBTSxxQ0FBcUMsR0FBbUM7SUFDNUUsWUFBWSxFQUFFLElBQUk7SUFDbEIsR0FBRyxFQUFFLEVBQUU7SUFDUCxPQUFPLEVBQUUsR0FBRztJQUNaLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLFVBQVUsRUFBRTtRQUNWLEtBQUssRUFBRSxJQUFJO1FBQ1gsTUFBTSxFQUFFLElBQUk7S0FDYjtJQUNELFdBQVcsRUFBRSxLQUFLO0NBQ25CLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQWEsdUJBQXVCO0lBT2xDLFlBQVksSUFBVSxFQUFFLE9BQU8sR0FBRyxFQUFFO1FBRjVCLHlCQUFvQixHQUFtQixJQUFJLENBQUM7UUFHbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUMxQixFQUFFLEVBQ0YscUNBQXFDLEVBQ3JDLE9BQU8sQ0FDUixDQUFDO1FBQ0YsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLG1EQUF3QixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVEOztPQUVHO0lBQ0ssY0FBYztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRXZELElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENB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