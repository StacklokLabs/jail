import { TransactionDTO } from "../../infrastructure/transaction/TransactionDTO";
import { AssetId } from "../asset/AssetId";
import { TimeWindow } from "./TimeWindow";
import { Transaction } from "./Transaction";
/**
 * The supply type. Supported supply types are:
 * 1: Increase in supply.
 * 2: Decrease in supply.
 */
export declare enum AssetSupplyType {
    Increase = 1,
    Decrease = 2,
}
/**
 * In case a asset definition has the property 'supplyMutable' set to true, the creator of the asset definition can change the supply, i.e. increase or decrease the supply.
 */
export declare class AssetSupplyChangeTransaction extends Transaction {
    /**
     * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
     */
    readonly fee: number;
    /**
     * The asset id.
     */
    readonly assetId: AssetId;
    /**
     * The supply type.
     */
    readonly supplyType: AssetSupplyType;
    /**
     * The supply change in units for the asset.
     */
    readonly delta: number;
    /**
     * Create DTO of AssetSupplychangeTransaction
     * @returns TransactionDTO
     */
    toDTO(): TransactionDTO;
    /**
     * Create a AssetSupplyChangeTransaction object
     * @param timeWindow
     * @param assetId
     * @param supplyType
     * @param delta
     * @returns {AssetSupplyChangeTransaction}
     */
    static create(timeWindow: TimeWindow, assetId: AssetId, supplyType: AssetSupplyType, delta: number): AssetSupplyChangeTransaction;
}
