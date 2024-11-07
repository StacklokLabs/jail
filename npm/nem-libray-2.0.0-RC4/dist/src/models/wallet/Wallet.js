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
const NetworkTypes_1 = require("../node/NetworkTypes");
var WalletType;
(function (WalletType) {
    WalletType[WalletType["SIMPLE"] = 0] = "SIMPLE";
    WalletType[WalletType["BRAIN"] = 1] = "BRAIN";
})(WalletType = exports.WalletType || (exports.WalletType = {}));
/**
 * Wallet base model
 */
class Wallet {
    /**
     * @internal
     * @param name
     * @param network
     * @param address
     * @param creationDate
     * @param schema
     */
    constructor(name, network, address, creationDate, schema) {
        this.name = name;
        this.network = network;
        this.address = address;
        this.creationDate = creationDate;
        this.schema = schema;
    }
    /**
     * @internal
     */
    static networkTypesSDKAdapter(network) {
        if (network == NetworkTypes_1.NetworkTypes.MAIN_NET) {
            return 104;
        }
        else if (network == NetworkTypes_1.NetworkTypes.TEST_NET) {
            return -104;
        }
        else {
            return 96;
        }
    }
    /**
     * Given a WLT string, retusn the WalletType
     * @param {string} wlt
     * @returns {WalletType}
     */
    static walletTypeGivenWLT(wlt) {
        const wallet = JSON.parse(js_base64_1.Base64.decode(wlt));
        if (wallet.type == "simple")
            return WalletType.SIMPLE;
        else if (wallet.type == "brain")
            return WalletType.BRAIN;
        throw new Error("ILLEGAL WALLET TYPE");
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=Wallet.js.map