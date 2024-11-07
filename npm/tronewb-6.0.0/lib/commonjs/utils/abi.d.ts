import { FunctionFragment, AbiInputsType } from '../types/ABI.js';
export declare function decodeParams(names: string[], types: string[], output: string, ignoreMethodHash?: boolean): any;
export declare function encodeParams(types: string[], values: any[]): string;
export declare function encodeParamsV2ByABI(funABI: FunctionFragment, args: any[]): string;
export declare function decodeParamsV2ByABI(funABI: FunctionFragment | AbiInputsType, data: string | Uint8Array): any[];
