import { Balance } from "./Balance";
import { PublicAccount } from "./PublicAccount";
export declare enum RemoteStatus {
    REMOTE = "REMOTE",
    ACTIVATING = "ACTIVATING",
    ACTIVE = "ACTIVE",
    DEACTIVATING = "DEACTIVATING",
    INACTIVE = "INACTIVE",
}
export declare enum Status {
    UNKNOWN = "UNKNOWN",
    LOCKED = "LOCKED",
    UNLOCKED = "UNLOCKED",
}
/**
 * The account structure describes basic information for an account.
 */
export declare class AccountInfo {
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
    readonly publicAccount?: PublicAccount;
    /**
     * The number blocks that the account already harvested.
     */
    readonly harvestedBlocks: number;
    /**
     * Total number of cosignatories
     */
    readonly cosignatoriesCount?: number;
    /**
     * Minimum number of cosignatories needed for a transaction to be processed
     */
    readonly minCosignatories?: number;
}
export declare class AccountInfoWithMetaData extends AccountInfo {
    /**
     * The harvesting status of a queried account
     */
    readonly status: Status;
    /**
     * The status of remote harvesting of a queried account
     */
    readonly remoteStatus: RemoteStatus;
    /**
     * JSON array of AccountInfo structures. The account is cosignatory for each of the accounts in the array.
     */
    readonly cosignatoryOf: AccountInfo[];
    /**
     * JSON array of AccountInfo structures. The array holds all accounts that are a cosignatory for this account.
     */
    readonly cosignatories: AccountInfo[];
}
export declare class AccountStatus {
    /**
     * The harvesting status of a queried account
     */
    readonly status: Status;
    /**
     * The status of remote harvesting of a queried account
     */
    readonly remoteStatus: RemoteStatus;
    /**
     * JSON array of AccountInfo structures. The account is cosignatory for each of the accounts in the array.
     */
    readonly cosignatoryOf: AccountInfo[];
    /**
     * JSON array of AccountInfo structures. The array holds all accounts that are a cosignatory for this account.
     */
    readonly cosignatories: AccountInfo[];
}
