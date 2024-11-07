/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { Mutex } from 'async-mutex';
import { FfmpegCommand } from 'fluent-ffmpeg';
import { EventEmitter } from 'node:events';
import type { Page as PuppeteerPage } from 'puppeteer';
import { PassThrough, Writable } from 'stream';
import { PuppeteerCapture } from './PuppeteerCapture';
import { PuppeteerCaptureEvents } from './PuppeteerCaptureEvents';
import { PuppeteerCaptureOptions } from './PuppeteerCaptureOptions';
import { PuppeteerCaptureStartOptions } from './PuppeteerCaptureStartOptions';
export declare abstract class PuppeteerCaptureBase extends EventEmitter implements PuppeteerCapture {
    static readonly DEFAULT_OPTIONS: PuppeteerCaptureOptions;
    static readonly DEFAULT_START_OPTIONS: PuppeteerCaptureStartOptions;
    protected readonly _options: PuppeteerCaptureOptions;
    protected readonly _frameInterval: number;
    protected readonly _onPageClose: () => void;
    protected readonly _startStopMutex: Mutex;
    protected _page: PuppeteerPage | null;
    protected _target: string | Writable | null;
    protected _frameBeingCaptured: Promise<void> | null;
    protected _captureTimestamp: number;
    protected _capturedFrames: number;
    protected _dropCapturedFrames: boolean;
    protected _recordedFrames: number;
    protected _error: any | null;
    protected _framesStream: PassThrough | null;
    protected _ffmpegStream: FfmpegCommand | null;
    protected _ffmpegStarted: Promise<void> | null;
    protected _ffmpegExited: Promise<void> | null;
    protected _ffmpegExitedResolve: (() => void) | null;
    protected _pageWaitForTimeout: ((milliseconds: number) => Promise<void>) | null;
    protected _isCapturing: boolean;
    constructor(options?: PuppeteerCaptureOptions);
    get page(): PuppeteerPage | null;
    get isCapturing(): boolean;
    get captureTimestamp(): number;
    get capturedFrames(): number;
    get dropCapturedFrames(): boolean;
    set dropCapturedFrames(dropCaptiuredFrames: boolean);
    get recordedFrames(): number;
    attach(page: PuppeteerPage): Promise<void>;
    protected _attach(page: PuppeteerPage): Promise<void>;
    detach(): Promise<void>;
    protected _detach(page: PuppeteerPage): Promise<void>;
    start(target: string | Writable, options?: PuppeteerCaptureStartOptions): Promise<void>;
    protected _start(target: string | Writable, options?: PuppeteerCaptureStartOptions): Promise<void>;
    stop(): Promise<void>;
    protected _stop(): Promise<void>;
    waitForTimeout(milliseconds: number): Promise<void>;
    emit<Event extends keyof PuppeteerCaptureEvents>(eventName: Event, ...args: Parameters<PuppeteerCaptureEvents[Event]>): boolean;
    protected onPostCaptureStarted(): Promise<void>;
    protected onPostCaptureStopped(): Promise<void>;
    protected onFrameCaptured(timestamp: number, data: Buffer): Promise<void>;
    protected onFrameCaptureFailed(reason?: any): Promise<void>;
    protected onPageClose(): void;
    private static findFfmpeg;
}
