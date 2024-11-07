/// <reference types="node" />
import { EventEmitter } from 'events';
import { HTTPProvider, Contract } from 'eth-connect';
import { IEthereumDataProvider } from './IEthereumDataProvider';
import { Coords } from '../utils/coordinateHelpers';
import { DCLInfo } from '../config';
export declare const providerInstance: HTTPProvider;
declare type ContractData = Contract & Record<string, (...args: any) => Promise<unknown>>;
export declare type LANDData = {
    version?: number;
    name: string | null;
    description: string | null;
};
export declare type Network = {
    id: number;
    name: string;
    label?: string;
};
export declare enum NETWORKS {
    mainnet = "mainnet",
    sepolia = "sepolia"
}
/**
 * Events emitted by this class:
 *
 */
export declare class Ethereum extends EventEmitter implements IEthereumDataProvider {
    private static contracts;
    static getContract(name: keyof DCLInfo): Promise<ContractData>;
    getLandOf(address: string): Promise<Coords[]>;
    getEstatesOf(address: string): Promise<number[]>;
    getLandData({ x, y }: Coords): Promise<LANDData>;
    getEstateData(estateId: number): Promise<LANDData>;
    getLandOwner({ x, y }: Coords): Promise<string>;
    getLandOperator({ x, y }: Coords): Promise<string>;
    getLandUpdateOperator({ x, y }: Coords): Promise<string>;
    getEstateOwner(estateId: number): Promise<string>;
    getEstateOperator(estateId: number): Promise<string>;
    getEstateUpdateOperator(estateId: number): Promise<string>;
    validateAuthorization(owner: string, parcels: Coords[]): Promise<void[]>;
    /**
     * It fails if the owner address isn't able to update given parcel (as an owner or operator)
     */
    validateAuthorizationOfParcel(owner: string, parcel: Coords): Promise<void>;
    getLandOfEstate(estateId: number): Promise<Coords[]>;
    getEstateIdOfLand({ x, y }: Coords): Promise<number>;
    private isLandOperator;
    private isEstateOperator;
    private decodeLandData;
}
export {};
//# sourceMappingURL=Ethereum.d.ts.map