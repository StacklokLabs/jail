import { Mnemonic, Wordlist } from './ethersUtils.js';
export declare function generateAccount(): {
    privateKey: string;
    publicKey: string;
    address: {
        base58: string;
        hex: string;
    };
};
export declare function generateRandom(password?: string, path?: string, wordlist?: Wordlist): {
    mnemonic: Mnemonic | null;
    privateKey: string;
    publicKey: string;
    address: string;
    path: string | null;
};
export declare function generateAccountWithMnemonic(mnemonic: string, path?: string, password?: string | null | undefined, wordlist?: Wordlist | null): {
    mnemonic: Mnemonic | null;
    privateKey: string;
    publicKey: string;
    address: string;
};
