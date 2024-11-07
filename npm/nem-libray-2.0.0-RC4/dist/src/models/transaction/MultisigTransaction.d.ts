import { TransactionDTO } from "../../infrastructure/transaction/TransactionDTO";
import { PublicAccount } from "../account/PublicAccount";
import { MultisigSignatureTransaction } from "./MultisigSignatureTransaction";
import { TimeWindow } from "./TimeWindow";
import { Transaction } from "./Transaction";
import { HashData } from "./TransactionInfo";
/**
 * Multisig transaction are the only way to make transaction from a multisig account to another account.
 * A multisig transaction carries another transaction inside (often referred to as "inner" transaction).
 * The inner transaction can be a transfer, an importance transfer or an aggregate modification transaction.
 * A multisig transaction also has multisig signature transactions from the cosignatories of the multisig account inside.
 */
export declare class MultisigTransaction extends Transaction {
    /**
     * The fee for the transaction.
     */
    readonly fee: number;
    /**
     * The JSON array of MulsigSignatureTransaction objects.
     */
    readonly signatures: MultisigSignatureTransaction[];
    /**
     * The inner transaction. The inner transaction can be a transfer transaction, an importance transfer transaction or a multisig aggregate modification transaction.
     * The inner transaction does not have a valid signature.
     */
    readonly otherTransaction: Transaction;
    /**
     * Hash data
     */
    readonly hashData?: HashData;
    /**
     * Check if transaction is pending to sign
     * @returns {boolean}
     */
    isPendingToSign(): boolean;
    /**
     * Create a MultisigTransaction object
     * @param timeWindow
     * @param otherTrans
     * @param multisig
     * @returns {MultisigTransaction}
     */
    static create(timeWindow: TimeWindow, otherTrans: Transaction, multisig: PublicAccount): MultisigTransaction;
    /**
     * Create DTO of MultisigTransaction
     * @returns {MultisigTransactionDTO}
     */
    toDTO(): TransactionDTO;
}
