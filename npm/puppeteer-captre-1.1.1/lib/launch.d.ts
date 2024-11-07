import type { Browser as PuppeteerBrowser, BrowserConnectOptions as PuppeteerBrowserConnectOptions, BrowserLaunchArgumentOptions as PuppeteerBrowserLaunchArgumentOptions, LaunchOptions as PuppeteerLaunchOptions, Product as PuppeteerProduct } from 'puppeteer';
export declare function launch(options?: PuppeteerLaunchOptions & PuppeteerBrowserLaunchArgumentOptions & PuppeteerBrowserConnectOptions & {
    product?: PuppeteerProduct;
    extraPrefsFirefox?: Record<string, unknown>;
}): Promise<PuppeteerBrowser>;
