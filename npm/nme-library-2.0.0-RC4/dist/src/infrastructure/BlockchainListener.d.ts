import { Observable } from "rxjs";
import { Block } from "../models";
import { BlockHeight } from "./BlockHttp";
import { Listener, WebSocketConfig } from "./Listener";
/**
 * Blockchain listener
 */
export declare class BlockchainListener extends Listener {
    /**
     * Constructor
     * @param nodes
     */
    constructor(nodes?: WebSocketConfig[]);
    /**
     * Start listening new blocks
     * @returns {Observable<Block>}
     */
    newBlock(): Observable<Block>;
    /**
     * Start listening new blockchain height
     * @returns {Observable<BlockHeight>}
     */
    newHeight(): Observable<BlockHeight>;
}
