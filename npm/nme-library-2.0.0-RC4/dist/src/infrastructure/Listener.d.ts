import { Client } from "@stomp/stompjs";
import { Protocol } from "./HttpEndpoint";
export interface WebSocketConfig {
    readonly protocol?: Protocol;
    readonly domain?: string;
    readonly port?: number;
}
export declare abstract class Listener {
    private readonly nodes;
    private pointer;
    constructor(nodes?: WebSocketConfig[]);
    protected createClient(): Client;
    protected nextNode(): string;
}
