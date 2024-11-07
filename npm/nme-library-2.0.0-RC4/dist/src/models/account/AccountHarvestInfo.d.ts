/**
 * A HarvestInfo object contains information about a block that an account harvested.
 */
export declare class AccountHarvestInfo {
    /**
     * The number of seconds elapsed since the creation of the nemesis block.
     */
    readonly timeStamp: number;
    /**
     * The database id for the harvested block.
     */
    readonly id: number;
    /**
     * The block difficulty. The initial difficulty was set to 100000000000000. The block difficulty is always between one tenth and ten times the initial difficulty.
     */
    readonly difficulty: number;
    /**
     * The total fee collected by harvesting the block.
     */
    readonly totalFee: number;
    /**
     * The height of the harvested block.
     */
    readonly height: number;
}
