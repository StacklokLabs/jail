import { Observable } from "rxjs";
import { Address } from "../models/account/Address";
import { Transaction } from "../models/transaction/Transaction";
import { Listener, WebSocketConfig } from "./Listener";
/**
 * UnconfirmedTransaction listener
 */
export declare class UnconfirmedTransactionListener extends Listener {
    /**
     * Constructor
     * @param nodes
     */
    constructor(nodes?: WebSocketConfig[]);
    /**
     * Start listening new unconfirmed transactions
     * @param address
     * @returns {Observable<Transaction>}
     */
    given(address: Address): Observable<Transaction>;
}
