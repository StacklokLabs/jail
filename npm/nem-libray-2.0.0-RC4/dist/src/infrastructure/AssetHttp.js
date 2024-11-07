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
const AssetDefinition_1 = require("../models/asset/AssetDefinition");
const AssetTransferable_1 = require("../models/asset/AssetTransferable");
const HttpEndpoint_1 = require("./HttpEndpoint");
const operators_1 = require("rxjs/operators");
class AssetHttp extends HttpEndpoint_1.HttpEndpoint {
    constructor(nodes) {
        super("namespace", nodes);
    }
    /**
     * Gets the asset definitions for a given namespace. The request supports paging.
     * @param namespace
     * @param id - The topmost asset definition database id up to which root asset definitions are returned. The parameter is optional. If not supplied the most recent asset definitiona are returned.
     * @param pageSize - The number of asset definition objects to be returned for each request. The parameter is optional. The default value is 25, the minimum value is 5 and hte maximum value is 100.
     * @returns Observable<AssetDefinition[]>
     */
    getAllAssetsGivenNamespace(namespace, id, pageSize) {
        const url = "mosaic/definition/page?namespace=" + namespace +
            (id === undefined ? "" : "&id=" + id) +
            (pageSize === undefined ? "" : "&pageSize=" + pageSize);
        return rxjs_1.of(url)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((mosaicDefinitionsData) => {
            return mosaicDefinitionsData.data.map((mosaicDefinitionMetaDataPairDTO) => {
                return AssetDefinition_1.AssetDefinition.createFromMosaicDefinitionMetaDataPairDTO(mosaicDefinitionMetaDataPairDTO);
            });
        }));
    }
    /**
     * Return the Mosaic Definition given a namespace and asset. Throw exception if no asset is found
     * @param {string} assetId
     * @returns {Observable<AssetDefinition>}
     */
    getAssetDefinition(assetId) {
        return this.getAllAssetsGivenNamespace(assetId.namespaceId, undefined, 100)
            .pipe(operators_1.flatMap((_) => _), operators_1.filter((assetDefinition) => assetDefinition.id.equals(assetId)), operators_1.last());
    }
    /**
     * Return a AssetTransferable
     * @param {string} assetId
     * @param {number} quantity
     * @returns {Observable<AssetTransferable>}
     */
    getAssetTransferableWithAbsoluteAmount(assetId, quantity) {
        return this.getAssetDefinition(assetId)
            .pipe(operators_1.map((assetDefinition) => AssetTransferable_1.AssetTransferable.createAbsolute(assetDefinition.id, assetDefinition.properties, quantity, assetDefinition.levy)));
    }
    /**
     * Return a AssetTransferable
     * @param {string} assetId
     * @param {number} quantity
     * @returns {Observable<AssetTransferable>}
     */
    getAssetTransferableWithRelativeAmount(assetId, quantity) {
        return this.getAssetDefinition(assetId)
            .pipe(operators_1.map((assetDefinition) => AssetTransferable_1.AssetTransferable.createRelative(assetDefinition.id, assetDefinition.properties, quantity, assetDefinition.levy)));
    }
}
exports.AssetHttp = AssetHttp;
//# sourceMappingURL=AssetHttp.js.map