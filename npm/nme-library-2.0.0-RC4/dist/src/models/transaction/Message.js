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
const utf8 = require("utf8");
/**
 * Message model
 */
class Message {
    /**
     * @internal
     * @param payload
     */
    constructor(payload) {
        this.payload = payload;
    }
    isHexMessage() {
        return this.isPlain() && this.payload.indexOf("fe") === 0;
    }
    /**
     * @internal
     * @param message
     * @returns {string}
     */
    static encodeHex(message) {
        const rawString = this.rstr2utf8(message);
        let hex = "";
        for (let i = 0; i < rawString.length; i++) {
            hex += this.strlpad(rawString.charCodeAt(i).toString(16), "0", 2);
        }
        return utf8.encode(hex);
    }
    /**
     * @internal
     * @param hex
     * @returns {string}
     */
    static decodeHex(hex) {
        let str = "";
        for (let i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        try {
            return utf8.decode(str);
        }
        catch (e) {
            return str;
        }
    }
    /**
     * @internal
     * @param input
     * @returns {string}
     */
    static rstr2utf8(input) {
        let output = "";
        for (let n = 0; n < input.length; n++) {
            const c = input.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            }
            else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    }
    /**
     * @internal
     * Padding helper for above function
     * @param str
     * @param pad
     * @param len
     * @returns {any}
     */
    static strlpad(str, pad, len) {
        while (str.length < len) {
            str = pad + str;
        }
        return str;
    }
}
exports.Message = Message;
//# sourceMappingURL=Message.js.map