import type { TypedDataDomain, TypedDataField } from 'ethers';
import { SignedTransaction } from '../types/Transaction.js';
import type { BytesLike } from '../types/UtilsTypes.js';
export declare function getBase58CheckAddress(addressBytes: number[]): string;
export declare function decodeBase58Address(base58Sting: string): false | number[];
export declare function signTransaction(priKeyBytes: string | BytesLike, transaction: any): SignedTransaction;
export declare function ecRecover(signedData: string, signature: string): string;
export declare function arrayToBase64String(a: number[]): string;
export declare function signBytes(privateKey: string | BytesLike, contents: BytesLike): string;
export declare function _signTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>, privateKey: string): string;
export declare function getRowBytesFromTransactionBase64(base64Data: string): Uint8Array;
export declare function genPriKey(): number[];
export declare function computeAddress(pubBytes: BytesLike): number[];
export declare function getAddressFromPriKey(priKeyBytes: BytesLike): number[];
export declare function decode58Check(addressStr: string): false | number[];
export declare function isAddressValid(base58Str: string): boolean;
export declare function getBase58CheckAddressFromPriKeyBase64String(priKeyBase64String: string): string;
export declare function getHexStrAddressFromPriKeyBase64String(priKeyBase64String: string): string;
export declare function getAddressFromPriKeyBase64String(priKeyBase64String: string): string;
export declare function getPubKeyFromPriKey(priKeyBytes: BytesLike): number[];
export declare function ECKeySign(hashBytes: BytesLike, priKeyBytes: BytesLike): string;
export declare function SHA256(msgBytes: BytesLike): number[];
export declare function passwordToAddress(password: string): string;
export declare function pkToAddress(privateKey: string, strict?: boolean): string;
export declare function sha3(string: string, prefix?: boolean): string;