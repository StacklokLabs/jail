import { TransactionDTO } from "../../infrastructure/transaction/TransactionDTO";
import { Address } from "../account/Address";
import { Asset } from "../asset/Asset";
import { AssetId } from "../asset/AssetId";
import { AssetTransferable } from "../asset/AssetTransferable";
import { XEM } from "../asset/XEM";
import { EncryptedMessage } from "./EncryptedMessage";
import { PlainMessage } from "./PlainMessage";
import { TimeWindow } from "./TimeWindow";
import { Transaction } from "./Transaction";
/**
 * Transfer transactions contain data about transfers of XEM or assets to another account.
 */
export declare class TransferTransaction extends Transaction {
    /**
     * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
     */
    readonly fee: number;
    /**
     * The address of the recipient.
     */
    readonly recipient: Address;
    /**
     * The xem of XEM that is transferred from sender to recipient.
     */
    private readonly _xem;
    /**
     * Optionally a transaction can contain a message. In this case the transaction contains a message substructure. If not the field is null.
     */
    readonly message: PlainMessage | EncryptedMessage;
    /**
     * The array of Asset objects.
     */
    private readonly _assets?;
    /**
     * in case that the transfer transaction contains assets, it throws an error
     * @returns {XEM}
     */
    xem(): XEM;
    /**
     * in case that the transfer transaction does not contain assets, it throws an error
     * @returns {Asset[]}
     */
    assets(): Asset[];
    /**
     *
     * @returns {boolean}
     */
    containAssets(): boolean;
    /**
     * all the Asset Identifiers of the attached assets
     * @returns {AssetId[]}
     */
    assetsIds(): AssetId[];
    /**
     * Create DTO of TransferTransaction
     * @returns {TransferTransactionDTO}
     */
    toDTO(): TransactionDTO;
    /**
     * Create a TransferTransaction object
     * @param timeWindow
     * @param recipient
     * @param xem
     * @param message
     * @returns {TransferTransaction}
     */
    static create(timeWindow: TimeWindow, recipient: Address, xem: XEM, message: PlainMessage | EncryptedMessage): TransferTransaction;
    /**
     * Create a TransferTransaction object
     * @param timeWindow
     * @param recipient
     * @param assets
     * @param message
     * @returns {TransferTransaction}
     */
    static createWithAssets(timeWindow: TimeWindow, recipient: Address, assets: AssetTransferable[], message: PlainMessage | EncryptedMessage): TransferTransaction;
}
