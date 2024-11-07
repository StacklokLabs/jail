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
class BlockHttp extends HttpEndpoint_1.HttpEndpoint {
    constructor(nodes) {
        super("block", nodes);
    }
    /**
     * Gets a block from the chain that has a given hash.
     * @param blockHeight
     * @returns Observable<Block>
     */
    getBlockByHeight(blockHeight) {
        return rxjs_1.of("at/public")
            .pipe(operators_1.flatMap((url) => requestPromise.post({
            uri: this.nextNode() + url,
            body: {
                height: blockHeight,
            },
            json: true,
        })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((block) => {
            return Block_1.Block.createFromBlockDTO(block);
        }));
    }
}
exports.BlockHttp = BlockHttp;
//# sourceMappingURL=BlockHttp.js.map