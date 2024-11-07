import { keccak256, sha256, toUtf8Bytes, toUtf8String, recoverAddress, SigningKey, AbiCoder, Signature, concat, id, Mnemonic, Wordlist, wordlists, HDNodeWallet as ethersHDNodeWallet } from 'ethers';
import type { BytesLike, SignatureLike } from 'ethers';
import { Interface } from './interface.js';
declare const splitSignature: (sigBytes: SignatureLike) => Signature;
declare const joinSignature: (splitSig: SignatureLike) => string;
declare const arrayify: (value: BytesLike) => Uint8Array;
declare const FormatTypes: {
    sighash: string;
    minimal: string;
    full: string;
    json: string;
};
declare const isValidMnemonic: typeof Mnemonic.isValidMnemonic;
export { keccak256, sha256, toUtf8Bytes, toUtf8String, recoverAddress, Signature, SigningKey, AbiCoder, Interface, FormatTypes, splitSignature, joinSignature, arrayify, ethersHDNodeWallet, concat, id, Mnemonic, Wordlist, wordlists, isValidMnemonic, };
