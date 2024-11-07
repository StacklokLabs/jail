/**
 *
 * A asset id uniquely identifies an underlying asset definition.
 */
export declare class AssetId {
    /**
     * The corresponding namespace id
     */
    readonly namespaceId: string;
    /**
     * The name of the mosaic definition.
     */
    readonly name: string;
    /**
     * constructor
     * @param namespaceId
     * @param name
     */
    constructor(namespaceId: string, name: string);
    toString(): string;
    /**
     * Compares mosaicIds for equality
     * @param mosaicId
     * @returns {boolean}
     */
    equals(mosaicId: AssetId): boolean;
    /**
     * Asset Id description in format namespaceId:name ex: nem:xem
     */
    description(): string;
}
