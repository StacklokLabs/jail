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
const Transaction_1 = require("./Transaction");
const TransactionTypes_1 = require("./TransactionTypes");
/**
 * The supply type. Supported supply types are:
 * 1: Increase in supply.
 * 2: Decrease in supply.
 */
var AssetSupplyType;
(function (AssetSupplyType) {
    AssetSupplyType[AssetSupplyType["Increase"] = 1] = "Increase";
    AssetSupplyType[AssetSupplyType["Decrease"] = 2] = "Decrease";
})(AssetSupplyType = exports.AssetSupplyType || (exports.AssetSupplyType = {}));
/**
 * In case a asset definition has the property 'supplyMutable' set to true, the creator of the asset definition can change the supply, i.e. increase or decrease the supply.
 */
class AssetSupplyChangeTransaction extends Transaction_1.Transaction {
    /**
     * @internal
     * @param timeWindow
     * @param version
     * @param assetId
     * @param supplyType
     * @param delta
     * @param fee
     * @param signature
     * @param sender
     * @param transactionInfo
     */
    constructor(timeWindow, version, assetId, supplyType, delta, fee, signature, sender, transactionInfo) {
        super(TransactionTypes_1.TransactionTypes.MOSAIC_SUPPLY_CHANGE, version, timeWindow, signature, sender, transactionInfo);
        this.assetId = assetId;
        this.supplyType = supplyType;
        this.delta = delta;
        this.fee = fee;
    }
    /**
     * Create DTO of AssetSupplychangeTransaction
     * @returns TransactionDTO
     */
    toDTO() {
        const version = this.networkVersion ? this.networkVersion : this.version;
        return this.serializeDTO({
            deadline: this.timeWindow.deadlineToDTO(),
            timeStamp: this.timeWindow.timeStampToDTO(),
            signer: this.signer ? this.signer.publicKey : undefined,
            type: this.type,
            version,
            signature: this.signature,
            fee: this.fee,
            mosaicId: this.assetId.toDTO(),
            delta: this.delta,
            supplyType: this.supplyType,
        });
    }
    /**
     * Create a AssetSupplyChangeTransaction object
     * @param timeWindow
     * @param assetId
     * @param supplyType
     * @param delta
     * @returns {AssetSupplyChangeTransaction}
     */
    static create(timeWindow, assetId, supplyType, delta) {
        const fee = Math.floor(3.0 * 0.05 * 1000000);
        return new AssetSupplyChangeTransaction(timeWindow, 1, assetId, supplyType, delta, fee);
    }
}
exports.AssetSupplyChangeTransaction = AssetSupplyChangeTransaction;
//# sourceMappingURL=AssetSupplyChangeTransaction.js.map