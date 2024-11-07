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
const errors_1 = require("request-promise-native/errors");
const NetworkTypes_1 = require("../models/node/NetworkTypes");
const NEMLibrary_1 = require("../NEMLibrary");
const operators_1 = require("rxjs/operators");
class HttpEndpoint {
    constructor(resource, nodes, preferProtocol) {
        this.resource = resource;
        this.pointer = 0;
        this.historicalPointer = 0;
        this.replyWhenRequestError = (errors) => {
            return errors.pipe(operators_1.tap((x) => {
                if (!(x instanceof errors_1.RequestError)) {
                    throw (x);
                }
            }));
        };
        if (nodes) {
            this.nodes = nodes.map((_) => {
                return {
                    protocol: _.protocol ? _.protocol : "http",
                    domain: _.domain,
                    port: _.port ? _.port : 7890,
                };
            });
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() == NetworkTypes_1.NetworkTypes.TEST_NET) {
            this.nodes = [
                { protocol: "http", domain: "bigalice2.nem.ninja", port: 7890 },
                { protocol: "http", domain: "192.3.61.243", port: 7890 },
                { protocol: "http", domain: "23.228.67.85", port: 7890 },
                { protocol: "http", domain: "50.3.87.123", port: 7890 },
            ];
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() == NetworkTypes_1.NetworkTypes.MAIN_NET) {
            this.nodes = [
                { protocol: "http", domain: "alice6.nem.ninja", port: 7890 },
                { protocol: "http", domain: "62.75.171.41", port: 7890 },
                { protocol: "http", domain: "san.nem.ninja", port: 7890 },
                { protocol: "http", domain: "go.nem.ninja", port: 7890 },
                { protocol: "http", domain: "hachi.nem.ninja", port: 7890 },
                { protocol: "http", domain: "jusan.nem.ninja", port: 7890 },
                { protocol: "http", domain: "nijuichi.nem.ninja", port: 7890 },
                { protocol: "http", domain: "alice2.nem.ninja", port: 7890 },
                { protocol: "http", domain: "alice3.nem.ninja", port: 7890 },
                { protocol: "http", domain: "alice4.nem.ninja", port: 7890 },
                { protocol: "http", domain: "alice5.nem.ninja", port: 7890 },
                { protocol: "http", domain: "alice6.nem.ninja", port: 7890 },
                { protocol: "http", domain: "alice7.nem.ninja", port: 7890 },
                { protocol: "https", domain: "nis2.wnsl.biz", port: 7779 },
            ];
        }
        else {
            throw new Error("Nodes uninitialized");
        }
        if (preferProtocol) {
            this.nodes = this.nodes.filter((_) => _.protocol == preferProtocol);
        }
        if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.TEST_NET) {
            this.historicalNodes = [
                { protocol: "http", domain: "104.128.226.60", port: 7890 },
            ];
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.MAIN_NET) {
            this.historicalNodes = [
                { protocol: "http", domain: "88.99.192.82", port: 7890 },
            ];
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.MIJIN_NET) {
            this.historicalNodes = this.nodes;
        }
        else {
            throw new Error("Nodes uninitialized");
        }
    }
    /**
     * @internal
     * @returns {string}
     */
    nextNode() {
        if (this.pointer == this.nodes.length) {
            this.pointer = 0;
        }
        const protocol = this.nodes[this.pointer].protocol;
        const domain = this.nodes[this.pointer].domain;
        const port = this.nodes[this.pointer].port;
        const URL = protocol + "://" + domain + ":" + port + "/" + this.resource + "/";
        this.pointer++;
        return URL;
    }
    /**
     * @internal
     * @returns {string}
     */
    nextHistoricalNode() {
        if (this.historicalPointer >= this.historicalNodes.length) {
            this.historicalPointer = 0;
        }
        const protocol = this.historicalNodes[this.historicalPointer].protocol;
        const domain = this.historicalNodes[this.historicalPointer].domain;
        const port = this.historicalNodes[this.historicalPointer].port;
        const URL = protocol + "://" + domain + ":" + port + "/" + this.resource + "/";
        this.historicalPointer++;
        return URL;
    }
}
exports.HttpEndpoint = HttpEndpoint;
//# sourceMappingURL=HttpEndpoint.js.map