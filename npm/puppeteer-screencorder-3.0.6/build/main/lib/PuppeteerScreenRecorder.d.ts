/// <reference types="node" />
import { Writable } from 'stream';
import { Page } from 'puppeteer';
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
export declare class PuppeteerScreenRecorder {
    private page;
    private options;
    private streamReader;
    private streamWriter;
    private isScreenCaptureEnded;
    constructor(page: Page, options?: {});
    /**
     * @ignore
     */
    private setupListeners;
    /**
     * @ignore
     */
    private ensureDirectoryExist;
    /**
     * @ignore
     * @private
     * @method startStreamReader
     * @description start listening for video stream from the page.
     * @returns PuppeteerScreenRecorder
     */
    private startStreamReader;
    /**
     * @public
     * @method getRecordDuration
     * @description return the total duration of the video recorded,
     *  1. if this method is called before calling the stop method, it would be return the time till it has recorded.
     *  2. if this method is called after stop method, it would give the total time for recording
     * @returns total duration of video
     */
    getRecordDuration(): string;
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
    start(savePath: string): Promise<PuppeteerScreenRecorder>;
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
    startStream(stream: Writable): Promise<PuppeteerScreenRecorder>;
    /**
     * @public
     * @method stop
     * @description stop the video capturing session
     * @returns indicate whether stop is completed correct or not, if true without any error else false.
     */
    stop(): Promise<boolean>;
}
