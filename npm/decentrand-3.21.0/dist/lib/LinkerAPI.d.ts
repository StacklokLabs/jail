/// <reference types="node" />
import { EventEmitter } from 'events';
import { ChainId } from '@dcl/schemas';
import { Project } from './Project';
export declare type LinkerResponse = {
    address: string;
    signature: string;
    chainId?: ChainId;
};
export declare class LinkerAPI extends EventEmitter {
    private project;
    private app;
    constructor(project: Project);
    link(port: number, isHttps: boolean, rootCID: string, skipValidations: boolean): Promise<unknown>;
    getSceneInfo(rootCID: string, skipValidations: boolean): Promise<{
        baseParcel: string;
        parcels: string[];
        rootCID: string;
        landRegistry: string | undefined;
        estateRegistry: string | undefined;
        debug: boolean;
        title: string | undefined;
        description: string | undefined;
        skipValidations: boolean;
    }>;
    private setRoutes;
}
//# sourceMappingURL=LinkerAPI.d.ts.map