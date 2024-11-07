import { Node } from "./Node";
/**
 * When exchanging data with other nodes the result of the communication is divided into three
 * different outcomes: success, neutral and failure.
 * In the cases of success and failure the result is saved to be able to judge the quality of a node.
 * This has influence on the probability that a certain node is selected as partner.
 */
export declare class ExtendedNodeExperience {
    /**
     * Denotes the beginning of the of the Node substructure.
     */
    readonly node: Node;
    /**
     * The number of synchronization attempts the node had with the remote node.
     */
    readonly syncs: number;
    /**
     * Denotes the beginning of the of the NodeExperience substructure.
     */
    readonly experience: ExtendedNodeExperienceData;
}
/**
 * Node experience data
 */
export declare class ExtendedNodeExperienceData {
    /**
     * The number of successful communications with the remote node.
     */
    readonly s: number;
    /**
     * The number of failed communications with the remote node.
     */
    readonly f: number;
}
