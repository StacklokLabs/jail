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
const Namespace_1 = require("../models/namespace/Namespace");
const HttpEndpoint_1 = require("./HttpEndpoint");
const NamespacesPageable_1 = require("./NamespacesPageable");
const operators_1 = require("rxjs/operators");
class NamespaceHttp extends HttpEndpoint_1.HttpEndpoint {
    constructor(nodes) {
        super("namespace", nodes);
    }
    /**
     * Paginaged version of incomingTransactions request
     * @param address
     * @param params
     */
    getRootNamespacesPaginated(params) {
        if (params === undefined)
            params = {};
        return new NamespacesPageable_1.NamespacesPageable(this, params);
    }
    /**
     * Gets the root namespaces. The requests supports paging, i.e. retrieving the root namespaces in batches of a specified size.
     * @param id - The topmost namespace database id up to which root namespaces are returned. The parameter is optional. If not supplied the most recent rented root namespaces are returned.
     * @param pageSize - (Optional) The number of namespace objects to be returned for each request. The parameter is optional. The default value is 25, the minimum value is 5 and the maximum value is 100.
     * @returns Observable<Namespace[]>
     */
    getRootNamespaces(id, pageSize) {
        const query = [
            id ? "id=" + id : null,
            pageSize ? "pageSize=" + pageSize : null
        ].filter(_ => _).join("&");
        const url = "root/page" + (query.length > 0 ? "?" + query : "");
        return rxjs_1.of(url)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((namespacesData) => {
            return namespacesData.data.map((namespace) => {
                return Namespace_1.Namespace.createFromNamespaceMetaDataPairDTO(namespace);
            });
        }));
    }
    /**
     * Gets the namespace with given id.
     * @param namespace - The namespace id.
     * @returns Observable<Namespace>
     */
    getNamespace(namespace) {
        return rxjs_1.of("?namespace=" + namespace)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((namespace) => {
            return Namespace_1.Namespace.createFromNamespaceDTO(namespace);
        }));
    }
}
exports.NamespaceHttp = NamespaceHttp;
//# sourceMappingURL=NamespaceHttp.js.map