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
const Message_1 = require("./Message");
/**
 * Plain Message model
 */
class PlainMessage extends Message_1.Message {
    /**
     * @internal
     * @param payload
     */
    constructor(payload) {
        super(payload);
    }
    /**
     * Create new constructor
     * @returns {boolean}
     */
    static create(message) {
        return new PlainMessage(this.encodeHex(message));
    }
    isEncrypted() {
        return false;
    }
    isPlain() {
        return true;
    }
    /**
     * @internal
     */
    static createFromDTO(payload) {
        return new PlainMessage(payload);
    }
    /**
     * @internal
     * @returns {MessageDTO}
     */
    toDTO() {
        return {
            payload: this.payload,
            type: 1,
        };
    }
    /**
     * Message string
     * @returns {string}
     */
    plain() {
        return Message_1.Message.decodeHex(this.payload);
    }
}
exports.PlainMessage = PlainMessage;
exports.EmptyMessage = PlainMessage.create("");
//# sourceMappingURL=PlainMessage.js.map