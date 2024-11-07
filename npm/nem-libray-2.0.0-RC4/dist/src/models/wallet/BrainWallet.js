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
const js_base64_1 = require("js-base64");
const js_joda_1 = require("js-joda");
const nemSdk = require("nem-sdk");
const NEMLibrary_1 = require("../../NEMLibrary");
const Account_1 = require("../account/Account");
const Address_1 = require("../account/Address");
const Wallet_1 = require("./Wallet");
/**
 * Brain wallet derived the private key from the brainPassword, hashing the brainPassword multiple times, therefore it's crucial to select a SAFE brainPassword.
 */
class BrainWallet extends Wallet_1.Wallet {
    /**
     * @internal
     * @param name
     * @param network
     * @param address
     * @param creationDate
     */
    constructor(name, network, address, creationDate) {
        super(name, network, address, creationDate, 1);
    }
    /**
     * Create a BrainWallet
     * @param name
     * @param password
     * @returns {BrainWallet}
     */
    static create(name, password) {
        const network = NEMLibrary_1.NEMLibrary.getNetworkType();
        const wallet = nemSdk.default.model.wallet.createBrain(name, password.value, Wallet_1.Wallet.networkTypesSDKAdapter(network));
        return new BrainWallet(name, network, new Address_1.Address(wallet.accounts["0"].address), js_joda_1.LocalDateTime.now());
    }
    /**
     * Open a wallet and generate an Account
     * @param password
     * @returns {Account}
     */
    open(password) {
        const common = nemSdk.default.model.objects.create("common")(password.value, "");
        nemSdk.default.crypto.helpers.passwordToPrivatekey(common, {}, "pass:6k");
        return Account_1.Account.createWithPrivateKey(common.privateKey);
    }
    unlockPrivateKey(password) {
        const common = nemSdk.default.model.objects.create("common")(password.value, "");
        nemSdk.default.crypto.helpers.passwordToPrivatekey(common, {}, "pass:6k");
        return common.privateKey;
    }
    /**
     * Converts BrainWallet into writable string to persist into a file
     * @returns {string}
     */
    writeWLTFile() {
        return js_base64_1.Base64.encode(JSON.stringify({
            name: this.name,
            network: this.network.toString(),
            address: this.address.plain(),
            creationDate: this.creationDate.toString(),
            schema: this.schema,
            type: "brain",
        }));
    }
    /**
     * Reads the WLT content and converts it into a BrainWallet
     * @param {string} wlt
     * @returns {BrainWallet}
     */
    static readFromWLT(wlt) {
        const wallet = JSON.parse(js_base64_1.Base64.decode(wlt));
        if (wallet.type != "brain") {
            throw new Error("ERROR WLT TYPE");
        }
        return new BrainWallet(wallet.name, wallet.network, new Address_1.Address(wallet.address), js_joda_1.LocalDateTime.parse(wallet.creationDate));
    }
}
exports.BrainWallet = BrainWallet;
//# sourceMappingURL=BrainWallet.js.map