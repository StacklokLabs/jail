/// <reference types="node" />
import { ethers } from 'ethers';
import { Oracle } from './generated/Oracle';
import { LinkToken } from './generated/LinkToken';
import { EmptyOracle } from './generated/EmptyOracle';
export interface Roles {
    defaultAccount: ethers.Wallet;
    oracleNode: ethers.Wallet;
    oracleNode1: ethers.Wallet;
    oracleNode2: ethers.Wallet;
    oracleNode3: ethers.Wallet;
    stranger: ethers.Wallet;
    consumer: ethers.Wallet;
}
export interface Personas {
    Default: ethers.Wallet;
    Neil: ethers.Wallet;
    Ned: ethers.Wallet;
    Nelly: ethers.Wallet;
    Carol: ethers.Wallet;
    Eddy: ethers.Wallet;
}
interface RolesAndPersonas {
    roles: Roles;
    personas: Personas;
}
export interface ServiceAgreement {
    payment: ethers.utils.BigNumberish;
    expiration: ethers.utils.BigNumberish;
    endAt: ethers.utils.BigNumberish;
    oracles: string[];
    requestDigest: string;
    aggregator: string;
    aggInitiateJobSelector: string;
    aggFulfillSelector: string;
}
export interface OracleSignatures {
    vs: ethers.utils.BigNumberish[];
    rs: string[];
    ss: string[];
}
/**
 * This helper function allows us to make use of ganache snapshots,
 * which allows us to snapshot one state instance and revert back to it.
 *
 * This is used to memoize expensive setup calls typically found in beforeEach hooks when we
 * need to setup our state with contract deployments before running assertions.
 *
 * @param provider The provider that's used within the tests
 * @param cb The callback to execute that generates the state we want to snapshot
 */
export declare function useSnapshot(provider: ethers.providers.JsonRpcProvider, cb: () => Promise<void>): () => Promise<void>;
/**
 * A wrapper function to make generated contracts compatible with truffle test suites.
 *
 * Note that the returned contract is an instance of ethers.Contract, not a @truffle/contract, so there are slight
 * api differences, though largely the same.
 *
 * @see https://docs.ethers.io/ethers.js/html/api-contract.html
 * @param contractFactory The ethers based contract factory to interop with
 * @param address The address to supply as the signer
 */
export declare function create<T extends new (...args: any[]) => any>(contractFactory: T, address: string): InstanceType<T>;
/**
 * Generate roles and personas for tests along with their corrolated account addresses
 */
export declare function initializeRolesAndPersonas(provider: ethers.providers.JsonRpcProvider): Promise<RolesAndPersonas>;
declare type AsyncFunction = () => Promise<void>;
export declare function assertActionThrows(action: AsyncFunction): Promise<void>;
export declare function checkPublicABI(contract: ethers.Contract | ethers.ContractFactory, expectedPublic: string[]): void;
export declare const utils: typeof ethers.utils;
/**
 * Convert a value to a hex string
 * @param args Value to convert to a hex string
 */
export declare function toHex(...args: Parameters<typeof utils.hexlify>): ReturnType<typeof utils.hexlify>;
/**
 * Convert an Ether value to a wei amount
 * @param args Ether value to convert to an Ether amount
 */
export declare function toWei(...args: Parameters<typeof utils.parseEther>): ReturnType<typeof utils.parseEther>;
export declare function decodeRunRequest(log?: ethers.providers.Log): RunRequest;
/**
 * Decode a log into a run
 * @param log The log to decode
 * @todo Do we really need this?
 */
export declare function decodeRunABI(log: ethers.providers.Log): [string, string, string, string];
/**
 * Decodes a CBOR hex string, and adds opening and closing brackets to the CBOR if they are not present.
 *
 * @param hexstr The hex string to decode
 */
export declare function decodeDietCBOR(hexstr: string): any;
export interface RunRequest {
    callbackAddr: string;
    callbackFunc: string;
    data: Buffer;
    dataVersion: number;
    expiration: string;
    id: string;
    jobId: string;
    payment: string;
    requester: string;
    topic: string;
}
/**
 * Add a hex prefix to a hex string
 * @param hex The hex string to prepend the hex prefix to
 */
export declare function addHexPrefix(hex: string): string;
export declare function stripHexPrefix(hex: string): string;
/**
 * Convert a number value to bytes32 format
 *
 * @param num The number value to convert to bytes32 format
 */
export declare function numToBytes32(num: Parameters<typeof ethers.utils.hexlify>[0]): string;
export declare function toUtf8(...args: Parameters<typeof ethers.utils.toUtf8Bytes>): ReturnType<typeof ethers.utils.toUtf8Bytes>;
/**
 * Compute the keccak256 cryptographic hash of a value, returned as a hex string.
 * (Note: often Ethereum documentation refers to this, incorrectly, as SHA3)
 * @param args The data to compute the keccak256 hash of
 */
export declare function keccak(...args: Parameters<typeof ethers.utils.keccak256>): ReturnType<typeof ethers.utils.keccak256>;
declare type TxOptions = Omit<ethers.providers.TransactionRequest, 'to' | 'from'>;
export declare function fulfillOracleRequest(oracleContract: Oracle | EmptyOracle, runRequest: RunRequest, response: string, options?: TxOptions): ReturnType<typeof oracleContract.fulfillOracleRequest>;
export declare function cancelOracleRequest(oracleContract: Oracle | EmptyOracle, request: RunRequest, options?: TxOptions): ReturnType<typeof oracleContract.cancelOracleRequest>;
export declare function requestDataBytes(specId: string, to: string, fHash: string, nonce: number, dataBytes: string): string;
export declare function requestDataFrom(oc: Oracle, link: LinkToken, amount: ethers.utils.BigNumberish, args: string, options?: Omit<ethers.providers.TransactionRequest, 'to' | 'from'>): ReturnType<typeof link.transferAndCall>;
export declare function increaseTime5Minutes(provider: ethers.providers.JsonRpcProvider): Promise<void>;
/**
 * Convert a buffer to a hex string
 * @param hexstr The hex string to convert to a buffer
 */
export declare function hexToBuf(hexstr: string): Buffer;
declare type Hash = ReturnType<typeof ethers.utils.keccak256>;
export declare function encodeServiceAgreement(sa: ServiceAgreement): string;
export declare function encodeOracleSignatures(os: OracleSignatures): string;
/**
 * Digest of the ServiceAgreement.
 */
export declare function generateSAID(sa: ServiceAgreement): Hash;
export {};
