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
const AccountInfo_1 = require("../models/account/AccountInfo");
const Listener_1 = require("./Listener");
/**
 * Account listener
 */
class AccountListener extends Listener_1.Listener {
    /**
     * Constructor
     * @param nodes
     */
    constructor(nodes) {
        super(nodes);
    }
    /**
     * Start listening updates
     * @param address
     * @returns {Observable<AccountInfoWithMetaData>}
     */
    given(address) {
        return rxjs_1.Observable.create((observer) => {
            const client = this.createClient();
            client.connect({}, () => {
                //initial subscription to address.
                client.send("/w/api/account/subscribe", {}, "{'account':'" + address.plain() + "'}");
                client.subscribe("/account/" + address.plain(), (data) => {
                    try {
                        const account = AccountInfo_1.AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(JSON.parse(data.body));
                        observer.next(account);
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
exports.AccountListener = AccountListener;
//# sourceMappingURL=AccountListener.js.map