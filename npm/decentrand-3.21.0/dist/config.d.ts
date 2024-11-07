export declare type DCLInfo = {
    fileExists?: boolean;
    userId: string;
    trackStats: boolean;
    provider?: string;
    MANAToken?: string;
    LANDRegistry?: string;
    EstateRegistry?: string;
    catalystUrl?: string;
    dclApiUrl?: string;
    segmentKey?: string;
};
/**
 * Creates the `.dclinfo` file in the HOME directory
 */
export declare function createDCLInfo(dclInfo: DCLInfo): Promise<void>;
/**
 * Add new configuration to `.dclinfo` file
 */
export declare function writeDCLInfo(newInfo: DCLInfo): Promise<void>;
/**
 * Reads `.dclinfo` file and loads it in-memory to be sync-obtained with `getDCLInfo()` function
 */
export declare function loadConfig(network: string): Promise<DCLInfo>;
/**
 * Returns the contents of the `.dclinfo` file. It needs to be loaded first with `loadConfig()` function
 */
export declare function getDCLInfo(): DCLInfo;
export declare function getConfig(network?: string): DCLInfo;
export declare function getCustomConfig(): Partial<DCLInfo>;
//# sourceMappingURL=config.d.ts.map