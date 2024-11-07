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
const _ = require("lodash");
const NetworkTypes_1 = require("../node/NetworkTypes");
/**
 * An abstract transaction class that serves as the base class of all NEM transactions.
 */
class Transaction {
    /**
     * @internal
     * @param type
     * @param version
     * @param timeWindow
     * @param signature
     * @param sender
     * @param transactionInfo
     */
    constructor(type, version, timeWindow, signature, sender, transactionInfo) {
        if (sender && !sender.hasPublicKey()) {
            throw new Error("signer key pair is required to create a verifiable entity");
        }
        this.type = type;
        this.version = version;
        this.timeWindow = timeWindow;
        this.signature = signature;
        this.signer = sender ? sender : undefined;
        this.transactionInfo = transactionInfo;
    }
    /**
     * Checks if the transaction has been confirmed and included in a block
     */
    isConfirmed() {
        return this.transactionInfo !== undefined;
    }
    /**
     * Get transaction info
     */
    getTransactionInfo() {
        if (!this.isConfirmed()) {
            throw new Error("TransactionInfo is not available when it is not confirmed");
        }
        return this.transactionInfo;
    }
    /**
     * Serialize DTO
     * @internal
     * @param dto
     * @returns {any}
     */
    serializeDTO(dto) {
        return _.omitBy(dto, _.isUndefined);
    }
    /**
     * sets the network type for a transaction.
     * This is done automatically when signing a transaction, you should not use it directly.
     * @param networkType
     */
    setNetworkType(networkType) {
        if (networkType === NetworkTypes_1.NetworkTypes.MAIN_NET) {
            this.networkVersion = 0x68000000 | this.version;
            return;
        }
        else if (networkType === NetworkTypes_1.NetworkTypes.TEST_NET) {
            this.networkVersion = 0x98000000 | this.version;
            return;
        }
        else if (networkType == NetworkTypes_1.NetworkTypes.MIJIN_NET) {
            this.networkVersion = 0x60000000 | this.version;
            return;
        }
        throw new Error("Unsupported Network Type " + networkType);
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map