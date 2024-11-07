import { Observable } from "rxjs";
import { Block } from "../models/blockchain/Block";
import { BlockChainScore, BlockHeight } from "./BlockHttp";
import { HttpEndpoint, ServerConfig } from "./HttpEndpoint";
export declare class ChainHttp extends HttpEndpoint {
    constructor(nodes?: ServerConfig[]);
    /**
     * Gets the current height of the block chain.
     * @returns Observable<BlockHeight>
     */
    getBlockchainHeight(): Observable<BlockHeight>;
    /**
     * Gets the current score of the block chain. The higher the score, the better the chain.
     * During synchronization, nodes try to get the best block chain in the network.
     * @returns Observable<BlockChainScore>
     */
    getBlockchainScore(): Observable<BlockChainScore>;
    /**
     * Gets the current last block of the chain.
     * @returns Observable<Block>
     */
    getBlockchainLastBlock(): Observable<Block>;
}
