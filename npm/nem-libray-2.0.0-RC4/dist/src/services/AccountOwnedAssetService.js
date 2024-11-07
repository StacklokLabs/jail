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
const AssetTransferable_1 = require("../models/asset/AssetTransferable");
const XEM_1 = require("../models/asset/XEM");
const operators_1 = require("rxjs/operators");
/**
 * Service to get account owned mosaics
 */
class AccountOwnedAssetService {
    /**
     * constructor
     * @param accountHttp
     * @param assetHttp
     */
    constructor(accountHttp, assetHttp) {
        this.accountHttp = accountHttp;
        this.assetHttp = assetHttp;
    }
    /**
     * Account owned assets definitions
     * @param address
     * @returns {Observable<AssetDefinition[]>}
     */
    fromAddress(address) {
        return this.accountHttp.getAssetsOwnedByAddress(address)
            .pipe(operators_1.flatMap((_) => _), operators_1.flatMap((mosaic) => {
            if (XEM_1.XEM.MOSAICID.equals(mosaic.assetId))
                return rxjs_1.of(new XEM_1.XEM(mosaic.quantity / Math.pow(10, 6)));
            else {
                return this.assetHttp.getAssetDefinition(mosaic.assetId)
                    .pipe(operators_1.map((assetDefinition) => {
                    return AssetTransferable_1.AssetTransferable.createWithAssetDefinition(assetDefinition, mosaic.quantity / Math.pow(10, assetDefinition.properties.divisibility));
                }));
            }
        }), operators_1.toArray());
    }
}
exports.AccountOwnedAssetService = AccountOwnedAssetService;
//# sourceMappingURL=AccountOwnedAssetService.js.map