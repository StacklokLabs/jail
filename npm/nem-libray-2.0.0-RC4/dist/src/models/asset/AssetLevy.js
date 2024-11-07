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
const Address_1 = require("../account/Address");
const AssetId_1 = require("./AssetId");
/**
 * 1: The levy is an absolute fee. The field 'fee' states how many sub-units of the specified mosaic will be transferred to the recipient.
 * 2: The levy is calculated from the transferred xem. The field 'fee' states how many percentiles of the transferred quantity will transferred to the recipient.
 */
var AssetLevyType;
(function (AssetLevyType) {
    AssetLevyType[AssetLevyType["Absolute"] = 1] = "Absolute";
    AssetLevyType[AssetLevyType["Percentil"] = 2] = "Percentil";
})(AssetLevyType = exports.AssetLevyType || (exports.AssetLevyType = {}));
/**
 *
 * A mosaic definition can optionally specify a levy for transferring those mosaics. This might be needed by legal entities needing to collect some taxes for transfers.
 */
class AssetLevy {
    /**
     * constructor
     * @param type
     * @param recipient
     * @param assetId
     * @param fee
     */
    constructor(type, recipient, assetId, fee) {
        this.type = type;
        this.recipient = recipient;
        this.assetId = assetId;
        this.fee = fee;
    }
    /**
     * @internal
     */
    toDTO() {
        return {
            mosaicId: this.assetId,
            recipient: this.recipient.plain(),
            type: this.type,
            fee: this.fee,
        };
    }
    /**
     * @internal
     * @param dto
     * @returns {AssetLevy}
     */
    static createFromMosaicLevyDTO(dto) {
        return new AssetLevy(dto.type, new Address_1.Address(dto.recipient), AssetId_1.AssetId.createFromMosaicIdDTO(dto.mosaicId), dto.fee);
    }
}
exports.AssetLevy = AssetLevy;
//# sourceMappingURL=AssetLevy.js.map