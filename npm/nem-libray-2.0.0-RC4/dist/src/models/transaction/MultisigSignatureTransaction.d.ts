import { TransactionDTO } from "../../infrastructure/transaction/TransactionDTO";
import { Address } from "../account/Address";
import { TimeWindow } from "./TimeWindow";
import { Transaction } from "./Transaction";
import { HashData } from "./TransactionInfo";
/**
 * Multisig signature transactions are part of the NEM's multisig account system. Multisig signature transactions are included in the corresponding multisig transaction and are the way a cosignatory of a multisig account can sign a multisig transaction for that account.
 */
export declare class MultisigSignatureTransaction extends Transaction {
    /**
     * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
     */
    readonly fee: number;
    /**
     * The address of the corresponding multisig account.
     */
    readonly otherAccount: Address;
    /**
     * The hash of the inner transaction of the corresponding multisig transaction.
     */
    readonly otherHash: HashData;
    /**
     * Create MultisigSignatureTransaction
     * @returns {MultisigSignatureTransactionDTO}
     */
    toDTO(): TransactionDTO;
    /**
     * Create a MultisigSignatureTransaction object
     * @param timeWindow
     * @param otherAccount
     * @param otherHash
     * @returns {MultisigSignatureTransaction}
     */
    static create(timeWindow: TimeWindow, otherAccount: Address, otherHash: HashData): MultisigSignatureTransaction;
}
