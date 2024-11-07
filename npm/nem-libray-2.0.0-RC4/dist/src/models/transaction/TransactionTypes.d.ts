/**
 * Static class containing transaction type constants.
 */
export declare class TransactionTypes {
    /**
     * Transfer Transaction
     * @type {number}
     */
    static readonly TRANSFER: number;
    /**
     * Importance transfer transaction.
     * @type {number}
     */
    static readonly IMPORTANCE_TRANSFER: number;
    /**
     * A new asset transaction.
     * @type {number}
     */
    static readonly ASSET_NEW: number;
    /**
     * An asset ask transaction.
     * @type {number}
     */
    static readonly ASSET_ASK: number;
    /**
     * An asset bid transaction.
     * @type {number}
     */
    static readonly ASSET_BID: number;
    /**
     * A snapshot transaction.
     * @type {number}
     */
    static readonly SNAPSHOT: number;
    /**
     * A multisig change transaction (e.g. announce an account as multi-sig).
     * @type {number}
     */
    static readonly MULTISIG_AGGREGATE_MODIFICATION: number;
    /**
     * A multisig signature transaction.
     * @type {number}
     */
    static readonly MULTISIG_SIGNATURE: number;
    /**
     * A multisig transaction.
     * @type {number}
     */
    static readonly MULTISIG: number;
    /**
     * A provision namespace transaction.
     * @type {number}
     */
    static readonly PROVISION_NAMESPACE: number;
    /**
     * A asset definition creation transaction.
     * @type {number}
     */
    static readonly MOSAIC_DEFINITION_CREATION: number;
    /**
     * A asset supply change transaction.
     * @type {number}
     */
    static readonly MOSAIC_SUPPLY_CHANGE: number;
    /**
     * Gets all multisig embeddable types.
     * @returns {number[]}
     */
    static getMultisigEmbeddableTypes(): number[];
    /**
     * Gets all block embeddable types.
     * @returns {number[]}
     */
    static getBlockEmbeddableTypes(): number[];
    /**
     * Gets all active types.
     * @returns {number[]}
     */
    static getActiveTypes(): number[];
}
