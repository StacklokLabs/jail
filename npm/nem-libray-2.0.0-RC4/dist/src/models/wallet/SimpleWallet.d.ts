import { Account } from "../account/Account";
import { EncryptedPrivateKey } from "./EncryptedPrivateKey";
import { Password } from "./Password";
import { Wallet } from "./Wallet";
/**
 * Simple wallet model generates a private key from a PRNG
 */
export declare class SimpleWallet extends Wallet {
    /**
     * The encripted private key and information to decrypt it
     */
    readonly encryptedPrivateKey: EncryptedPrivateKey;
    /**
     * Create a SimpleWallet
     * @param name
     * @param password
     * @returns {SimpleWallet}
     */
    static create(name: string, password: Password): SimpleWallet;
    /**
     * Create a SimpleWallet from private key
     * @param name
     * @param password
     * @param privateKey
     * @returns {SimpleWallet}
     */
    static createWithPrivateKey(name: string, password: Password, privateKey: string): SimpleWallet;
    /**
     * Open a wallet and generate an Account
     * @param password
     * @returns {Account}
     */
    open(password: Password): Account;
    unlockPrivateKey(password: Password): string;
    /**
     * Converts SimpleWallet into writable string to persist into a file
     * @returns {string}
     */
    writeWLTFile(): string;
    /**
     * Reads the WLT content and converts it into a SimpleWallet
     * @param {string} wlt
     * @returns {SimpleWallet}
     */
    static readFromWLT(wlt: string): SimpleWallet;
    static readFromNanoWalletWLF(wlt: string): SimpleWallet;
}
