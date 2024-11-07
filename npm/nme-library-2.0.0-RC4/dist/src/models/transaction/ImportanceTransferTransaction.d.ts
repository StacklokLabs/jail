import { TransactionDTO } from "../../infrastructure/transaction/TransactionDTO";
import { PublicAccount } from "../account/PublicAccount";
import { TimeWindow } from "./TimeWindow";
import { Transaction } from "./Transaction";
/**
 * The mode. Possible values are:
 * 1: Activate remote harvesting.
 * 2: Deactivate remote harvesting.
 */
export declare enum ImportanceMode {
    Activate = 1,
    Deactivate = 2,
}
/**
 * NIS has the ability to transfer the importance of one account to another account for harvesting.
 * The account receiving the importance is called the remote account.
 * Importance transfer transactions are part of the secure harvesting feature of NEM.
 * Once an importance transaction has been included in a block it needs 6 hours to become active.
 */
export declare class ImportanceTransferTransaction extends Transaction {
    /**
     * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
     */
    readonly fee: number;
    /**
     * The public key of the receiving account as hexadecimal string.
     */
    readonly remoteAccount: PublicAccount;
    /**
     * The mode, activate or deactivate
     */
    readonly mode: ImportanceMode;
    /**
     * Create DTO of ImportanceTransferTransaction
     */
    toDTO(): TransactionDTO;
    /**
     * Create a ImportanceTransferTransaction object
     * @param timeWindow
     * @param mode
     * @param remoteAccount
     * @returns {ImportanceTransferTransaction}
     */
    static create(timeWindow: TimeWindow, mode: ImportanceMode, remoteAccount: PublicAccount): ImportanceTransferTransaction;
}
