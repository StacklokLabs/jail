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
const NetworkTypes_1 = require("../node/NetworkTypes");
/**
 * Address model
 */
class Address {
    constructor(address) {
        this.value = address.replace(/-/g, "").trim().toUpperCase();
        if (this.value.charAt(0) == "T") {
            this.networkType = NetworkTypes_1.NetworkTypes.TEST_NET;
        }
        else if (this.value.charAt(0) == "N") {
            this.networkType = NetworkTypes_1.NetworkTypes.MAIN_NET;
        }
        else if (this.value.charAt(0) == "M") {
            this.networkType = NetworkTypes_1.NetworkTypes.MIJIN_NET;
        }
        else {
            throw new Error("NetworkType invalid");
        }
    }
    /**
     * Get address in plain format ex: TALICEROONSJCPHC63F52V6FY3SDMSVAEUGHMB7C
     * @returns {string}
     */
    plain() {
        return this.value;
    }
    /**
     * Get address in pretty format ex: TALICE-ROONSJ-CPHC63-F52V6F-Y3SDMS-VAEUGH-MB7C
     * @returns {string}
     */
    pretty() {
        return this.value.match(/.{1,6}/g).join("-");
    }
    /**
     * Address network
     * @returns {number}
     */
    network() {
        if (this.value.charAt(0) == "T") {
            return NetworkTypes_1.NetworkTypes.TEST_NET;
        }
        else if (this.value.charAt(0) == "N") {
            return NetworkTypes_1.NetworkTypes.MAIN_NET;
        }
        else {
            return NetworkTypes_1.NetworkTypes.MIJIN_NET;
        }
    }
    equals(otherAddress) {
        return this.plain() == otherAddress.plain();
    }
}
exports.Address = Address;
//# sourceMappingURL=Address.js.map