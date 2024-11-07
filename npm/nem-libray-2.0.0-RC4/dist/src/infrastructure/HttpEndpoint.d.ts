export declare type Protocol = "http" | "https";
export interface ServerConfig {
    readonly protocol?: Protocol;
    readonly domain: string;
    readonly port?: number;
}
export declare abstract class HttpEndpoint {
    private resource;
    private readonly nodes;
    private readonly historicalNodes;
    private pointer;
    private historicalPointer;
    constructor(resource: string, nodes?: ServerConfig[], preferProtocol?: Protocol);
    protected replyWhenRequestError: (errors: any) => any;
}
