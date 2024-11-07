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
const AssetDefinition_1 = require("./AssetDefinition");
const AssetId_1 = require("./AssetId");
const AssetTransferable_1 = require("./AssetTransferable");
/**
 * XEM mosaic transferable
 */
class XEM extends AssetTransferable_1.AssetTransferable {
    /**
     * constructor
     * @param quantity - Relative quantity
     */
    constructor(quantity) {
        super(XEM.MOSAICID, new AssetDefinition_1.AssetProperties(XEM.DIVISIBILITY, XEM.INITIALSUPPLY, XEM.TRANSFERABLE, XEM.SUPPLYMUTABLE), quantity * Math.pow(10, XEM.DIVISIBILITY));
    }
    /**
     * Create XEM with an absolute quantity
     * @param quantity
     * @returns {AssetTransferable}
     */
    static fromAbsolute(quantity) {
        return new XEM(quantity / Math.pow(10, XEM.DIVISIBILITY));
    }
    /**
     * Create XEM with an relative quantity
     * @param quantity
     * @returns {AssetTransferable}
     */
    static fromRelative(quantity) {
        return new XEM(quantity);
    }
}
/**
 * Divisiblity
 * @type {number}
 */
XEM.DIVISIBILITY = 6;
/**
 * Initial supply
 * @type {number}
 */
XEM.INITIALSUPPLY = 8999999999;
/**
 * Is tranferable
 * @type {boolean}
 */
XEM.TRANSFERABLE = true;
/**
 * Is mutable
 * @type {boolean}
 */
XEM.SUPPLYMUTABLE = false;
/**
 * mosaicId
 * @type {AssetId}
 */
XEM.MOSAICID = new AssetId_1.AssetId("nem", "xem");
exports.XEM = XEM;
//# sourceMappingURL=XEM.js.map