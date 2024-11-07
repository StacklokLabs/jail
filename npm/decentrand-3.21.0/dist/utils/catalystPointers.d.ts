import { Entity } from '@dcl/schemas';
export declare type DAOCatalyst = {
    baseUrl: string;
    owner: string;
    id: string;
};
declare type CatalystInfo = {
    url: string;
    timestamp: number;
    entityId: string;
};
export declare type Network = 'mainnet' | 'sepolia';
export declare function daoCatalysts(network?: Network): Promise<Array<DAOCatalyst>>;
export declare function fetchEntityByPointer(baseUrl: string, pointers: string[]): Promise<{
    baseUrl: string;
    deployments: Entity[];
}>;
export declare function getPointers(pointer: string, network?: Network): Promise<CatalystInfo[]>;
export {};
//# sourceMappingURL=catalystPointers.d.ts.map