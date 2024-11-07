/**
 * Nodes are the entities that perform communication in the network like sending and receiving data.
 * A node has an identity which is tied to an account through which the node can identify itself to the network.
 * The communication is done through the endpoint of the node. Additionally a node provides meta data information.
 */
export interface NodeDTO {
    /**
     * Denotes the beginning of the meta data substructure.
     */
    readonly metaData: NodeMetaDataDTO;
    /**
     * Denotes the beginning of the endpoint substructure.
     */
    readonly endpoint: NodeEndpointDTO;
    /**
     * Denotes the beginning of the identity substructure.
     */
    readonly identity: NodeIdentityDTO;
}
