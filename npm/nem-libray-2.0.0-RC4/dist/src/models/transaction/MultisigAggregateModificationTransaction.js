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
 * Multisig aggregate modification transactions are part of the NEM's multisig account system.
 * A multisig aggregate modification transaction holds an array of multisig cosignatory modifications and a single multisig minimum cosignatories modification inside the transaction.
 * A multisig aggregate modification transaction can be wrapped by a multisig transaction.
 */
class MultisigAggregateModificationTransaction extends Transaction_1.Transaction {
    /**
     * @internal
     * @param timeWindow
     * @param version
     * @param relativeChange
     * @param modifications
     * @param fee
     * @param signature
     * @param sender
     * @param transactionInfo
     */
    constructor(timeWindow, version, modifications, fee, signature, relativeChange, sender, transactionInfo) {
        super(TransactionTypes_1.TransactionTypes.MULTISIG_AGGREGATE_MODIFICATION, version, timeWindow, signature, sender, transactionInfo);
        this.relativeChange = relativeChange;
        this.modifications = modifications;
        this.fee = fee;
    }
    /**
     * Create DTO of MultisigAggregateModificationTransaction
     * @returns {MultisigAggregateModificationTransactionDTO}
     */
    toDTO() {
        const version = this.networkVersion ? this.networkVersion : this.version;
        return this.serializeDTO({
            signer: this.signer ? this.signer.publicKey : undefined,
            deadline: this.timeWindow.deadlineToDTO(),
            timeStamp: this.timeWindow.timeStampToDTO(),
            type: this.type,
            version,
            signature: this.signature,
            fee: this.fee,
            minCosignatories: this.relativeChange === undefined ? undefined : {
                relativeChange: this.relativeChange,
            },
            modifications: this.modifications.map((modification) => {
                return {
                    cosignatoryAccount: modification.cosignatoryAccount.publicKey,
                    modificationType: modification.action,
                };
            }),
        });
    }
    /**
     * Create a MultisigAggregateModificationTransaction object
     * @param timeWindow
     * @param modifications
     * @param relativeChange
     * @returns {MultisigAggregateModificationTransaction}
     */
    static create(timeWindow, modifications, relativeChange) {
        const fee = Math.floor(10 * 0.05 * 1000000);
        const version = relativeChange ? 2 : 1;
        return new MultisigAggregateModificationTransaction(timeWindow, version, modifications, fee, undefined, relativeChange);
    }
}
exports.MultisigAggregateModificationTransaction = MultisigAggregateModificationTransaction;
/**
 * The type of modification. Possible values are:
 * 1: Add a new cosignatory.
 * 2: Delete an existing cosignatory.
 */
var CosignatoryModificationAction;
(function (CosignatoryModificationAction) {
    CosignatoryModificationAction[CosignatoryModificationAction["ADD"] = 1] = "ADD";
    CosignatoryModificationAction[CosignatoryModificationAction["DELETE"] = 2] = "DELETE";
})(CosignatoryModificationAction = exports.CosignatoryModificationAction || (exports.CosignatoryModificationAction = {}));
class CosignatoryModification {
    /**
     * constructor
     * @param cosignatoryAccount
     * @param action
     */
    constructor(cosignatoryAccount, action) {
        this.cosignatoryAccount = cosignatoryAccount;
        this.action = action;
    }
}
exports.CosignatoryModification = CosignatoryModification;
//# sourceMappingURL=MultisigAggregateModificationTransaction.js.map