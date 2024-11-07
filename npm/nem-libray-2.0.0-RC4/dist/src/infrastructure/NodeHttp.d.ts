import { Observable } from "rxjs";
import { ExtendedNodeExperience } from "../models/node/ExtendedNodeExperience";
import { NisNodeInfo } from "../models/node/NisNodeInfo";
import { Node } from "../models/node/Node";
import { NodeCollection } from "../models/node/NodeCollection";
import { BlockHeight } from "./BlockHttp";
import { HttpEndpoint, ServerConfig } from "./HttpEndpoint";
export declare class NodeHttp extends HttpEndpoint {
    constructor(nodes?: ServerConfig[]);
    /**
     * Gets basic information about a node
     * @returns Observable<Node>
     */
    getNodeInfo(): Observable<Node>;
    /**
     * Gets extended information about a node
     * @returns Observable<NisNodeInfo>
     */
    getNisNodeInfo(): Observable<NisNodeInfo>;
    /**
     * Gets an array of all known nodes in the neighborhood.
     * @returns Observable<NodeCollection>
     */
    getAllNodes(): Observable<NodeCollection>;
    /**
     * Gets an array of all nodes with status 'active' in the neighborhood.
     * @returns Observable<Node[]>
     */
    getActiveNodes(): Observable<Node[]>;
    /**
     * Gets an array of active nodes in the neighborhood that are selected for broadcasts.
     * @returns Observable<Node[]>
     */
    getActiveNeighbourNodes(): Observable<Node[]>;
    /**
     * Requests the chain height from every node in the active node list and returns the maximum height seen.
     * @returns Observable<BlockHeight>
     */
    getMaximumChainHeightInActiveNeighborhood(): Observable<BlockHeight>;
    /**
     * Requests the chain height from every node in the active node list and returns the maximum height seen.
     * @returns Observable<ExtendedNodeExperience[]>
     */
    getNodeExperiences(): Observable<ExtendedNodeExperience[]>;
}
