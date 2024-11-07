/// <reference types="node" />
import { EventEmitter } from 'events';
import { Page } from 'puppeteer';
import { PuppeteerScreenRecorderOptions } from './pageVideoStreamTypes';
/**
 * @ignore
 */
export declare class pageVideoStreamCollector extends EventEmitter {
    private page;
    private options;
    private sessionsStack;
    private isStreamingEnded;
    private isFrameAckReceived;
    constructor(page: Page, options: PuppeteerScreenRecorderOptions);
    private get shouldFollowPopupWindow();
    private getPageSession;
    private getCurrentSession;
    private addListenerOnTabOpens;
    private removeListenerOnTabClose;
    private registerTabListener;
    private startScreenCast;
    private stopScreenCast;
    private startSession;
    private handleScreenCastFrame;
    private endSession;
    start(): Promise<void>;
    stop(): Promise<boolean>;
}
