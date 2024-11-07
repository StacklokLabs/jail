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
const Address_1 = require("./Address");
/**
 * Each account is assigned an importance in the NEM network. The ability of an account to generate new blocks is proportional to its importance. The importance is a number between 0 and 1.
 */
class AccountImportanceInfo {
    /**
     * @internal
     * @param address
     * @param importance
     */
    constructor(address, importance) {
        this.address = address;
        this.importance = importance;
    }
    /**
     * @internal
     * @param dto
     * @returns {AccountImportanceInfo}
     */
    static createFromAccountImportanceViewModelDTO(dto) {
        return new AccountImportanceInfo(new Address_1.Address(dto.address), AccountImportanceData.createFromAccountImportanceDataDTO(dto.importance));
    }
}
exports.AccountImportanceInfo = AccountImportanceInfo;
/**
 * Substructure that describes the importance of the account.
 */
class AccountImportanceData {
    /**
     * @internal
     * @param isSet
     * @param score
     * @param ev
     * @param height
     */
    constructor(isSet, score, ev, height) {
        this.isSet = isSet;
        this.score = score;
        this.ev = ev;
        this.height = height;
    }
    /**
     * @internal
     * @param dto
     * @returns {AccountImportanceData}
     */
    static createFromAccountImportanceDataDTO(dto) {
        return new AccountImportanceData(dto.isSet, dto.score, dto.ev, dto.height);
    }
}
exports.AccountImportanceData = AccountImportanceData;
//# sourceMappingURL=AccountImportanceInfo.js.map