import { Method } from 'axios';
import { HeadersType, HttpProviderInstance } from '../../types/Providers.js';
export default class HttpProvider {
    host: string;
    timeout: number;
    user: string;
    password: string;
    headers: HeadersType;
    statusPage: string;
    instance: HttpProviderInstance;
    constructor(host: string, timeout?: number, user?: string, password?: string, headers?: HeadersType, statusPage?: string);
    setStatusPage(statusPage?: string): void;
    isConnected(statusPage?: string): Promise<boolean | 0>;
    request<T = unknown>(url: string, payload?: {}, method?: Method): Promise<T>;
}
