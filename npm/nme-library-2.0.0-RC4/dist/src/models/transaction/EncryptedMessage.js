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
const Message_1 = require("./Message");
const PlainMessage_1 = require("./PlainMessage");
/**
 * Encrypted Message model
 */
class EncryptedMessage extends Message_1.Message {
    /**
     * @internal
     * @param payload
     * @param recipientPublicAccount
     */
    constructor(payload, recipientPublicAccount) {
        super(payload);
        this.recipientPublicAccount = recipientPublicAccount;
    }
    isEncrypted() {
        return true;
    }
    isPlain() {
        return false;
    }
    /**
     * @internal
     * @param message
     * @param recipientPublicAccount
     * @param privateKey
     * @returns {EncryptedMessage}
     */
    static create(message, recipientPublicAccount, privateKey) {
        return new EncryptedMessage(nemSdk.default.crypto.helpers.encode(privateKey, recipientPublicAccount.publicKey, message), recipientPublicAccount);
    }
    /**
     * @internal
     */
    static createFromDTO(payload) {
        return new EncryptedMessage(payload);
    }
    /**
     * @internal
     * @param encryptMessage
     * @param privateKey
     * @param recipientPublicAccount
     * @returns {EncryptedMessage}
     */
    static decrypt(encryptMessage, privateKey, recipientPublicAccount) {
        return new PlainMessage_1.PlainMessage(Message_1.Message.decodeHex(nemSdk.default.crypto.helpers.decode(privateKey, recipientPublicAccount.publicKey, encryptMessage.payload)));
    }
    /**
     * @internal
     * @returns {MessageDTO}
     */
    toDTO() {
        return {
            payload: this.payload,
            type: 2,
        };
    }
}
exports.EncryptedMessage = EncryptedMessage;
//# sourceMappingURL=EncryptedMessage.js.map