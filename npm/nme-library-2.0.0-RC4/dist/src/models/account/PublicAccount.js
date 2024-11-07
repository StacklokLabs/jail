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
const nemSdk = require("nem-sdk");
const NEMLibrary_1 = require("../../NEMLibrary");
const NetworkTypes_1 = require("../node/NetworkTypes");
const Address_1 = require("./Address");
/**
 * Public account model
 */
class PublicAccount {
    /**
     * @internal
     * @param address
     * @param publicKey
     */
    constructor(address, publicKey) {
        this.address = address;
        this.publicKey = publicKey;
    }
    /**
     * @returns {boolean}
     */
    hasPublicKey() {
        return this.publicKey != null && (this.publicKey.length === 64 || this.publicKey.length === 66);
    }
    /**
     * Creates a new PublicAccount from a public key
     * @param publicKey
     * @returns {PublicAccount}
     */
    static createWithPublicKey(publicKey) {
        if (publicKey == null || (publicKey.length !== 64 && publicKey.length !== 66)) {
            throw new Error("Not a valid public key");
        }
        let network;
        if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.MAIN_NET) {
            network = nemSdk.default.model.network.data.mainnet.id;
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.TEST_NET) {
            network = nemSdk.default.model.network.data.testnet.id;
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() == NetworkTypes_1.NetworkTypes.MIJIN_NET) {
            network = nemSdk.default.model.network.data.mijin.id;
        }
        const address = nemSdk.default.model.address.toAddress(publicKey, network);
        return new PublicAccount(new Address_1.Address(address), publicKey);
    }
    /**
     * verify message
     * @param signedMessage
     * @param signature
     * @returns true/false
     */
    verifySignedMessage(signedMessage, signature) {
        return nemSdk.default.crypto.verifySignature(this.publicKey, signedMessage, signature);
    }
}
exports.PublicAccount = PublicAccount;
//# sourceMappingURL=PublicAccount.js.map