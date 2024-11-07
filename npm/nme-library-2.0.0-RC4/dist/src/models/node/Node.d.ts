import { PublicAccount } from "../account/PublicAccount";
import { NetworkTypes } from "./NetworkTypes";
/**
 * Nodes are the entities that perform communication in the network like sending and receiving data.
 * A node has an identity which is tied to an account through which the node can identify itself to the network.
 * The communication is done through the endpoint of the node. Additionally a node provides meta data information.
 */
export declare class Node {
    /**
     * Denotes the beginning of the meta data substructure.
     */
    readonly metaData: NodeMetaData;
    /**
     * Denotes the beginning of the endpoint substructure.
     */
    readonly endpoint: NodeEndpoint;
    /**
     * Denotes the beginning of the identity substructure.
     */
    readonly identity: NodeIdentity;
}
/**
 * Node meta data
 */
export declare class NodeMetaData {
    /**
     * The number of features the nodes has.
     */
    readonly features: number;
    /**
     * The network id
     */
    readonly network: NetworkTypes;
    /**
     * The name of the application that is running the node.
     */
    readonly application: string;
    /**
     * The version of the application.
     */
    readonly version: string;
    /**
     * The underlying platform (OS, java version).
     */
    readonly platform: string;
}
/**
 * Node endpoint
 */
export declare class NodeEndpoint {
    /**
     * The protocol used for the communication (HTTP or HTTPS).
     */
    readonly protocol: string;
    /**
     * The port used for the communication.
     */
    readonly port: number;
    /**
     * The IP address of the endpoint.
     */
    readonly host: string;
}
/**
 * Node identity
 */
export declare class NodeIdentity {
    /**
     * The name of the node.
     */
    readonly name: string;
    /**
     * The public account used to identify the node.
     */
    readonly publicAccount?: PublicAccount;
}
