import { Node } from "./Node";
/**
 * A NodeCollection object holds arrays of nodes with different statuses.
 */
export declare class NodeCollection {
    /**
     * A connection to the node cannot be established.
     */
    readonly inactive: Node[];
    /**
     * A connection can be established and the remote node responds in a timely manner.
     */
    readonly active: Node[];
    /**
     * A connection can be established but the node cannot provide information within the timeout limits.
     */
    readonly busy: Node[];
    /**
     * A fatal error occurs when trying to establish a connection or the node couldn't authenticate itself correctly.
     */
    readonly failure: Node[];
}
