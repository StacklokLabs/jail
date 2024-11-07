export interface TransactionDTO {
    /**
     * The number of seconds elapsed since the creation of the nemesis block.
     */
    readonly timeStamp: number;
    /**
     * The transaction signature (missing if part of a multisig transaction).
     */
    readonly signature?: string;
    /**
     * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
     */
    readonly fee: number;
    /**
     * The transaction type.
     */
    readonly type: number;
    /**
     * The deadline of the transaction. The deadline is given as the number of seconds elapsed since the creation of the nemesis block.
     * If a transaction does not get included in a block before the deadline is reached, it is deleted.
     */
    readonly deadline: number;
    /**
     * The version of the structure.
     */
    readonly version: number;
    /**
     * The public key of the account that created the transaction.
     */
    readonly signer: string;
}
