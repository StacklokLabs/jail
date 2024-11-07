import type { Page as PuppeteerPage } from 'puppeteer';
import { PuppeteerCapture } from './PuppeteerCapture';
import { PuppeteerCaptureOptions } from './PuppeteerCaptureOptions';
export declare function capture(page: PuppeteerPage, options?: PuppeteerCaptureOptions & {
    attach?: boolean;
}): Promise<PuppeteerCapture>;
