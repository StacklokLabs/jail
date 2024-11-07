import { Observable } from "rxjs";
import { AssetDefinition } from "../models/asset/AssetDefinition";
import { AssetId } from "../models/asset/AssetId";
import { AssetTransferable } from "../models/asset/AssetTransferable";
import { HttpEndpoint, ServerConfig } from "./HttpEndpoint";
export declare class AssetHttp extends HttpEndpoint {
    constructor(nodes?: ServerConfig[]);
    /**
     * Gets the asset definitions for a given namespace. The request supports paging.
     * @param namespace
     * @param id - The topmost asset definition database id up to which root asset definitions are returned. The parameter is optional. If not supplied the most recent asset definitiona are returned.
     * @param pageSize - The number of asset definition objects to be returned for each request. The parameter is optional. The default value is 25, the minimum value is 5 and hte maximum value is 100.
     * @returns Observable<AssetDefinition[]>
     */
    getAllAssetsGivenNamespace(namespace: string, id?: number, pageSize?: number): Observable<AssetDefinition[]>;
    /**
     * Return the Mosaic Definition given a namespace and asset. Throw exception if no asset is found
     * @param {string} assetId
     * @returns {Observable<AssetDefinition>}
     */
    getAssetDefinition(assetId: AssetId): Observable<AssetDefinition>;
    /**
     * Return a AssetTransferable
     * @param {string} assetId
     * @param {number} quantity
     * @returns {Observable<AssetTransferable>}
     */
    getAssetTransferableWithAbsoluteAmount(assetId: AssetId, quantity: number): Observable<AssetTransferable>;
    /**
     * Return a AssetTransferable
     * @param {string} assetId
     * @param {number} quantity
     * @returns {Observable<AssetTransferable>}
     */
    getAssetTransferableWithRelativeAmount(assetId: AssetId, quantity: number): Observable<AssetTransferable>;
}
