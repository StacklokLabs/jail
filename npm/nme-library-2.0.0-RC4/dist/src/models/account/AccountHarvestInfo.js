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
/**
 * A HarvestInfo object contains information about a block that an account harvested.
 */
class AccountHarvestInfo {
    /**
     * @internal
     * @param timeStamp
     * @param id
     * @param difficulty
     * @param totalFee
     * @param height
     */
    constructor(timeStamp, id, difficulty, totalFee, height) {
        this.timeStamp = timeStamp;
        this.id = id;
        this.difficulty = difficulty;
        this.totalFee = totalFee;
        this.height = height;
    }
    /**
     * @internal
     * @param dto
     * @returns {AccountHarvestInfo}
     */
    static createFromHarvestInfoDTO(dto) {
        return new AccountHarvestInfo(dto.timeStamp, dto.id, dto.difficulty, dto.totalFee, dto.height);
    }
}
exports.AccountHarvestInfo = AccountHarvestInfo;
//# sourceMappingURL=AccountHarvestInfo.js.map