import { Observable } from "rxjs";
import { AccountHttp } from "../infrastructure/AccountHttp";
import { AssetHttp } from "../infrastructure/AssetHttp";
import { Address } from "../models/account/Address";
import { AssetTransferable } from "../models/asset/AssetTransferable";
/**
 * Service to get account owned mosaics
 */
export declare class AccountOwnedAssetService {
    /**
     * accountHttp
     */
    private accountHttp;
    /**
     * assetHttp
     */
    private assetHttp;
    /**
     * constructor
     * @param accountHttp
     * @param assetHttp
     */
    constructor(accountHttp: AccountHttp, assetHttp: AssetHttp);
    /**
     * Account owned assets definitions
     * @param address
     * @returns {Observable<AssetDefinition[]>}
     */
    fromAddress(address: Address): Observable<AssetTransferable[]>;
}
