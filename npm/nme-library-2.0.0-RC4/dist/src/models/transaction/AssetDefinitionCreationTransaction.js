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
const NEMLibrary_1 = require("../../NEMLibrary");
const Address_1 = require("../account/Address");
const NetworkTypes_1 = require("../node/NetworkTypes");
const Transaction_1 = require("./Transaction");
const TransactionTypes_1 = require("./TransactionTypes");
/**
 * Before a asset can be created or transferred, a corresponding definition of the asset has to be created and published to the network.
 * This is done via a asset definition creation transaction.
 */
class AssetDefinitionCreationTransaction extends Transaction_1.Transaction {
    /**
     * @internal
     * @param timeWindow
     * @param version
     * @param creationFee
     * @param creationFeeSink
     * @param assetDefinition
     * @param fee
     * @param signature
     * @param sender
     * @param transactionInfo
     */
    constructor(timeWindow, version, creationFee, creationFeeSink, assetDefinition, fee, signature, sender, transactionInfo) {
        super(TransactionTypes_1.TransactionTypes.MOSAIC_DEFINITION_CREATION, version, timeWindow, signature, sender, transactionInfo);
        this.creationFeeSink = creationFeeSink;
        this.creationFee = creationFee;
        this.mosaicDefinition = assetDefinition;
        this.fee = fee;
    }
    /**
     * Create DTO of AssetDefinitionCreationTransaction
     * @returns {MosaicDefinitionCreationTransactionDTO}
     */
    toDTO() {
        const version = this.networkVersion ? this.networkVersion : this.version;
        return this.serializeDTO({
            type: this.type,
            fee: this.fee,
            version,
            signer: this.signer ? this.signer.publicKey : undefined,
            signature: this.signature,
            deadline: this.timeWindow.deadlineToDTO(),
            timeStamp: this.timeWindow.timeStampToDTO(),
            creationFee: this.creationFee,
            creationFeeSink: this.creationFeeSink.plain(),
            mosaicDefinition: this.mosaicDefinition.toDTO(),
        });
    }
    /**
     * Create a AssetDefinitionCreationTransaction object
     * @param timeWindow
     * @param assetDefinition
     * @returns {AssetDefinitionCreationTransaction}
     */
    static create(timeWindow, assetDefinition) {
        const fee = Math.floor(3 * 0.05 * 1000000);
        let creationFeeSink;
        if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.TEST_NET) {
            creationFeeSink = new Address_1.Address("TBMOSA-ICOD4F-54EE5C-DMR23C-CBGOAM-2XSJBR-5OLC");
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.MAIN_NET) {
            creationFeeSink = new Address_1.Address("NBMOSA-ICOD4F-54EE5C-DMR23C-CBGOAM-2XSIUX-6TRS");
        }
        const creationFee = Math.floor(10 * 1000000);
        return new AssetDefinitionCreationTransaction(timeWindow, 1, creationFee, creationFeeSink, assetDefinition, fee);
    }
}
exports.AssetDefinitionCreationTransaction = AssetDefinitionCreationTransaction;
//# sourceMappingURL=AssetDefinitionCreationTransaction.js.map