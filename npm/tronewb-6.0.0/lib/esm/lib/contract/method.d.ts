import { TronWeb } from '../../tronweb.js';
import { Contract } from './index.js';
export interface CallOptions {
    feeLimit?: number;
    callValue?: number;
    callTokenValue?: number;
    callTokenId?: number;
    userFeePercentage?: number;
    shouldPollResponse?: boolean;
    from?: string | false;
    rawParameter?: string;
    _isConstant?: true;
}
export interface SendOptions {
    from?: string | false;
    feeLimit?: number;
    callValue?: number;
    rawParameter?: string;
    userFeePercentage?: number;
    shouldPollResponse?: boolean;
    pollTimes?: number;
    rawResponse?: boolean;
    keepTxID?: boolean;
}
import type { FunctionFragment, FallbackFragment, ReceiveFragment, EventFragment, AbiInputsType, AbiOutputsType } from '../../types/ABI.js';
export type AbiFragmentNoErrConstructor = FunctionFragment | EventFragment | FallbackFragment | ReceiveFragment;
export declare class Method {
    tronWeb: TronWeb;
    contract: Contract;
    abi: AbiFragmentNoErrConstructor;
    name: string;
    inputs: AbiInputsType;
    outputs: AbiOutputsType;
    functionSelector: string | null;
    signature: string;
    defaultOptions: {
        feeLimit: number;
        callValue: number;
        userFeePercentage: number;
        shouldPollResponse: boolean;
    };
    constructor(contract: Contract, abi: AbiFragmentNoErrConstructor);
    decodeInput(data: string): any[];
    onMethod(...args: any[]): {
        call: (options?: CallOptions) => Promise<any[]>;
        send: (options?: SendOptions, privateKey?: string | false) => Promise<any>;
    };
    _call(types: [], args: [], options?: CallOptions): Promise<any[]>;
    _send(types: [], args: [], options?: SendOptions, privateKey?: string | false): Promise<any>;
}
