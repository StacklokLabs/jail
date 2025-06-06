/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import dns from 'dns';
import { URL } from 'url';
import { EventEmitter } from 'events';
import { Buffer } from 'buffer';
import { Socket } from './socket';
export interface HandlerOpts {
    upstreamProxyUrlParsed: URL;
    localAddress?: string;
    ipFamily?: number;
    dnsLookup?: typeof dns['lookup'];
    customTag?: unknown;
}
interface ChainOpts {
    request: {
        url?: string;
    };
    sourceSocket: Socket;
    head?: Buffer;
    handlerOpts: HandlerOpts;
    server: EventEmitter & {
        log: (connectionId: unknown, str: string) => void;
    };
    isPlain: boolean;
}
/**
 * Passes the traffic to upstream HTTP proxy server.
 * Client -> Apify -> Upstream -> Web
 * Client <- Apify <- Upstream <- Web
 */
export declare const chain: ({ request, sourceSocket, head, handlerOpts, server, isPlain, }: ChainOpts) => void;
export {};
//# sourceMappingURL=chain.d.ts.map