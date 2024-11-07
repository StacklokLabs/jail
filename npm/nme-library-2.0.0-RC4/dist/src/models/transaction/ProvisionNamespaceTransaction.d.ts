import { TransactionDTO } from "../../infrastructure/transaction/TransactionDTO";
import { Address } from "../account/Address";
import { TimeWindow } from "./TimeWindow";
import { Transaction } from "./Transaction";
/**
 * Accounts can rent a namespace for one year and after a year renew the contract. This is done via a ProvisionNamespaceTransaction.
 */
export declare class ProvisionNamespaceTransaction extends Transaction {
    /**
     * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
     */
    readonly fee: number;
    /**
     * The Address to which the rental fee is transferred.
     */
    readonly rentalFeeSink: Address;
    /**
     * The fee for renting the namespace.
     */
    readonly rentalFee: number;
    /**
     * The parent namespace. This can be undefined if the transaction rents a root namespace.
     */
    readonly parent?: string;
    /**
     * The new part which is concatenated to the parent with a '.' as separator.
     */
    readonly newPart: string;
    /**
     * Create DTO of ProvisionNamespaceTransaction
     * @returns {TransactionDTO}
     */
    toDTO(): TransactionDTO;
    /**
     * Create a ProvisionNamespaceTransaction object
     * @param timeWindow
     * @param newPart
     * @param parent
     * @returns {ProvisionNamespaceTransaction}
     */
    static create(timeWindow: TimeWindow, newPart: string, parent?: string): ProvisionNamespaceTransaction;
    /**
     *
     * @param {TimeWindow} timeWindow
     * @param {string} namespaceName - Root namespace provision
     * @returns {ProvisionNamespaceTransaction}
     */
    static createRoot(timeWindow: TimeWindow, namespaceName: string): ProvisionNamespaceTransaction;
    /**
     *
     * @param {TimeWindow} timeWindow
     * @param {string }parentNamespace
     * @param {string} newNamespaceName
     * @returns {ProvisionNamespaceTransaction}
     */
    static createSub(timeWindow: TimeWindow, parentNamespace: string, newNamespaceName: string): ProvisionNamespaceTransaction;
}
