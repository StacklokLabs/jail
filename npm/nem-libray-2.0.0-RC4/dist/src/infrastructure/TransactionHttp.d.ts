import { Observable } from "rxjs";
import { NemAnnounceResult } from "../models/transaction/NemAnnounceResult";
import { SignedTransaction } from "../models/transaction/SignedTransaction";
import { Transaction } from "../models/transaction/Transaction";
import { HttpEndpoint, ServerConfig } from "./HttpEndpoint";
export declare class TransactionHttp extends HttpEndpoint {
    constructor(nodes?: ServerConfig[]);
    /**
     * Send the signed transaction
     * @param transaction
     * @returns Observable<NemAnnounceSuccessResult>
     */
    announceTransaction(transaction: SignedTransaction): Observable<NemAnnounceResult>;
    /**
     * Receive a transaction by its hash
     * @param {string} hash - transaction hash
     * @returns Observable<Transaction>
     */
    getByHash(hash: string): Observable<Transaction>;
}
