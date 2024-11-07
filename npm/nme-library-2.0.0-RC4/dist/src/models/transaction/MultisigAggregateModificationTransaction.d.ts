import { TransactionDTO } from "../../infrastructure/transaction/TransactionDTO";
import { PublicAccount } from "../account/PublicAccount";
import { TimeWindow } from "./TimeWindow";
import { Transaction } from "./Transaction";
/**
 * Multisig aggregate modification transactions are part of the NEM's multisig account system.
 * A multisig aggregate modification transaction holds an array of multisig cosignatory modifications and a single multisig minimum cosignatories modification inside the transaction.
 * A multisig aggregate modification transaction can be wrapped by a multisig transaction.
 */
export declare class MultisigAggregateModificationTransaction extends Transaction {
    /**
     * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
     */
    fee: number;
    /**
     * Value indicating the relative change of the minimum cosignatories.
     */
    readonly relativeChange?: number;
    /**
     * The JSON array of multisig modifications.
     */
    readonly modifications: CosignatoryModification[];
    /**
     * Create DTO of MultisigAggregateModificationTransaction
     * @returns {MultisigAggregateModificationTransactionDTO}
     */
    toDTO(): TransactionDTO;
    /**
     * Create a MultisigAggregateModificationTransaction object
     * @param timeWindow
     * @param modifications
     * @param relativeChange
     * @returns {MultisigAggregateModificationTransaction}
     */
    static create(timeWindow: TimeWindow, modifications: CosignatoryModification[], relativeChange?: number): MultisigAggregateModificationTransaction;
}
/**
 * The type of modification. Possible values are:
 * 1: Add a new cosignatory.
 * 2: Delete an existing cosignatory.
 */
export declare enum CosignatoryModificationAction {
    ADD = 1,
    DELETE = 2,
}
export declare class CosignatoryModification {
    readonly cosignatoryAccount: PublicAccount;
    readonly action: CosignatoryModificationAction;
    /**
     * constructor
     * @param cosignatoryAccount
     * @param action
     */
    constructor(cosignatoryAccount: PublicAccount, action: CosignatoryModificationAction);
}
