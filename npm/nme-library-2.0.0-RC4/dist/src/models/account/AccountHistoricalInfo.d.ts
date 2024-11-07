import { Address } from "./Address";
import { Balance } from "./Balance";
/**
 *
 * Nodes can support a feature for retrieving historical data of accounts.
 * If this is supported, it returns an array of AccountHistoricalInfo
 */
export declare class AccountHistoricalInfo {
    /**
     * The balance of the account in micro NEM.
     */
    readonly balance: Balance;
    /**
     * The importance of the account.
     */
    readonly importance: number;
    /**
     * The public key of the account.
     */
    readonly address: Address;
    /**
     * The page rank part of the importance.
     */
    readonly pageRank: number;
}
