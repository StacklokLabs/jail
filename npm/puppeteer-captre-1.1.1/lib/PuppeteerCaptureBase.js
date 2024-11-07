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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerCaptureBase = void 0;
const async_mutex_1 = require("async-mutex");
const fluent_ffmpeg_1 = __importStar(require("fluent-ffmpeg"));
const promises_1 = require("fs/promises");
const node_events_1 = require("node:events");
const path_1 = require("path");
const stream_1 = require("stream");
const which_1 = __importDefault(require("which"));
const PuppeteerCaptureFormat_1 = require("./PuppeteerCaptureFormat");
class PuppeteerCaptureBase extends node_events_1.EventEmitter {
    constructor(options) {
        super();
        this._options = Object.assign(Object.assign({}, PuppeteerCaptureBase.DEFAULT_OPTIONS), (options !== null ? options : {}));
        if (this._options.fps == null) {
            throw new Error('options.fps needs to be set');
        }
        if (this._options.fps < 0) {
            throw new Error(`options.fps can not be set to ${this._options.fps}`);
        }
        this._frameInterval = 1000.0 / this._options.fps;
        this._onPageClose = this.onPageClose.bind(this);
        this._startStopMutex = new async_mutex_1.Mutex();
        this._page = null;
        this._target = null;
        this._frameBeingCaptured = null;
        this._captureTimestamp = 0;
        this._capturedFrames = 0;
        this._dropCapturedFrames = false;
        this._recordedFrames = 0;
        this._error = null;
        this._framesStream = null;
        this._ffmpegStream = null;
        this._ffmpegStarted = null;
        this._ffmpegExited = null;
        this._ffmpegExitedResolve = null;
        this._pageWaitForTimeout = null;
        this._isCapturing = false;
    }
    get page() {
        return this._page;
    }
    get isCapturing() {
        return this._isCapturing;
    }
    get captureTimestamp() {
        return this._captureTimestamp;
    }
    get capturedFrames() {
        return this._capturedFrames;
    }
    get dropCapturedFrames() {
        return this._dropCapturedFrames;
    }
    set dropCapturedFrames(dropCaptiuredFrames) {
        this._dropCapturedFrames = dropCaptiuredFrames;
    }
    get recordedFrames() {
        return this._recordedFrames;
    }
    attach(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._page != null) {
                throw new Error('Already attached to a page');
            }
            yield this._attach(page);
            this._page = page;
        });
    }
    _attach(page) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    detach() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._page == null) {
                throw new Error('Already detached from a page');
            }
            yield this._detach(this._page);
            this._page = null;
        });
    }
    _detach(page) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    start(target, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._startStopMutex.runExclusive(() => __awaiter(this, void 0, void 0, function* () { return yield this._start(target, options); }));
        });
    }
    _start(target, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = Object.assign(Object.assign({}, PuppeteerCaptureBase.DEFAULT_START_OPTIONS), (options !== null ? options : {}));
            if (options.waitForFirstFrame == null) {
                throw new Error('options.waitForFirstFrame can not be null or undefined');
            }
            if (options.waitForFirstFrame == null) {
                throw new Error('options.waitForFirstFrame can not be null or undefined');
            }
            if (this._page == null) {
                throw new Error('Not attached to a page');
            }
            if (this._isCapturing) {
                throw new Error('Capture is in progress');
            }
            if (this._page.isClosed()) {
                throw new Error('Can not start capturing a closed page');
            }
            if (typeof target === 'string' || target instanceof String) {
                yield (0, promises_1.mkdir)((0, path_1.dirname)(target.toString()), { recursive: true });
            }
            const framesStream = new stream_1.PassThrough();
            (0, fluent_ffmpeg_1.setFfmpegPath)(this._options.ffmpeg != null
                ? this._options.ffmpeg
                : yield PuppeteerCaptureBase.findFfmpeg());
            const ffmpegStream = (0, fluent_ffmpeg_1.default)();
            ffmpegStream
                .input(framesStream)
                .inputFormat('image2pipe')
                .inputFPS(this._options.fps); // eslint-disable-line @typescript-eslint/no-non-null-assertion
            ffmpegStream
                .output(target)
                .outputFPS(this._options.fps); // eslint-disable-line @typescript-eslint/no-non-null-assertion
            if (this._options.size != null) {
                ffmpegStream
                    .size(this._options.size);
            }
            yield this._options.format(ffmpegStream); // eslint-disable-line @typescript-eslint/no-non-null-assertion
            if (this._options.customFfmpegConfig != null) {
                yield this._options.customFfmpegConfig(ffmpegStream);
            }
            this._page.once('close', this._onPageClose);
            this._target = target;
            this._captureTimestamp = 0;
            this._capturedFrames = 0;
            this._dropCapturedFrames = options.dropCapturedFrames; // eslint-disable-line @typescript-eslint/no-non-null-assertion
            this._recordedFrames = 0;
            this._error = null;
            this._framesStream = framesStream;
            this._ffmpegStream = ffmpegStream;
            this._ffmpegStarted = new Promise((resolve, reject) => {
                const onStart = () => {
                    ffmpegStream.off('error', onError);
                    resolve();
                };
                const onError = (reason) => {
                    ffmpegStream.off('start', onStart);
                    reject(reason);
                };
                ffmpegStream
                    .once('start', onStart)
                    .once('error', onError);
            });
            this._ffmpegExited = new Promise((resolve) => {
                this._ffmpegExitedResolve = resolve;
                const onEnd = () => {
                    ffmpegStream.off('error', onError);
                    resolve();
                };
                const onError = (reason) => {
                    ffmpegStream.off('end', onEnd);
                    this._error = reason;
                    resolve();
                    this._startStopMutex.runExclusive(() => __awaiter(this, void 0, void 0, function* () { return yield this._stop(); }))
                        .then(() => { })
                        .catch(() => { });
                };
                ffmpegStream
                    .once('error', onError)
                    .once('end', onEnd);
            });
            this._ffmpegStream.run();
            yield this._ffmpegStarted;
            this._pageWaitForTimeout = this._page.waitForTimeout;
            this._page.waitForTimeout = (milliseconds) => __awaiter(this, void 0, void 0, function* () {
                yield this.waitForTimeout(milliseconds);
            });
            this._isCapturing = true;
            this.emit('captureStarted');
            yield this.onPostCaptureStarted();
            if (options.waitForFirstFrame) {
                yield new Promise((resolve, reject) => {
                    const onFrameCaptured = () => {
                        this.off('frameCaptureFailed', onFrameCaptureFailed);
                        resolve();
                    };
                    const onFrameCaptureFailed = (reason) => {
                        this.off('frameCaptured', onFrameCaptured);
                        reject(reason);
                    };
                    this
                        .once('frameCaptured', onFrameCaptured)
                        .once('frameCaptureFailed', onFrameCaptureFailed);
                });
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._error != null) {
                const error = this._error;
                this._error = null;
                throw error;
            }
            yield this._startStopMutex.runExclusive(() => __awaiter(this, void 0, void 0, function* () { return yield this._stop(); }));
        });
    }
    _stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._page == null) {
                throw new Error('Not attached to a page');
            }
            if (!this._isCapturing) {
                throw new Error('Capture is not in progress');
            }
            this._isCapturing = false;
            while (this._frameBeingCaptured != null) {
                yield this._frameBeingCaptured;
            }
            if (this._ffmpegStarted != null) {
                yield this._ffmpegStarted;
                this._ffmpegStarted = null;
            }
            if (this._framesStream != null) {
                if (this._ffmpegStream != null) {
                    this._ffmpegStream.removeAllListeners('error');
                    this._ffmpegStream.once('error', () => {
                        if (this._ffmpegExitedResolve != null) {
                            this._ffmpegExitedResolve();
                        }
                    });
                }
                this._framesStream.end();
                this._framesStream = null;
            }
            if (this._ffmpegExited != null) {
                yield this._ffmpegExited;
                this._ffmpegExited = null;
                this._ffmpegExitedResolve = null;
            }
            if (this._ffmpegStream != null) {
                this._ffmpegStream = null;
            }
            if (this._target != null) {
                this._target = null;
            }
            if (this._pageWaitForTimeout != null) {
                this._page.waitForTimeout = this._pageWaitForTimeout;
            }
            this._page.off('close', this._onPageClose);
            this.emit('captureStopped');
            yield this.onPostCaptureStopped();
        });
    }
    waitForTimeout(milliseconds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isCapturing) {
                throw new Error('Can not wait for timeout while not capturing');
            }
            const desiredCaptureTimestamp = this._captureTimestamp + milliseconds;
            let waitPromiseResolve;
            let waitPromiseReject;
            const waitPromise = new Promise((resolve, reject) => {
                waitPromiseResolve = resolve;
                waitPromiseReject = reject;
            });
            const onFrameCaptured = () => {
                if (this._captureTimestamp < desiredCaptureTimestamp) {
                    return;
                }
                this
                    .off('frameCaptured', onFrameCaptured)
                    .off('frameCaptureFailed', onFrameCaptureFailed);
                waitPromiseResolve();
            };
            const onFrameCaptureFailed = (reason) => {
                this
                    .off('frameCaptured', onFrameCaptured)
                    .off('frameCaptureFailed', onFrameCaptureFailed);
                waitPromiseReject(reason);
            };
            this
                .on('frameCaptured', onFrameCaptured)
                .on('frameCaptureFailed', onFrameCaptureFailed);
            yield waitPromise;
        });
    }
    emit(eventName, ...args) {
        return super.emit(eventName, ...args);
    }
    onPostCaptureStarted() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    onPostCaptureStopped() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    onFrameCaptured(timestamp, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('frameCaptured', this._capturedFrames, timestamp, data);
            this._capturedFrames += 1;
            if (this._dropCapturedFrames) {
                return;
            }
            (_a = this._framesStream) === null || _a === void 0 ? void 0 : _a.write(data);
            this.emit('frameRecorded', this._recordedFrames, timestamp, data);
            this._recordedFrames += 1;
        });
    }
    onFrameCaptureFailed(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stop();
            this._error = reason;
            this.emit('frameCaptureFailed', reason);
        });
    }
    onPageClose() {
        this._error = new Error('Page was closed');
        this._startStopMutex.runExclusive(() => __awaiter(this, void 0, void 0, function* () {
            if (this._isCapturing) {
                yield this._stop();
            }
            yield this.detach();
        }))
            .then(() => { })
            .catch(() => { });
    }
    static findFfmpeg() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.FFMPEG != null) {
                return process.env.FFMPEG;
            }
            try {
                const systemFfmpeg = yield (0, which_1.default)('ffmpeg');
                return systemFfmpeg;
            }
            catch (e) { }
            try {
                const ffmpeg = require('@ffmpeg-installer/ffmpeg'); // eslint-disable-line @typescript-eslint/no-var-requires
                return ffmpeg.path;
            }
            catch (e) { }
            throw new Error('ffmpeg not available: specify FFMPEG environment variable, or make it available via PATH, or add @ffmpeg-installer/ffmpeg to the project');
        });
    }
}
exports.PuppeteerCaptureBase = PuppeteerCaptureBase;
PuppeteerCaptureBase.DEFAULT_OPTIONS = {
    fps: 60,
    format: (0, PuppeteerCaptureFormat_1.MP4)()
};
PuppeteerCaptureBase.DEFAULT_START_OPTIONS = {
    waitForFirstFrame: true,
    dropCapturedFrames: false
};
