import { AssetId } from "./AssetId";
import { AssetTransferable } from "./AssetTransferable";
/**
 * XEM mosaic transferable
 */
export declare class XEM extends AssetTransferable {
    /**
     * Divisiblity
     * @type {number}
     */
    static DIVISIBILITY: number;
    /**
     * Initial supply
     * @type {number}
     */
    static INITIALSUPPLY: number;
    /**
     * Is tranferable
     * @type {boolean}
     */
    static TRANSFERABLE: boolean;
    /**
     * Is mutable
     * @type {boolean}
     */
    static SUPPLYMUTABLE: boolean;
    /**
     * mosaicId
     * @type {AssetId}
     */
    static MOSAICID: AssetId;
    /**
     * Create XEM with an absolute quantity
     * @param quantity
     * @returns {AssetTransferable}
     */
    static fromAbsolute(quantity: number): XEM;
    /**
     * Create XEM with an relative quantity
     * @param quantity
     * @returns {AssetTransferable}
     */
    static fromRelative(quantity: number): XEM;
    /**
     * constructor
     * @param quantity - Relative quantity
     */
    constructor(quantity: number);
}
