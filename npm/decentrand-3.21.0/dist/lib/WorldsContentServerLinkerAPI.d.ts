/// <reference types="node" />
import { EventEmitter } from 'events';
export declare type WorldsContentServerResponse = {
    address: string;
    signature: string;
};
/**
 * Events emitted by this class:
 *
 * link:ready   - The server is up and running
 * link:success - Signature success
 * link:error   - The transaction failed and the server was closed
 */
export declare class WorldsContentServerLinkerAPI extends EventEmitter {
    private data;
    private app;
    constructor(data: any);
    link(port: number, isHttps: boolean): Promise<unknown>;
    private setRoutes;
}
//# sourceMappingURL=WorldsContentServerLinkerAPI.d.ts.map