import { TransactionDTO } from "../../infrastructure/transaction/TransactionDTO";
import { Address } from "../account/Address";
import { AssetDefinition } from "../asset/AssetDefinition";
import { TimeWindow } from "./TimeWindow";
import { Transaction } from "./Transaction";
/**
 * Before a asset can be created or transferred, a corresponding definition of the asset has to be created and published to the network.
 * This is done via a asset definition creation transaction.
 */
export declare class AssetDefinitionCreationTransaction extends Transaction {
    /**
     * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
     */
    readonly fee: number;
    /**
     * The fee for the creation of the asset.
     */
    readonly creationFee: number;
    /**
     * The public account to which the creation fee is tranferred.
     */
    readonly creationFeeSink: Address;
    /**
     * The actual asset definition.
     */
    readonly mosaicDefinition: AssetDefinition;
    /**
     * Create DTO of AssetDefinitionCreationTransaction
     * @returns {MosaicDefinitionCreationTransactionDTO}
     */
    toDTO(): TransactionDTO;
    /**
     * Create a AssetDefinitionCreationTransaction object
     * @param timeWindow
     * @param assetDefinition
     * @returns {AssetDefinitionCreationTransaction}
     */
    static create(timeWindow: TimeWindow, assetDefinition: AssetDefinition): AssetDefinitionCreationTransaction;
}
