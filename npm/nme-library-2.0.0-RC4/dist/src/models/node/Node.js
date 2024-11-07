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
const PublicAccount_1 = require("../account/PublicAccount");
/**
 * Nodes are the entities that perform communication in the network like sending and receiving data.
 * A node has an identity which is tied to an account through which the node can identify itself to the network.
 * The communication is done through the endpoint of the node. Additionally a node provides meta data information.
 */
class Node {
    /**
     * @internal
     * @param metaData
     * @param endpoint
     * @param identity
     */
    constructor(metaData, endpoint, identity) {
        this.metaData = metaData;
        this.endpoint = endpoint;
        this.identity = identity;
    }
    /**
     * @internal
     * @param dto
     * @returns {NodeDTO}
     */
    static createFromNodeDTO(dto) {
        return new Node(NodeMetaData.createFromNodeMetaDataDTO(dto.metaData), NodeEndpoint.createFromNodeEndpointDTO(dto.endpoint), NodeIdentity.createFromNodeIdentityDTO(dto.identity));
    }
}
exports.Node = Node;
/**
 * Node meta data
 */
class NodeMetaData {
    /**
     * @internal
     * @param features
     * @param network
     * @param application
     * @param version
     * @param platform
     */
    constructor(features, network, application, version, platform) {
        this.features = features;
        this.network = network;
        this.application = application;
        this.version = version;
        this.platform = platform;
    }
    /**
     * @internal
     * @param dto
     * @returns {NodeMetaDataDTO}
     */
    static createFromNodeMetaDataDTO(dto) {
        return new NodeMetaData(dto.features, dto.networkId, dto.application, dto.version, dto.platform);
    }
}
exports.NodeMetaData = NodeMetaData;
/**
 * Node endpoint
 */
class NodeEndpoint {
    /**
     * @internal
     * @param protocol
     * @param port
     * @param host
     */
    constructor(protocol, port, host) {
        this.protocol = protocol;
        this.port = port;
        this.host = host;
    }
    /**
     * @internal
     * @param dto
     * @returns {NodeEndpointDTO}
     */
    static createFromNodeEndpointDTO(dto) {
        return new NodeEndpoint(dto.protocol, dto.port, dto.host);
    }
}
exports.NodeEndpoint = NodeEndpoint;
/**
 * Node identity
 */
class NodeIdentity {
    /**
     * @internal
     * @param name
     * @param publickey
     */
    constructor(name, publicAccount) {
        this.name = name;
        this.publicAccount = publicAccount;
    }
    /**
     * @internal
     * @param dto
     * @returns {NodeIdentityDTO}
     */
    static createFromNodeIdentityDTO(dto) {
        return new NodeIdentity(dto.name, dto.publickey === undefined ? undefined : PublicAccount_1.PublicAccount.createWithPublicKey(dto.publickey));
    }
}
exports.NodeIdentity = NodeIdentity;
//# sourceMappingURL=Node.js.map