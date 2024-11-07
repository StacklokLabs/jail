import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import { AxiosAuthRefreshOptions, AxiosAuthRefreshCache } from './model';
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    skipAuthRefresh?: boolean;
}
export declare const defaultOptions: AxiosAuthRefreshOptions;
/**
 * Merges two options objects (options overwrites defaults).
 *
 * @return {AxiosAuthRefreshOptions}
 */
export declare function mergeOptions(defaults: AxiosAuthRefreshOptions, options: AxiosAuthRefreshOptions): AxiosAuthRefreshOptions;
/**
 * Returns TRUE: when error.response.status is contained in options.statusCodes
 * Returns FALSE: when error or error.response doesn't exist or options.statusCodes doesn't include response status
 *
 * @return {boolean}
 */
export declare function shouldInterceptError(error: any, options: AxiosAuthRefreshOptions, instance: AxiosInstance, cache: AxiosAuthRefreshCache): boolean;
/**
 * Creates refresh call if it does not exist or returns the existing one.
 *
 * @return {Promise<any>}
 */
export declare function createRefreshCall(error: any, fn: (error: any) => Promise<any>, cache: AxiosAuthRefreshCache): Promise<any>;
/**
 * Creates request queue interceptor if it does not exist and returns its id.
 *
 * @return {number}
 */
export declare function createRequestQueueInterceptor(instance: AxiosInstance, cache: AxiosAuthRefreshCache, options: AxiosAuthRefreshOptions): number;
/**
 * Ejects request queue interceptor and unset interceptor cached values.
 *
 * @param {AxiosInstance} instance
 * @param {AxiosAuthRefreshCache} cache
 */
export declare function unsetCache(instance: AxiosInstance, cache: AxiosAuthRefreshCache): void;
/**
 * Returns instance that's going to be used when requests are retried
 *
 * @param instance
 * @param options
 */
export declare function getRetryInstance(instance: AxiosInstance, options: AxiosAuthRefreshOptions): AxiosInstance;
/**
 * Resend failed axios request.
 *
 * @param {any} error
 * @param {AxiosInstance} instance
 * @return AxiosPromise
 */
export declare function resendFailedRequest(error: any, instance: AxiosInstance): AxiosPromise;
