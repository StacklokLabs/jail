import { NetworkTypes } from "./models/node/NetworkTypes";
export declare class NEMLibrary {
    private static networkType?;
    static bootstrap(networkType: NetworkTypes): void;
    /**
     *
     *
     */
    static reset(): void;
    /**
     *
     */
    static getNetworkType(): NetworkTypes;
    /**
     * Gets the current runtime environment (Node or Browser)
     */
    static getEnvironment(): Environment;
}
/**
 * Environment enumeration fer getEnvironment() call
 */
export declare enum Environment {
    Browser = 0,
    Node = 1,
}
