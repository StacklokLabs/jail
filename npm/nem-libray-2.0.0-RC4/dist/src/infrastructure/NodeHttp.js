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
const ExtendedNodeExperience_1 = require("../models/node/ExtendedNodeExperience");
const NisNodeInfo_1 = require("../models/node/NisNodeInfo");
const Node_1 = require("../models/node/Node");
const NodeCollection_1 = require("../models/node/NodeCollection");
const HttpEndpoint_1 = require("./HttpEndpoint");
const operators_1 = require("rxjs/operators");
class NodeHttp extends HttpEndpoint_1.HttpEndpoint {
    constructor(nodes) {
        super("node", nodes);
    }
    /**
     * Gets basic information about a node
     * @returns Observable<Node>
     */
    getNodeInfo() {
        return rxjs_1.of("info")
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((nodeDTO) => {
            return Node_1.Node.createFromNodeDTO(nodeDTO);
        }));
    }
    /**
     * Gets extended information about a node
     * @returns Observable<NisNodeInfo>
     */
    getNisNodeInfo() {
        return rxjs_1.of("extended-info")
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((nisNodeInfoDTO) => {
            return NisNodeInfo_1.NisNodeInfo.createFromNisNodeInfoDTO(nisNodeInfoDTO);
        }));
    }
    /**
     * Gets an array of all known nodes in the neighborhood.
     * @returns Observable<NodeCollection>
     */
    getAllNodes() {
        return rxjs_1.of("peer-list/all")
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((nodeCollectionDTO) => {
            return NodeCollection_1.NodeCollection.createFromNodeCollectionDTO(nodeCollectionDTO);
        }));
    }
    /**
     * Gets an array of all nodes with status 'active' in the neighborhood.
     * @returns Observable<Node[]>
     */
    getActiveNodes() {
        return rxjs_1.of("peer-list/reachable")
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((nodeCollectionData) => {
            return nodeCollectionData.data.map((nodeDTO) => {
                return Node_1.Node.createFromNodeDTO(nodeDTO);
            });
        }));
    }
    /**
     * Gets an array of active nodes in the neighborhood that are selected for broadcasts.
     * @returns Observable<Node[]>
     */
    getActiveNeighbourNodes() {
        return rxjs_1.of("peer-list/active")
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((nodeCollectionData) => {
            return nodeCollectionData.data.map((nodeDTO) => {
                return Node_1.Node.createFromNodeDTO(nodeDTO);
            });
        }));
    }
    /**
     * Requests the chain height from every node in the active node list and returns the maximum height seen.
     * @returns Observable<BlockHeight>
     */
    getMaximumChainHeightInActiveNeighborhood() {
        return rxjs_1.of("active-peers/max-chain-height")
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((blockHeight) => {
            return blockHeight.height;
        }));
    }
    /**
     * Requests the chain height from every node in the active node list and returns the maximum height seen.
     * @returns Observable<ExtendedNodeExperience[]>
     */
    getNodeExperiences() {
        return rxjs_1.of("experiences")
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((extendedNodeExperiencePairData) => {
            return extendedNodeExperiencePairData.data.map((extendedNodeExperiencePairDTO) => {
                return ExtendedNodeExperience_1.ExtendedNodeExperience.createFromExtendedNodeExperiencePairDTO(extendedNodeExperiencePairDTO);
            });
        }));
    }
}
exports.NodeHttp = NodeHttp;
//# sourceMappingURL=NodeHttp.js.map