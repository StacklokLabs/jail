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
const EncryptedMessage_1 = require("../transaction/EncryptedMessage");
const Address_1 = require("./Address");
const PublicAccount_1 = require("./PublicAccount");
/**
 * Account model
 */
class Account extends PublicAccount_1.PublicAccount {
    /**
     * Constructor
     * @internal
     * @param address
     * @param publicKey
     * @param privateKey
     */
    constructor(address, publicKey, privateKey) {
        super(address, publicKey);
        this.privateKey = privateKey;
    }
    /**
     * Sign a transaction
     * @param transaction
     * @returns {{data: any, signature: string}}
     */
    signTransaction(transaction) {
        transaction.signer = PublicAccount_1.PublicAccount.createWithPublicKey(this.publicKey);
        transaction.setNetworkType(this.address.network());
        const dto = transaction.toDTO();
        const keyPair = nemSdk.default.crypto.keyPair.create(nemSdk.default.utils.helpers.fixPrivateKey(this.privateKey));
        const result = nemSdk.default.utils.serialization.serializeTransaction(dto);
        const signature = keyPair.sign(result);
        return {
            data: nemSdk.default.utils.convert.ua2hex(result),
            signature: signature.toString(),
        };
    }
    /**
     * Sign string
     * @param messagestring
     * @returns signatureString
     */
    signMessage(message) {
        const keyPair = nemSdk.default.crypto.keyPair.create(nemSdk.default.utils.helpers.fixPrivateKey(this.privateKey));
        return keyPair.sign(message);
    }
    /**
     * constructor with private key
     * @param privateKey
     * @returns {Account}
     */
    static createWithPrivateKey(privateKey) {
        if (privateKey == undefined) {
            throw new Error("Private Key is undefined");
        }
        let network;
        if (NEMLibrary_1.NEMLibrary.getNetworkType() == NetworkTypes_1.NetworkTypes.MAIN_NET) {
            network = nemSdk.default.model.network.data.mainnet.id;
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() == NetworkTypes_1.NetworkTypes.TEST_NET) {
            network = nemSdk.default.model.network.data.testnet.id;
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() == NetworkTypes_1.NetworkTypes.MIJIN_NET) {
            network = nemSdk.default.model.network.data.mijin.id;
        }
        const keyPair = nemSdk.default.crypto.keyPair.create(nemSdk.default.utils.helpers.fixPrivateKey(privateKey));
        const publicKey = keyPair.publicKey.toString();
        const address = nemSdk.default.model.address.toAddress(publicKey, network);
        return new Account(new Address_1.Address(address), publicKey, privateKey);
    }
    /**
     * generate new account
     * @param walletName
     * @param passphrase
     * @param networkType
     * @returns {Account}
     */
    static generateAccount(walletName, passphrase, networkType) {
        // Generate a random private key
        // Note: we DON'T want to derivate the private key from the passphrase, since everytime the password is the same,
        //   the same key pair would be generated (brain wallet).
        //   Brain wallets are great, if the user can remember the password in his BRAIN and the
        //   password is still complex enough to be secure and unique.
        //   Hence, brain wallets are not the right choice for most users
        const privateKey = nemSdk.default.crypto.js.lib.WordArray.random(32).toString();
        const keyPair = nemSdk.default.crypto.keyPair.create(privateKey);
        const address = PublicAccount_1.PublicAccount.createWithPublicKey(keyPair.publicKey.toString()).address;
        return new Account(address, keyPair.publicKey.toString(), privateKey.toString());
    }
    /**
     * Create a new encrypted Message
     * @param message
     * @param recipientPublicAccount
     * @returns {EncryptedMessage}
     */
    encryptMessage(message, recipientPublicAccount) {
        return EncryptedMessage_1.EncryptedMessage.create(message, recipientPublicAccount, this.privateKey);
    }
    /**
     * Decrypts an encrypted message
     * @param encryptedMessage
     * @param recipientPublicAccount
     * @returns {PlainMessage}
     */
    decryptMessage(encryptedMessage, recipientPublicAccount) {
        return EncryptedMessage_1.EncryptedMessage.decrypt(encryptedMessage, this.privateKey, recipientPublicAccount);
    }
}
exports.Account = Account;
//# sourceMappingURL=Account.js.map