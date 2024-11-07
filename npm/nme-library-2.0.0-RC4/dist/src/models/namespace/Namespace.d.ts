import { Address } from "../account/Address";
/**
 * A namespace is the NEM version of a domain. You can rent a namespace for the duration of a year by paying a fee.
 * The naming of the parts of a namespace has certain restrictions, see the corresponding chapter on namespaces.
 */
export declare class Namespace {
    /**
     * The fully qualified name of the namespace, also named namespace id.
     */
    readonly name: string;
    /**
     * The owner of the namespace.
     */
    readonly owner: Address;
    /**
     * The height at which the ownership begins.
     */
    readonly height: number;
    /**
     * The database id for the namespace object.
     */
    readonly id?: number;
}
