import { AxiosInstance } from 'axios';
import { AxiosAuthRefreshOptions } from './model';
export { AxiosAuthRefreshOptions, AxiosAuthRefreshRequestConfig } from './model';
/**
 * Creates an authentication refresh interceptor that binds to any error response.
 * If the response status code is one of the options.statusCodes, interceptor calls the refreshAuthCall
 * which must return a Promise. While refreshAuthCall is running, all the new requests are intercepted and are waiting
 * for the refresh call to resolve. While running the refreshing call, instance provided is marked as a paused instance
 * which indicates the interceptor to not intercept any responses from it. This is because you'd otherwise need to mark
 * the specific requests you make by yourself in order to make sure it's not intercepted. This behavior can be
 * turned off, but use it with caution as you need to mark the requests with `skipAuthRefresh` flag yourself in order to
 * not run into interceptors loop.
 *
 * @param {AxiosInstance} instance - Axios HTTP client instance
 * @param {(error: any) => Promise<AxiosPromise>} refreshAuthCall - refresh token call which must return a Promise
 * @param {AxiosAuthRefreshOptions} options - options for the interceptor @see defaultOptions
 * @return {number} - interceptor id (in case you want to eject it manually)
 */
export default function createAuthRefreshInterceptor(instance: AxiosInstance, refreshAuthCall: (error: any) => Promise<any>, options?: AxiosAuthRefreshOptions): number;
