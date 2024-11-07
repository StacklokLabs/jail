import { Observable } from "rxjs";
import { AccountInfoWithMetaData } from "../models/account/AccountInfo";
import { Address } from "../models/account/Address";
import { Listener, WebSocketConfig } from "./Listener";
/**
 * Account listener
 */
export declare class AccountListener extends Listener {
    /**
     * Constructor
     * @param nodes
     */
    constructor(nodes?: WebSocketConfig[]);
    /**
     * Start listening updates
     * @param address
     * @returns {Observable<AccountInfoWithMetaData>}
     */
    given(address: Address): Observable<AccountInfoWithMetaData>;
}
