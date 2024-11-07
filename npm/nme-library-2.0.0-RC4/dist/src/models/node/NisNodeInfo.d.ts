import { Node } from "./Node";
/**
 * A NodeCollection object holds arrays of nodes with different statuses.
 */
export declare class NisNodeInfo {
    /**
     * Denotes the beginning of the node substructure.
     */
    readonly node: Node;
    /**
     * Denotes the beginning of the application meta data substructure.
     */
    readonly nisInfo: ApplicationMetaData;
}
/**
 * The application meta data object supplies additional information about the application running on a node.
 */
export declare class ApplicationMetaData {
    /**
     * The current network time, i.e. the number of seconds that have elapsed since the creation of the nemesis block.
     */
    readonly currentTime: number;
    /**
     * The name of the application running on the node.
     */
    readonly application: string;
    /**
     * The network time when the application was started.
     */
    readonly startTime: number;
    /**
     * The application version.
     */
    readonly version: string;
    /**
     * The signer of the certificate used by the application.
     */
    readonly signer: string;
}
