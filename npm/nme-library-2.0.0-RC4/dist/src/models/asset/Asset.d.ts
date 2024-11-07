import { AssetId } from "./AssetId";
/**
 * A asset describes an instance of a asset definition. Assets can be transferred by means of a transfer transaction.
 */
export declare class Asset {
    /**
     * The asset id
     */
    readonly assetId: AssetId;
    /**
     * The asset quantity. The quantity is always given in smallest units for the asset, i.e. if it has a divisibility of 3 the quantity is given in millis.
     */
    readonly quantity: number;
    /**
     * constructor
     * @param assetId
     * @param quantity
     */
    constructor(assetId: AssetId, quantity: number);
}
