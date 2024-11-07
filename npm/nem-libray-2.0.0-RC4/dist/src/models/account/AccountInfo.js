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
const Balance_1 = require("./Balance");
const PublicAccount_1 = require("./PublicAccount");
var RemoteStatus;
(function (RemoteStatus) {
    RemoteStatus["REMOTE"] = "REMOTE";
    RemoteStatus["ACTIVATING"] = "ACTIVATING";
    RemoteStatus["ACTIVE"] = "ACTIVE";
    RemoteStatus["DEACTIVATING"] = "DEACTIVATING";
    RemoteStatus["INACTIVE"] = "INACTIVE";
})(RemoteStatus = exports.RemoteStatus || (exports.RemoteStatus = {}));
var Status;
(function (Status) {
    Status["UNKNOWN"] = "UNKNOWN";
    Status["LOCKED"] = "LOCKED";
    Status["UNLOCKED"] = "UNLOCKED";
})(Status = exports.Status || (exports.Status = {}));
/**
 * The account structure describes basic information for an account.
 */
class AccountInfo {
    /**
     * @internal
     * @param balance
     * @param vestedBalance
     * @param importance
     * @param publicKey
     * @param harvestedBlocks
     * @param cosignatoriesCount
     * @param minCosignatories
     */
    constructor(balance, vestedBalance, importance, publicKey, harvestedBlocks, cosignatoriesCount, minCosignatories) {
        this.balance = new Balance_1.Balance(balance, vestedBalance);
        this.importance = importance;
        if (publicKey != null) {
            this.publicAccount = PublicAccount_1.PublicAccount.createWithPublicKey(publicKey);
        }
        this.harvestedBlocks = harvestedBlocks;
        this.cosignatoriesCount = cosignatoriesCount;
        this.minCosignatories = minCosignatories;
    }
    /**
     * @internal
     * @param dto
     * @returns {AccountInfo}
     */
    static createFromAccountInfoDTO(dto) {
        return new AccountInfo(dto.balance, dto.vestedBalance, dto.importance, dto.publicKey, dto.harvestedBlocks);
    }
}
exports.AccountInfo = AccountInfo;
class AccountInfoWithMetaData extends AccountInfo {
    /**
     * @internal
     * @param status
     * @param remoteStatus
     * @param cosignatoryOf
     * @param cosignatories
     * @param balance
     * @param vestedBalance
     * @param importance
     * @param publicKey
     * @param harvestedBlocks
     * @param cosignatoriesCount
     * @param minCosignatories
     */
    constructor(status, remoteStatus, cosignatoryOf, cosignatories, balance, vestedBalance, importance, publicKey, harvestedBlocks, cosignatoriesCount, minCosignatories) {
        super(balance, vestedBalance, importance, publicKey, harvestedBlocks, cosignatoriesCount, minCosignatories);
        this.status = status;
        this.remoteStatus = remoteStatus;
        this.cosignatoryOf = cosignatoryOf;
        this.cosignatories = cosignatories;
    }
    /**
     * @internal
     * @param dto
     * @returns {AccountInfoWithMetaData}
     */
    static createFromAccountMetaDataPairDTO(dto) {
        return new AccountInfoWithMetaData(Status[dto.meta.status], RemoteStatus[dto.meta.remoteStatus], dto.meta.cosignatoryOf.map((accountInfoDTO) => AccountInfo.createFromAccountInfoDTO(accountInfoDTO)), dto.meta.cosignatories.map((accountInfoDTO) => AccountInfo.createFromAccountInfoDTO(accountInfoDTO)), dto.account.balance, dto.account.vestedBalance, dto.account.importance, dto.account.publicKey, dto.account.harvestedBlocks, dto.account.multisigInfo.cosignatoriesCount, dto.account.multisigInfo.minCosignatories);
    }
}
exports.AccountInfoWithMetaData = AccountInfoWithMetaData;
// TODO: Solve this, issue with AccountHttp.status(address: Address)
class AccountStatus {
    /**
     * @internal
     */
    constructor(status, remoteStatus, cosignatoryOf, cosignatories) {
        this.status = status;
        this.remoteStatus = remoteStatus;
        this.cosignatoryOf = cosignatoryOf;
        this.cosignatories = cosignatories;
    }
    /**
     * @internal
     * @param dto
     * @returns {AccountInfoWithMetaData}
     */
    static createFromAccountMetaDataDTO(dto) {
        return new AccountStatus(Status[dto.status], RemoteStatus[dto.remoteStatus], dto.cosignatoryOf.map((accountInfoDTO) => AccountInfo.createFromAccountInfoDTO(accountInfoDTO)), dto.cosignatories.map((accountInfoDTO) => AccountInfo.createFromAccountInfoDTO(accountInfoDTO)));
    }
}
exports.AccountStatus = AccountStatus;
//# sourceMappingURL=AccountInfo.js.map