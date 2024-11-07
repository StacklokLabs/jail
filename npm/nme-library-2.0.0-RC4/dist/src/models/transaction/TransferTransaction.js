"use strict";
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 NEM
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Asset_1 = require("../asset/Asset");
const XEM_1 = require("../asset/XEM");
const EncryptedMessage_1 = require("./EncryptedMessage");
const Transaction_1 = require("./Transaction");
const TransactionTypes_1 = require("./TransactionTypes");
/**
 * Transfer transactions contain data about transfers of XEM or assets to another account.
 */
class TransferTransaction extends Transaction_1.Transaction {
    /**
     * @internal
     * @param recipient
     * @param amount
     * @param timeWindow
     * @param version
     * @param fee
     * @param message
     * @param signature
     * @param asset
     * @param sender
     * @param transactionInfo
     */
    constructor(recipient, amount, timeWindow, version, fee, message, signature, asset, sender, transactionInfo) {
        super(TransactionTypes_1.TransactionTypes.TRANSFER, version, timeWindow, signature, sender, transactionInfo);
        this.fee = fee;
        this.recipient = recipient;
        this._xem = amount;
        this.message = message;
        this._assets = asset;
    }
    /**
     * in case that the transfer transaction contains assets, it throws an error
     * @returns {XEM}
     */
    xem() {
        if (this.containAssets()) {
            throw new Error("contain assets");
        }
        return this._xem;
    }
    /**
     * in case that the transfer transaction does not contain assets, it throws an error
     * @returns {Asset[]}
     */
    assets() {
        if (this.containAssets()) {
            return this._assets.map((mosaic) => new Asset_1.Asset(mosaic.assetId, (mosaic.quantity * (this._xem.relativeQuantity()))));
        }
        throw new Error("Does not contain assets");
    }
    /**
     *
     * @returns {boolean}
     */
    containAssets() {
        return this._assets !== undefined && this._assets.length > 0;
    }
    /**
     * all the Asset Identifiers of the attached assets
     * @returns {AssetId[]}
     */
    assetsIds() {
        if (!this.containAssets()) {
            throw new Error("does not contain assets");
        }
        return this._assets.map((_) => _.assetId);
    }
    /**
     * Create DTO of TransferTransaction
     * @returns {TransferTransactionDTO}
     */
    toDTO() {
        const version = this.networkVersion ? this.networkVersion : this.version;
        return this.serializeDTO({
            signer: this.signer ? this.signer.publicKey : undefined,
            deadline: this.timeWindow.deadlineToDTO(),
            timeStamp: this.timeWindow.timeStampToDTO(),
            signature: this.signature,
            type: this.type,
            version,
            mosaics: this._assets === undefined ? undefined : this._assets.map((mosaic) => new Asset_1.Asset(mosaic.assetId, mosaic.quantity).toDTO()),
            fee: this.fee,
            recipient: this.recipient.plain(),
            amount: this._xem.absoluteQuantity(),
            message: this.message.toDTO(),
        });
    }
    /**
     * Create a TransferTransaction object
     * @param timeWindow
     * @param recipient
     * @param xem
     * @param message
     * @returns {TransferTransaction}
     */
    static create(timeWindow, recipient, xem, message) {
        if (message instanceof EncryptedMessage_1.EncryptedMessage && recipient.plain() !== message.recipientPublicAccount.address.plain()) {
            throw new Error("Recipient address and recipientPublicAccount don't match");
        }
        let fee = Math.floor(0.05 * this.calculateMinimum(xem.relativeQuantity()) * 1000000);
        if (message.payload.length !== 0) {
            fee += 0.05 * (Math.floor((message.payload.length / 2) / 32) + 1) * 1000000;
        }
        return new TransferTransaction(recipient, xem, timeWindow, 1, fee, message, undefined, undefined);
    }
    /**
     * @internal
     * @param amount
     * @returns {number}
     */
    static calculateMinimum(amount) {
        const fee = Math.floor(Math.max(1, amount / 10000));
        return fee > 25 ? 25 : fee;
    }
    /**
     * Create a TransferTransaction object
     * @param timeWindow
     * @param recipient
     * @param assets
     * @param message
     * @returns {TransferTransaction}
     */
    // tslint:disable-next-line:member-ordering
    static createWithAssets(timeWindow, recipient, assets, message) {
        if (message instanceof EncryptedMessage_1.EncryptedMessage && recipient.plain() !== message.recipientPublicAccount.address.plain()) {
            throw new Error("Recipient address and recipientPublicAccount don't match");
        }
        const multiplier = new XEM_1.XEM(1);
        let fee = 0;
        assets.map((mosaic) => {
            if (mosaic.properties.divisibility === 0 && mosaic.properties.initialSupply <= 10000) {
                fee += 0.05 * 1000000;
            }
            else {
                const maxMosaicQuantity = 9000000000000000;
                const totalMosaicQuantity = mosaic.properties.initialSupply * Math.pow(10, mosaic.properties.divisibility);
                const supplyRelatedAdjustment = Math.floor(0.8 * Math.log(Math.floor(maxMosaicQuantity / totalMosaicQuantity)));
                const quantity = mosaic.quantity;
                const xemFee = Math.min(25, Math.floor((8999999999 * quantity) / (totalMosaicQuantity * 10000)));
                const unweightFee = Math.max(1, xemFee - supplyRelatedAdjustment);
                fee += 0.05 * 1e6 * unweightFee;
            }
        });
        if (message.payload.length !== 0) {
            fee += 0.05 * (Math.floor((message.payload.length / 2) / 32) + 1) * 1000000;
        }
        return new TransferTransaction(recipient, multiplier, timeWindow, 2, fee, message, undefined, assets.map((_) => new Asset_1.Asset(_.assetId, _.absoluteQuantity())));
    }
}
exports.TransferTransaction = TransferTransaction;
//# sourceMappingURL=TransferTransaction.js.map