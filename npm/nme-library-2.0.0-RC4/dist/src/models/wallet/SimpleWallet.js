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
const NetworkTypes_1 = require("../node/NetworkTypes");
const EncryptedPrivateKey_1 = require("./EncryptedPrivateKey");
const Wallet_1 = require("./Wallet");
/**
 * Simple wallet model generates a private key from a PRNG
 */
class SimpleWallet extends Wallet_1.Wallet {
    /**
     * @internal
     * @param name
     * @param network
     * @param address
     * @param creationDate
     * @param encryptedPrivateKey
     */
    constructor(name, network, address, creationDate, encryptedPrivateKey) {
        super(name, network, address, creationDate, 1);
        this.encryptedPrivateKey = encryptedPrivateKey;
    }
    /**
     * Create a SimpleWallet
     * @param name
     * @param password
     * @returns {SimpleWallet}
     */
    static create(name, password) {
        const network = NEMLibrary_1.NEMLibrary.getNetworkType();
        const wallet = nemSdk.default.model.wallet.createPRNG(name, password.value, SimpleWallet.networkTypesSDKAdapter(network));
        return new SimpleWallet(name, network, new Address_1.Address(wallet.accounts["0"].address), js_joda_1.LocalDateTime.now(), new EncryptedPrivateKey_1.EncryptedPrivateKey(wallet.accounts["0"].encrypted, wallet.accounts["0"].iv));
    }
    /**
     * Create a SimpleWallet from private key
     * @param name
     * @param password
     * @param privateKey
     * @returns {SimpleWallet}
     */
    static createWithPrivateKey(name, password, privateKey) {
        const network = NEMLibrary_1.NEMLibrary.getNetworkType();
        const wallet = nemSdk.default.model.wallet.importPrivateKey(name, password.value, privateKey, SimpleWallet.networkTypesSDKAdapter(network));
        return new SimpleWallet(name, network, new Address_1.Address(wallet.accounts["0"].address), js_joda_1.LocalDateTime.now(), new EncryptedPrivateKey_1.EncryptedPrivateKey(wallet.accounts["0"].encrypted, wallet.accounts["0"].iv));
    }
    /**
     * Open a wallet and generate an Account
     * @param password
     * @returns {Account}
     */
    open(password) {
        const account = Account_1.Account.createWithPrivateKey(this.encryptedPrivateKey.decrypt(password));
        if (account.address.equals(this.address)) {
            return account;
        }
        throw new Error("wrong password");
    }
    unlockPrivateKey(password) {
        const privateKey = this.encryptedPrivateKey.decrypt(password);
        if (privateKey === "" || (privateKey.length !== 64 && privateKey.length !== 66)) {
            throw new Error("Invalid password");
        }
        const account = Account_1.Account.createWithPrivateKey(privateKey);
        if (!account.address.equals(this.address)) {
            throw new Error("Invalid password");
        }
        return privateKey;
    }
    /**
     * Converts SimpleWallet into writable string to persist into a file
     * @returns {string}
     */
    writeWLTFile() {
        return js_base64_1.Base64.encode(JSON.stringify({
            name: this.name,
            network: this.network.toString(),
            address: this.address.plain(),
            creationDate: this.creationDate.toString(),
            schema: this.schema,
            type: "simple",
            encryptedPrivateKey: this.encryptedPrivateKey.encryptedKey,
            iv: this.encryptedPrivateKey.iv,
        }));
    }
    /**
     * Reads the WLT content and converts it into a SimpleWallet
     * @param {string} wlt
     * @returns {SimpleWallet}
     */
    static readFromWLT(wlt) {
        const wallet = JSON.parse(js_base64_1.Base64.decode(wlt));
        if (wallet.type !== "simple") {
            throw new Error("ERROR WLT TYPE");
        }
        return new SimpleWallet(wallet.name, wallet.network, new Address_1.Address(wallet.address), js_joda_1.LocalDateTime.parse(wallet.creationDate), new EncryptedPrivateKey_1.EncryptedPrivateKey(wallet.encryptedPrivateKey, wallet.iv));
    }
    static readFromNanoWalletWLF(wlt) {
        const wallet = JSON.parse(js_base64_1.Base64.decode(wlt));
        // TODO: Check the encrypted and iv fields, if they aren't null, it's a simple wallet
        const account = wallet.accounts[0];
        let network;
        if (account.network < 0) {
            network = NetworkTypes_1.NetworkTypes.TEST_NET;
        }
        else if (account.network == 104) {
            network = NetworkTypes_1.NetworkTypes.MAIN_NET;
        }
        else {
            network = NetworkTypes_1.NetworkTypes.MIJIN_NET;
        }
        return new SimpleWallet(wallet.name, network, new Address_1.Address(account.address), js_joda_1.LocalDateTime.now(), new EncryptedPrivateKey_1.EncryptedPrivateKey(account.encrypted, account.iv));
    }
}
exports.SimpleWallet = SimpleWallet;
//# sourceMappingURL=SimpleWallet.js.map