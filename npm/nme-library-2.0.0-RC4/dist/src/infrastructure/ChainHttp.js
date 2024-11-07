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
const Block_1 = require("../models/blockchain/Block");
const HttpEndpoint_1 = require("./HttpEndpoint");
const operators_1 = require("rxjs/operators");
class ChainHttp extends HttpEndpoint_1.HttpEndpoint {
    constructor(nodes) {
        super("chain", nodes);
    }
    /**
     * Gets the current height of the block chain.
     * @returns Observable<BlockHeight>
     */
    getBlockchainHeight() {
        return rxjs_1.of("height")
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((result) => {
            return result.height;
        }));
    }
    /**
     * Gets the current score of the block chain. The higher the score, the better the chain.
     * During synchronization, nodes try to get the best block chain in the network.
     * @returns Observable<BlockChainScore>
     */
    getBlockchainScore() {
        return rxjs_1.of("score")
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((result) => {
            return result.score;
        }));
    }
    /**
     * Gets the current last block of the chain.
     * @returns Observable<Block>
     */
    getBlockchainLastBlock() {
        return rxjs_1.of("last-block")
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((result) => {
            return Block_1.Block.createFromBlockDTO(result);
        }));
    }
}
exports.ChainHttp = ChainHttp;
//# sourceMappingURL=ChainHttp.js.map