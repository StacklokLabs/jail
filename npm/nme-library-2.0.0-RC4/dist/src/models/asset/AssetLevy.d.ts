import { Address } from "../account/Address";
import { AssetId } from "./AssetId";
/**
 * 1: The levy is an absolute fee. The field 'fee' states how many sub-units of the specified mosaic will be transferred to the recipient.
 * 2: The levy is calculated from the transferred xem. The field 'fee' states how many percentiles of the transferred quantity will transferred to the recipient.
 */
export declare enum AssetLevyType {
    Absolute = 1,
    Percentil = 2,
}
/**
 *
 * A mosaic definition can optionally specify a levy for transferring those mosaics. This might be needed by legal entities needing to collect some taxes for transfers.
 */
export declare class AssetLevy {
    /**
     * 	The levy type
     */
    readonly type: AssetLevyType;
    /**
     * The recipient of the levy.
     */
    readonly recipient: Address;
    /**
     * The mosaic in which the levy is paid.
     */
    readonly assetId: AssetId;
    /**
     * The fee. The interpretation is dependent on the type of the levy
     */
    readonly fee: number;
    /**
     * constructor
     * @param type
     * @param recipient
     * @param assetId
     * @param fee
     */
    constructor(type: AssetLevyType, recipient: Address, assetId: AssetId, fee: number);
}
