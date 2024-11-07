import { Observable } from "rxjs";
import { AssetHttp } from "../infrastructure/AssetHttp";
import { AssetTransferable } from "../models/asset/AssetTransferable";
/**
 * Mosaic service
 */
export declare class AssetService {
    /**
     * assetHttp
     */
    private assetHttp;
    /**
     * constructor
     * @param assetHttp
     */
    constructor(assetHttp: AssetHttp);
    /**
     * Calculate levy for a given assetTransferable
     * @param assetTransferable
     * @returns {any}
     */
    calculateLevy(assetTransferable: AssetTransferable): Observable<number>;
}
