import { Observable } from "rxjs";
import { Block } from "../models/blockchain/Block";
import { HttpEndpoint, ServerConfig } from "./HttpEndpoint";
export declare type BlockHeight = number;
export declare type BlockChainScore = number;
export declare class BlockHttp extends HttpEndpoint {
    constructor(nodes?: ServerConfig[]);
    /**
     * Gets a block from the chain that has a given hash.
     * @param blockHeight
     * @returns Observable<Block>
     */
    getBlockByHeight(blockHeight: BlockHeight): Observable<Block>;
}
