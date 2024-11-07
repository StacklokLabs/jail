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
const rxjs_1 = require("rxjs");
const AssetDefinition_1 = require("../models/asset/AssetDefinition");
const AssetLevy_1 = require("../models/asset/AssetLevy");
const XEM_1 = require("../models/asset/XEM");
const operators_1 = require("rxjs/operators");
/**
 * Mosaic service
 */
class AssetService {
    /**
     * constructor
     * @param assetHttp
     */
    constructor(assetHttp) {
        this.assetHttp = assetHttp;
    }
    /**
     * Calculate levy for a given assetTransferable
     * @param assetTransferable
     * @returns {any}
     */
    calculateLevy(assetTransferable) {
        if (assetTransferable.levy == undefined)
            return rxjs_1.of(0);
        if (assetTransferable.levy.assetId.equals(XEM_1.XEM.MOSAICID)) {
            return rxjs_1.of(this.levyFee(assetTransferable, new AssetDefinition_1.AssetProperties(XEM_1.XEM.DIVISIBILITY, XEM_1.XEM.INITIALSUPPLY, XEM_1.XEM.TRANSFERABLE, XEM_1.XEM.SUPPLYMUTABLE)));
        }
        else {
            return this.assetHttp.getAssetDefinition(assetTransferable.levy.assetId)
                .pipe(operators_1.map((levyMosaicDefinition) => {
                return this.levyFee(assetTransferable, levyMosaicDefinition.properties);
            }));
        }
    }
    /**
     * @internal
     * @param assetTransferable
     * @param levyProperties
     * @returns number
     */
    levyFee(assetTransferable, levyProperties) {
        let levyValue;
        if (assetTransferable.levy.type == AssetLevy_1.AssetLevyType.Absolute) {
            levyValue = assetTransferable.levy.fee;
        }
        else {
            levyValue = assetTransferable.relativeQuantity() * assetTransferable.levy.fee / 10000;
        }
        const o = parseInt(levyValue, 10);
        if (!o) {
            if (levyProperties.divisibility === 0) {
                return 0;
            }
            else {
                return parseFloat("0." + o.toFixed(levyProperties.divisibility).split(".")[1]);
            }
        }
        return o / Math.pow(10, levyProperties.divisibility);
    }
}
exports.AssetService = AssetService;
//# sourceMappingURL=AssetService.js.map