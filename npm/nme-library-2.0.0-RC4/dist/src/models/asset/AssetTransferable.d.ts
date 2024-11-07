import { AssetDefinition, AssetProperties } from "./AssetDefinition";
import { AssetId } from "./AssetId";
import { AssetLevy } from "./AssetLevy";
/**
 * Asset transferable model
 */
export declare class AssetTransferable {
    /**
     * Create a AssetTransferable object with mosaic definition
     * @param assetDefinition
     * @param amount
     * @returns {AssetTransferable}
     */
    static createWithAssetDefinition(assetDefinition: AssetDefinition, amount: number): AssetTransferable;
    /**
     * Create AssetTransferable with an absolute quantity
     * @param assetId
     * @param properties
     * @param quantity
     * @param levy
     * @returns {AssetTransferable}
     */
    static createAbsolute(assetId: AssetId, properties: AssetProperties, quantity: number, levy?: AssetLevy): AssetTransferable;
    /**
     * Create AssetTransferable with an relative quantity
     * @param assetId
     * @param properties
     * @param quantity
     * @param levy
     * @returns {AssetTransferable}
     */
    static createRelative(assetId: AssetId, properties: AssetProperties, quantity: number, levy?: AssetLevy): AssetTransferable;
    /**
     * AssetId
     */
    readonly assetId: AssetId;
    /**
     * Amount
     */
    readonly quantity: number;
    /**
     * Asset definition properties
     */
    readonly properties: AssetProperties;
    /**
     * Levy
     */
    readonly levy?: AssetLevy;
    /**
     * constructor
     * @param mosaicId
     * @param properties
     * @param quantity
     * @param levy
     */
    constructor(mosaicId: AssetId, properties: AssetProperties, quantity: number, levy?: AssetLevy);
    /**
     * @returns {number}
     */
    relativeQuantity(): number;
    /**
     * @returns {number}
     */
    absoluteQuantity(): number;
}
