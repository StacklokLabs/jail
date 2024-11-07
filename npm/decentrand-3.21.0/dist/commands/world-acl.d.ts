import { AuthChain } from '@dcl/schemas';
export declare function help(): string;
export declare function main(): Promise<void>;
export declare enum WorldPermissionType {
    Unrestricted = "unrestricted",
    AllowList = "allow-list"
}
export declare type AllowListPermissionSetting = {
    type: WorldPermissionType.AllowList;
    wallets: string[];
};
export declare type WorldPermissions = {
    deployment: AllowListPermissionSetting;
};
export declare type WorldPermissionsResponse = {
    permissions: WorldPermissions;
};
export declare const AUTH_CHAIN_HEADER_PREFIX = "x-identity-auth-chain-";
export declare const AUTH_TIMESTAMP_HEADER = "x-identity-timestamp";
export declare const AUTH_METADATA_HEADER = "x-identity-metadata";
export declare function getAuthHeaders(authChain: AuthChain, timestamp: string): Record<string, string>;
//# sourceMappingURL=world-acl.d.ts.map