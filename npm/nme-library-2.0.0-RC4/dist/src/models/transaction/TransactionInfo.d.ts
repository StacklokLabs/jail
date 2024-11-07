export declare class HashData {
    readonly data: string;
    constructor(data: string);
}
export declare class TransactionInfo {
    /**
     * The height of the block in which the transaction was included.
     */
    readonly height: number;
    /**
     *  The id of the transaction.
     */
    readonly id: number;
    /**
     *  The transaction hash.
     */
    readonly hash: HashData;
    /**
     * constructor
     * @param height
     * @param id
     * @param hash
     */
    constructor(height: number, id: number, hash: HashData);
}
export declare class MultisigTransactionInfo extends TransactionInfo {
    /**
     * The hash of the inner transaction. This entry is only available for multisig transactions.
     */
    readonly innerHash: HashData;
    /**
     * constructor
     * @param height
     * @param id
     * @param hash
     * @param innerHash
     */
    constructor(height: number, id: number, hash: HashData, innerHash: HashData);
}
