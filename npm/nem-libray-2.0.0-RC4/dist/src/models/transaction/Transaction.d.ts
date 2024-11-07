import { TransactionDTO } from "../../infrastructure/transaction/TransactionDTO";
import { PublicAccount } from "../account/PublicAccount";
import { NetworkTypes } from "../node/NetworkTypes";
import { TimeWindow } from "./TimeWindow";
import { TransactionInfo } from "./TransactionInfo";
/**
 * An abstract transaction class that serves as the base class of all NEM transactions.
 */
export declare abstract class Transaction {
    /**
     * The transaction type.
     */
    readonly type: number;
    /**
     * The version of the structure.
     */
    readonly version: number;
    /**
     * The transaction signature (missing if part of a multisig transaction).
     */
    readonly signature?: string;
    /**
     * The public account of the transaction creator.
     */
    signer?: PublicAccount;
    /**
     * TimeWindow
     */
    readonly timeWindow: TimeWindow;
    /**
     * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
     */
    readonly abstract fee: number;
    /**
     * Transactions meta data object contains additional information about the transaction.
     */
    protected readonly transactionInfo?: TransactionInfo;
    /**
     * Checks if the transaction has been confirmed and included in a block
     */
    isConfirmed(): boolean;
    /**
     * Get transaction info
     */
    getTransactionInfo(): TransactionInfo;
    /**
     * Create DTO of the transaction
     */
    abstract toDTO(): TransactionDTO;
    /**
     * sets the network type for a transaction.
     * This is done automatically when signing a transaction, you should not use it directly.
     * @param networkType
     */
    setNetworkType(networkType: NetworkTypes): void;
}
