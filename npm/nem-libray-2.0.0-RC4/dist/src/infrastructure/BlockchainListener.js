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
const operators_1 = require("rxjs/operators");
const models_1 = require("../models");
const Listener_1 = require("./Listener");
/**
 * Blockchain listener
 */
class BlockchainListener extends Listener_1.Listener {
    /**
     * Constructor
     * @param nodes
     */
    constructor(nodes) {
        super(nodes);
    }
    /**
     * Start listening new blocks
     * @returns {Observable<Block>}
     */
    newBlock() {
        return rxjs_1.Observable.create((observer) => {
            const client = this.createClient();
            client.connect({}, () => {
                client.subscribe("/blocks", (data) => {
                    try {
                        const dto = JSON.parse(data.body);
                        observer.next(models_1.Block.createFromBlockDTO(dto));
                    }
                    catch (e) {
                        observer.error(e);
                    }
                });
            }, (err) => {
                observer.error(err);
            });
            return () => {
                client.unsubscribe();
            };
        }).pipe(operators_1.retry(10));
    }
    /**
     * Start listening new blockchain height
     * @returns {Observable<BlockHeight>}
     */
    newHeight() {
        return rxjs_1.Observable.create((observer) => {
            const client = this.createClient();
            client.connect({}, () => {
                client.subscribe("/blocks/new", (data) => {
                    try {
                        const dto = JSON.parse(data.body);
                        observer.next(dto.height);
                    }
                    catch (e) {
                        observer.error(e);
                    }
                });
            }, (err) => {
                observer.error(err);
            });
            return () => {
                client.unsubscribe();
            };
        }).pipe(operators_1.retry(10));
    }
}
exports.BlockchainListener = BlockchainListener;
//# sourceMappingURL=BlockchainListener.js.map