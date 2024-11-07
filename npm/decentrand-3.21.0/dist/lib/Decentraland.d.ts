/// <reference types="node" />
import { Scene } from '@dcl/schemas';
import { EventEmitter } from 'events';
import { ContentService } from './content/ContentService';
import { Coords } from '../utils/coordinateHelpers';
import { DCLInfo } from '../config';
import { Ethereum, LANDData } from './Ethereum';
import { LinkerResponse } from './LinkerAPI';
import { IEthereumDataProvider } from './IEthereumDataProvider';
import { Workspace } from './Workspace';
import { IdentityType } from '@dcl/crypto';
export declare type DecentralandArguments = {
    workingDir: string;
    linkerPort?: number;
    previewPort?: number;
    isHttps?: boolean;
    watch?: boolean;
    blockchain?: boolean;
    config?: DCLInfo;
    forceDeploy?: boolean;
    yes?: boolean;
    skipValidations?: boolean;
};
export declare type AddressInfo = {
    parcels: ({
        x: number;
        y: number;
    } & LANDData)[];
    estates: ({
        id: number;
    } & LANDData)[];
};
export declare type Parcel = LANDData & {
    owner: string;
    operator?: string;
    updateOperator?: string;
};
export declare type Estate = Parcel & {
    parcels: Coords[];
};
export declare type ParcelMetadata = {
    scene: Scene;
    land: Parcel;
};
export declare type FileInfo = {
    name: string;
    cid: string;
};
export declare class Decentraland extends EventEmitter {
    workspace: Workspace;
    ethereum: Ethereum;
    options: DecentralandArguments;
    provider: IEthereumDataProvider;
    contentService: ContentService;
    environmentIdentity?: IdentityType;
    stop: () => Promise<void>;
    constructor(args?: DecentralandArguments);
    getWorkingDir(): string;
    getProjectHash(): string;
    link(rootCID: string): Promise<LinkerResponse>;
    preview(): Promise<void>;
    getAddressInfo(address: string): Promise<AddressInfo>;
    getWatch(): boolean;
    getParcelInfo(coords: Coords): Promise<ParcelMetadata>;
    getEstateInfo(estateId: number): Promise<Estate | undefined>;
    getEstateOfParcel(coords: Coords): Promise<Estate | undefined>;
    getParcelStatus(x: number, y: number): Promise<{
        cid: string;
        files: FileInfo[];
    }>;
    getAddressAndSignature(messageToSign: string): Promise<LinkerResponse>;
    private pipeEvents;
    private createWallet;
}
//# sourceMappingURL=Decentraland.d.ts.map