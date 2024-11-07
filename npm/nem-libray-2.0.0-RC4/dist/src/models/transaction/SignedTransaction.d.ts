/**
 * SignedTransaction object is used to transfer the transaction data and the signature to NIS in order to initiate and broadcast a transaction.
 */
export interface SignedTransaction {
    /**
     * The transaction data as string.
     */
    readonly data: string;
    /**
     * The signature for the transaction as hexadecimal string.
     */
    readonly signature: string;
}
