export declare const npm: string;
export declare function setVersion(v: string): void;
export declare function buildTypescript({ workingDir, watch, production, silence }: {
    workingDir: string;
    watch: boolean;
    production: boolean;
    silence?: boolean;
}): Promise<void>;
export declare function getLatestVersion(name: string): Promise<string>;
export declare function getInstalledVersion(workingDir: string, name: string): Promise<string>;
export declare function getOutdatedEcs(workingDir: string): Promise<{
    package: string;
    installedVersion: string;
    latestVersion: string;
} | undefined>;
export declare function getCLIPackageJson<T = any>(): Promise<T>;
export declare function getInstalledCLIVersion(): string;
export declare function isStableVersion(): boolean;
export declare function isCLIOutdated(): Promise<boolean>;
export declare function isOnline(): Promise<boolean>;
export declare function isECSVersionLower(workingDir: string, version: string): Promise<boolean>;
//# sourceMappingURL=moduleHelpers.d.ts.map