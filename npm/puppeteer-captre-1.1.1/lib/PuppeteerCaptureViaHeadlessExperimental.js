"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerCaptureViaHeadlessExperimental = void 0;
const MissingHeadlessExperimentalRequiredArgs_1 = require("./MissingHeadlessExperimentalRequiredArgs");
const PuppeteerCaptureBase_1 = require("./PuppeteerCaptureBase");
class PuppeteerCaptureViaHeadlessExperimental extends PuppeteerCaptureBase_1.PuppeteerCaptureBase {
    constructor(options) {
        super(options);
        this._injected = PuppeteerCaptureViaHeadlessExperimental.INJECTED;
        this._injector = PuppeteerCaptureViaHeadlessExperimental.generateInjector(this._options.fps); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        this._ejector = PuppeteerCaptureViaHeadlessExperimental.EJECTOR;
        this._requestFrameCapture = this.requestFrameCapture.bind(this);
        this._onSessionDisconnected = this.onSessionDisconnected.bind(this);
        this._session = null;
        this._onNewDocumentScript = null;
        if (process.platform === 'darwin') {
            throw new Error('MacOS is not supported by HeadlessExperimental.BeginFrame');
        }
    }
    getPageClient(page) {
        // Before puppeteer 14.4.0, the internal method was client()
        if ('client' in page) {
            // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
            // @ts-ignore
            return page.client();
        }
        // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        return page._client();
    }
    _attach(page) {
        return __awaiter(this, void 0, void 0, function* () {
            PuppeteerCaptureViaHeadlessExperimental.validateBrowserArgs(page.browser());
            const session = yield page.target().createCDPSession();
            // NOTE: For some reason, page.client() has to be used instead of newly created session
            const onNewDocumentScript = (yield this.getPageClient(page).send('Page.addScriptToEvaluateOnNewDocument', {
                source: this._injector
            })).identifier;
            session.on('CDPSession.Disconnected', this._onSessionDisconnected);
            this._session = session;
            this._onNewDocumentScript = onNewDocumentScript;
        });
    }
    _detach(page) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this._onNewDocumentScript != null) {
                // NOTE: For details, see send('Page.addScriptToEvaluateOnNewDocument') code
                yield this.getPageClient(page).send('Page.removeScriptToEvaluateOnNewDocument', {
                    identifier: this._onNewDocumentScript
                });
                this._onNewDocumentScript = null;
            }
            if (((_a = this._session) === null || _a === void 0 ? void 0 : _a.connection()) != null) {
                this._session.off('CDPSession.Disconnected', this._onSessionDisconnected);
                yield this._session.detach();
                this._session = null;
            }
        });
    }
    requestFrameCapture() {
        if (!this._isCapturing || this._error != null) {
            return;
        }
        if (this._page == null) {
            throw new Error('Not attached to a page');
        }
        if (this._session == null) {
            throw new Error('No session available');
        }
        if (this._session.connection() == null) {
            throw new Error('Session disconnected');
        }
        this.doRequestFrameCapture(this._page, this._session);
    }
    doRequestFrameCapture(page, session) {
        const captureTimestamp = this._captureTimestamp;
        const frameInterval = this._frameInterval;
        this._frameBeingCaptured = Promise.all(page.frames().map((frame) => __awaiter(this, void 0, void 0, function* () {
            yield frame.evaluate(`${this._injected}.process(${captureTimestamp})`);
        }))).then(() => __awaiter(this, void 0, void 0, function* () {
            return yield session.send('HeadlessExperimental.beginFrame', {
                frameTimeTicks: captureTimestamp,
                interval: frameInterval,
                noDisplayUpdates: false,
                screenshot: { format: 'png' }
            });
        })).then(({ screenshotData: dataBase64 }) => __awaiter(this, void 0, void 0, function* () {
            this._frameBeingCaptured = null;
            if (!this._isCapturing) {
                return;
            }
            if (dataBase64 == null) {
                setTimeout(this._requestFrameCapture, 0);
                return;
            }
            const data = Buffer.from(dataBase64, 'base64');
            yield this.onFrameCaptured(captureTimestamp, data);
            if (this._isCapturing) {
                this._captureTimestamp = captureTimestamp + frameInterval;
                setTimeout(this._requestFrameCapture, 0);
            }
        }), (reason) => __awaiter(this, void 0, void 0, function* () {
            this._frameBeingCaptured = null;
            if (!this._isCapturing) {
                return;
            }
            yield this.onFrameCaptureFailed(reason);
        }));
    }
    onPostCaptureStarted() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = this._page;
            const session = this._session;
            if (page == null || ((_a = this.getPageClient(page)) === null || _a === void 0 ? void 0 : _a.connection()) == null || (session === null || session === void 0 ? void 0 : session.connection()) == null) {
                return;
            }
            for (const frame of page.frames()) {
                yield frame.evaluate(this._injector);
                yield frame.evaluate(`${this._injected}.activate()`);
            }
            yield session.send('HeadlessExperimental.enable');
            this.doRequestFrameCapture(page, session);
        });
    }
    onPostCaptureStopped() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = this._page;
            const session = this._session;
            if (page == null || ((_a = this.getPageClient(page)) === null || _a === void 0 ? void 0 : _a.connection()) == null || (session === null || session === void 0 ? void 0 : session.connection()) == null) {
                return;
            }
            for (const frame of page.frames()) {
                yield frame.evaluate(`${this._injected}.deactivate()`);
                yield frame.evaluate(this._ejector);
            }
            yield session.send('HeadlessExperimental.disable');
        });
    }
    onSessionDisconnected() {
        this._error = new Error('Session was disconnected');
        this._startStopMutex.runExclusive(() => __awaiter(this, void 0, void 0, function* () {
            if (this._isCapturing) {
                yield this._stop();
            }
            yield this.detach();
        }))
            .then(() => { })
            .catch(() => { });
    }
    static validateBrowserArgs(browser) {
        var _a;
        const spawnargs = (_a = browser.process()) === null || _a === void 0 ? void 0 : _a.spawnargs;
        if (spawnargs == null || !PuppeteerCaptureViaHeadlessExperimental.REQUIRED_ARGS.every(arg => spawnargs.includes(arg))) {
            throw new MissingHeadlessExperimentalRequiredArgs_1.MissingHeadlessExperimentalRequiredArgs();
        }
    }
    static generateInjector(fps) {
        return (`
      if (typeof ${PuppeteerCaptureViaHeadlessExperimental.INJECTED} === 'undefined') {
        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED} = {
          active: false,
          scheduledSimulatedProcessing: null,
          previousSimulatedProcessingTimestamp: null,
          simulatedProcessFPS: ${fps},
          original: {},
          dateOrigin: new Date(),
          performanceNowOrigin: performance.now(),
          timestampOffsetFromOrigin: 0,
          animationFrameRequests: [],
          intervalTimers: [],
          timeoutTimers: [],
        };

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.activate = function () {
          if (${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.active) {
            return;
          }

          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.dateOrigin = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.newDate();
          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.performanceNowOrigin = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.previousSimulatedProcessingTimestamp;
          if (${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.performanceNowOrigin === null) {
            ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.performanceNowOrigin = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.performanceNow();
          }

          if (${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.scheduledSimulatedProcessing) {
            ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.window_clearTimeout(${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.scheduledSimulatedProcessing);
            ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.scheduledSimulatedProcessing = null;
          }

          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.active = true;
        };

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.deactivate = function () {
          if (!${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.active) {
            return;
          }

          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.dateOrigin = null;
          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.performanceNowOrigin = null;

          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.previousSimulatedProcessingTimestamp = -${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.timestampOffsetFromOrigin;
          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.scheduledSimulatedProcessing = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.window_setTimeout(
            ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.simulatedProcess,
            1000 / ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.simulatedProcessFPS,
          );

          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.active = false;
        };

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.getTimestamp = function () {
          return ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.performanceNowOrigin + ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.timestampOffsetFromOrigin;
        }

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.Date = Date;
        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.newDate = function () {
          return new ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.Date();
        }
        Date = function () {
          var OriginalDate = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.Date;
          // NOTE: ECMA-262 says that using apply() is not possible: The function call Date(…) is not equivalent to the object creation expression new Date(…) with the same arguments.
          switch (arguments.length) {
            case 0:
              return new OriginalDate(
                ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.dateOrigin.getTime() + ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.timestampOffsetFromOrigin
              );
            case 1:
              return new OriginalDate(
                arguments[0],
              );
            case 2:
              return new OriginalDate(
                arguments[0],
                arguments[1],
              );
            case 3:
              return new OriginalDate(
                arguments[0],
                arguments[1],
                arguments[2],
              );
            case 4:
              return new OriginalDate(
                arguments[0],
                arguments[1],
                arguments[2],
                arguments[3],
              );
            case 5:
              return new OriginalDate(
                arguments[0],
                arguments[1],
                arguments[2],
                arguments[3],
                arguments[4],
              );
            case 6:
              return new OriginalDate(
                arguments[0],
                arguments[1],
                arguments[2],
                arguments[3],
                arguments[4],
                arguments[5],
              );
            case 7:
              return new OriginalDate(
                arguments[0],
                arguments[1],
                arguments[2],
                arguments[3],
                arguments[4],
                arguments[5],
                arguments[6],
              );
          };
        };
        Date.now = function () {
          return ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.dateOrigin.getTime() + ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.timestampOffsetFromOrigin;
        };

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.performance_now = performance.now;
        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.performanceNow = performance.now.bind(performance);
        performance.now = function () {
          return ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.performanceNowOrigin + ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.timestampOffsetFromOrigin;
        };

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_setInterval = window.setInterval;
        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.window_setInterval = window.setInterval.bind(window);
        window.setInterval = function (callback, interval, ...parameters) {
          return ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.intervalTimers.push({
            interval,
            executionTimestamp: ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.getTimestamp(),
            callback,
            parameters,
          });
        };

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_clearInterval = window.clearInterval;
        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.window_clearInterval = window.clearInterval.bind(window);
        window.clearInterval = function (timer) {
          delete ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.intervalTimers[timer - 1];
        };

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_setTimeout = window.setTimeout;
        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.window_setTimeout = window.setTimeout.bind(window);
        window.setTimeout = function (callback, timeout, ...parameters) {
          return ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.timeoutTimers.push({
            timeout,
            enqueuedTimestamp: ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.getTimestamp(),
            callback,
            parameters,
          });
        };

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_clearTimeout = window.clearTimeout;
        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.window_clearTimeout = window.clearTimeout.bind(window);
        window.clearTimeout = function (timer) {
          delete ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.timeoutTimers[timer - 1];
        };

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_requestAnimationFrame = window.requestAnimationFrame;
        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.window_requestAnimationFrame = window.requestAnimationFrame.bind(window);
        window.requestAnimationFrame = function (callback) {
          return ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.animationFrameRequests.push({
            callback,
          });
        };

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_cancelAnimationFrame = window.cancelAnimationFrame;
        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.window_cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
        window.cancelAnimationFrame = function (request) {
          delete ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.animationFrameRequests[request - 1];
        };

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.process = function (timestampOffsetFromOrigin) {
          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.timestampOffsetFromOrigin = timestampOffsetFromOrigin;
          var timestamp = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.getTimestamp();

          var intervalTimers = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.intervalTimers.slice();
          var timeoutTimers = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.timeoutTimers.slice();
          var animationFrameRequests = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.animationFrameRequests.slice();

          intervalTimers.forEach(function (intervalTimer) {
            while (intervalTimer.executionTimestamp + intervalTimer.interval <= timestamp) {
              if (intervalTimer.callback) {
                intervalTimer.callback.apply(undefined, intervalTimer.parameters);
              }
              intervalTimer.executionTimestamp += intervalTimer.interval;
            }
          });

          timeoutTimers.forEach(function (timeoutTimer, timeoutTimerIndex) {
            if (timeoutTimer.enqueuedTimestamp + timeoutTimer.timeout <= timestamp) {
              if (timeoutTimer.callback) {
                timeoutTimer.callback.apply(undefined, timeoutTimer.parameters);
              }
              delete ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.timeoutTimers[timeoutTimerIndex];
            }
          });

          animationFrameRequests.forEach(function (animationFrameRequest, animationFrameRequestIndex) {
            if (animationFrameRequest.callback) {
              animationFrameRequest.callback.apply(undefined, [timestamp]);
            }
            delete ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.animationFrameRequests[animationFrameRequestIndex];
          });
        }

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.simulatedProcess = function () {
          if (${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.active) {
            return;
          }

          var timestamp = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.performanceNow();

          if (${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.previousSimulatedProcessingTimestamp === null) {
            ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.previousSimulatedProcessingTimestamp = timestamp;
          } else if (${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.previousSimulatedProcessingTimestamp < 0) {
            ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.previousSimulatedProcessingTimestamp += timestamp;
          }

          var timestampDelta = timestamp - ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.previousSimulatedProcessingTimestamp;
          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.process(
            ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.timestampOffsetFromOrigin + timestampDelta
          );
          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.previousSimulatedProcessingTimestamp = timestamp;

          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.scheduledSimulatedProcessing = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.window_setTimeout(
            ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.simulatedProcess,
            1000 / ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.simulatedProcessFPS,
          );
        }

        ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.scheduledSimulatedProcessing = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.window_setTimeout(
          ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.simulatedProcess,
          1000 / ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.simulatedProcessFPS,
        );
      }
      `);
    }
}
exports.PuppeteerCaptureViaHeadlessExperimental = PuppeteerCaptureViaHeadlessExperimental;
PuppeteerCaptureViaHeadlessExperimental.REQUIRED_ARGS = [
    '--deterministic-mode',
    '--enable-begin-frame-control',
    '--disable-new-content-rendering-timeout',
    '--run-all-compositor-stages-before-draw',
    '--disable-threaded-animation',
    '--disable-threaded-scrolling',
    '--disable-checker-imaging',
    '--disable-image-animation-resync',
    '--enable-surface-synchronization'
];
PuppeteerCaptureViaHeadlessExperimental.INJECTED = '__PuppeteerCaptureViaHeadlessExperimental';
PuppeteerCaptureViaHeadlessExperimental.EJECTOR = `
    if (typeof ${PuppeteerCaptureViaHeadlessExperimental.INJECTED} !== 'undefined') {
      Date = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.Date;
      performance.now = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.performance_now;
      window.setInterval = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_setInterval;
      window.clearInterval = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_clearInterval;
      window.setTimeout = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_setTimeout;
      window.clearTimeout = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_clearTimeout;
      window.requestAnimationFrame = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_requestAnimationFrame;
      window.cancelAnimationFrame = ${PuppeteerCaptureViaHeadlessExperimental.INJECTED}.original.window_cancelAnimationFrame;

      delete ${PuppeteerCaptureViaHeadlessExperimental.INJECTED};
    }
    `;
