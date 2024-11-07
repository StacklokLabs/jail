import { Address } from "./Address";
/**
 * Each account is assigned an importance in the NEM network. The ability of an account to generate new blocks is proportional to its importance. The importance is a number between 0 and 1.
 */
export declare class AccountImportanceInfo {
    /**
     * The address of the account.
     */
    readonly address: Address;
    /**
     * Substructure that describes the importance of the account.
     */
    readonly importance: AccountImportanceData;
}
/**
 * Substructure that describes the importance of the account.
 */
export declare class AccountImportanceData {
    /**
     * Indicates if the fields "score", "ev" and "height" are available.isSet can have the values 0 or 1. In case isSet is 0 the fields are not available.
     */
    readonly isSet: number;
    /**
     * The importance of the account. The importance ranges between 0 and 1.
     */
    readonly score?: number;
    /**
     * The page rank portion of the importance. The page rank ranges between 0 and 1.
     */
    readonly ev?: number;
    /**
     * The height at which the importance calculation was performed.
     */
    readonly height?: number;
}
