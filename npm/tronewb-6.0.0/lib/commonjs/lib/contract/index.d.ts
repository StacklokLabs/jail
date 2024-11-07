import { TronWeb } from '../../tronweb.js';
import { Method } from './method.js';
import type { ContractAbiInterface } from '../../types/ABI.js';
import { Address } from '../../types/Trx.js';
import { CreateSmartContractOptions } from '../../types/TransactionBuilder.js';
export declare class Contract {
    tronWeb: TronWeb;
    abi: ContractAbiInterface;
    address: false | string;
    eventListener: any;
    bytecode?: false | string;
    deployed?: boolean;
    lastBlock?: false | number;
    methods: Record<string | number | symbol, (...args: any) => ReturnType<Method['onMethod']>>;
    methodInstances: Record<string | number | symbol, Method>;
    props: any[];
    [key: string | number | symbol]: any;
    constructor(tronWeb: TronWeb, abi: ContractAbiInterface | undefined, address: Address);
    hasProperty(property: number | string | symbol): any;
    loadAbi(abi: ContractAbiInterface): void;
    decodeInput(data: string): {
        name: string;
        params: any[];
    };
    new(options: CreateSmartContractOptions, privateKey?: string | false): Promise<this>;
    at(contractAddress: Address): Promise<this>;
}
export type { CallOptions, SendOptions, AbiFragmentNoErrConstructor } from './method.js';
export { Method } from './method.js';
