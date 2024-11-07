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
 * Accounts can rent a namespace for one year and after a year renew the contract. This is done via a ProvisionNamespaceTransaction.
 */
class ProvisionNamespaceTransaction extends Transaction_1.Transaction {
    /**
     * @internal
     * @param timeWindow
     * @param version
     * @param rentalFeeSink
     * @param rentalFee
     * @param newPart
     * @param fee
     * @param signature
     * @param parent
     * @param sender
     * @param transactionInfo
     */
    constructor(timeWindow, version, rentalFeeSink, rentalFee, newPart, fee, signature, parent, sender, transactionInfo) {
        super(TransactionTypes_1.TransactionTypes.PROVISION_NAMESPACE, version, timeWindow, signature, sender, transactionInfo);
        this.rentalFee = rentalFee;
        this.rentalFeeSink = rentalFeeSink;
        this.newPart = newPart;
        this.parent = parent;
        this.fee = fee;
    }
    /**
     * Create DTO of ProvisionNamespaceTransaction
     * @returns {TransactionDTO}
     */
    toDTO() {
        const version = this.networkVersion ? this.networkVersion : this.version;
        return this.serializeDTO({
            version,
            fee: this.fee,
            type: this.type,
            signer: this.signer ? this.signer.publicKey : undefined,
            parent: this.parent === undefined ? null : this.parent,
            signature: this.signature,
            rentalFee: this.rentalFee,
            rentalFeeSink: this.rentalFeeSink.plain(),
            deadline: this.timeWindow.deadlineToDTO(),
            timeStamp: this.timeWindow.timeStampToDTO(),
            newPart: this.newPart,
        });
    }
    /**
     * Create a ProvisionNamespaceTransaction object
     * @param timeWindow
     * @param newPart
     * @param parent
     * @returns {ProvisionNamespaceTransaction}
     */
    static create(timeWindow, newPart, parent) {
        const subnamespaceFee = 10 * 1000000;
        const RootNamespaceFee = 100 * 1000000;
        let rentalFeeSink;
        if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.TEST_NET) {
            rentalFeeSink = new Address_1.Address("TAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTDJE-YP35");
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.MAIN_NET) {
            rentalFeeSink = new Address_1.Address("NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA");
        }
        const fee = Math.floor(3 * 0.05 * 1000000);
        return new ProvisionNamespaceTransaction(timeWindow, 1, rentalFeeSink, parent === undefined ? RootNamespaceFee : subnamespaceFee, newPart, fee, undefined, parent);
    }
    /**
     *
     * @param {TimeWindow} timeWindow
     * @param {string} namespaceName - Root namespace provision
     * @returns {ProvisionNamespaceTransaction}
     */
    static createRoot(timeWindow, namespaceName) {
        return ProvisionNamespaceTransaction.create(timeWindow, namespaceName);
    }
    /**
     *
     * @param {TimeWindow} timeWindow
     * @param {string }parentNamespace
     * @param {string} newNamespaceName
     * @returns {ProvisionNamespaceTransaction}
     */
    static createSub(timeWindow, parentNamespace, newNamespaceName) {
        return ProvisionNamespaceTransaction.create(timeWindow, newNamespaceName, parentNamespace);
    }
}
exports.ProvisionNamespaceTransaction = ProvisionNamespaceTransaction;
//# sourceMappingURL=ProvisionNamespaceTransaction.js.map