/**
 * Balance model
 */
export declare class Balance {
    /**
     * The balance of the account in micro NEM.
     */
    readonly balance: number;
    /**
     * The vested part of the balance of the account in micro NEM.
     */
    readonly vestedBalance: number;
    /**
     * The unvested part of the balance of the account in micro NEM.
     */
    readonly unvestedBalance: number;
}
