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
const requestPromise = require("request-promise-native");
const rxjs_1 = require("rxjs");
const NemAnnounceResult_1 = require("../models/transaction/NemAnnounceResult");
const HttpEndpoint_1 = require("./HttpEndpoint");
const CreateTransactionFromDTO_1 = require("./transaction/CreateTransactionFromDTO");
const operators_1 = require("rxjs/operators");
class TransactionHttp extends HttpEndpoint_1.HttpEndpoint {
    constructor(nodes) {
        super("transaction", nodes);
    }
    /**
     * Send the signed transaction
     * @param transaction
     * @returns Observable<NemAnnounceSuccessResult>
     */
    announceTransaction(transaction) {
        return rxjs_1.of("announce")
            .pipe(operators_1.flatMap((url) => requestPromise.post({
            uri: this.nextNode() + url,
            body: transaction,
            json: true,
        })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((nemAnnonceResultDTO) => {
            if (nemAnnonceResultDTO.message != "SUCCESS") {
                throw new Error(nemAnnonceResultDTO.message);
            }
            return NemAnnounceResult_1.NemAnnounceResult.createFromNemAnnounceResultDTO(nemAnnonceResultDTO);
        }));
    }
    /**
     * Receive a transaction by its hash
     * @param {string} hash - transaction hash
     * @returns Observable<Transaction>
     */
    getByHash(hash) {
        return rxjs_1.of("get?hash=" + hash)
            .pipe(operators_1.flatMap((url) => requestPromise.get({
            uri: this.nextNode() + url,
            json: true,
        })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((transactionDTO) => CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO)));
    }
}
exports.TransactionHttp = TransactionHttp;
//# sourceMappingURL=TransactionHttp.js.map