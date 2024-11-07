import type { Browser as PuppeteerBrowser, CDPSession as PuppeteerCDPSession, Page as PuppeteerPage } from 'puppeteer';
import { Protocol } from 'devtools-protocol';
import { PuppeteerCaptureBase } from './PuppeteerCaptureBase';
import { PuppeteerCaptureOptions } from './PuppeteerCaptureOptions';
export declare class PuppeteerCaptureViaHeadlessExperimental extends PuppeteerCaptureBase {
    static readonly REQUIRED_ARGS: string[];
    protected static readonly INJECTED = "__PuppeteerCaptureViaHeadlessExperimental";
    protected static readonly EJECTOR: string;
    protected readonly _injected: string;
    protected readonly _injector: string;
    protected readonly _ejector: string;
    protected readonly _requestFrameCapture: () => void;
    protected readonly _onSessionDisconnected: () => void;
    protected _session: PuppeteerCDPSession | null;
    protected _onNewDocumentScript: Protocol.Page.ScriptIdentifier | null;
    constructor(options?: PuppeteerCaptureOptions);
    protected getPageClient(page: PuppeteerPage): PuppeteerCDPSession;
    protected _attach(page: PuppeteerPage): Promise<void>;
    protected _detach(page: PuppeteerPage): Promise<void>;
    protected requestFrameCapture(): void;
    protected doRequestFrameCapture(page: PuppeteerPage, session: PuppeteerCDPSession): void;
    protected onPostCaptureStarted(): Promise<void>;
    protected onPostCaptureStopped(): Promise<void>;
    protected onSessionDisconnected(): void;
    protected static validateBrowserArgs(browser: PuppeteerBrowser): void;
    protected static generateInjector(fps: number): string;
}
