import { Account } from "../account/Account";
import { BrainPassword } from "./BrainPassword";
import { Password } from "./Password";
import { Wallet } from "./Wallet";
/**
 * Brain wallet derived the private key from the brainPassword, hashing the brainPassword multiple times, therefore it's crucial to select a SAFE brainPassword.
 */
export declare class BrainWallet extends Wallet {
    /**
     * Create a BrainWallet
     * @param name
     * @param password
     * @returns {BrainWallet}
     */
    static create(name: string, password: BrainPassword): BrainWallet;
    /**
     * Open a wallet and generate an Account
     * @param password
     * @returns {Account}
     */
    open(password: BrainPassword): Account;
    unlockPrivateKey(password: Password): string;
    /**
     * Converts BrainWallet into writable string to persist into a file
     * @returns {string}
     */
    writeWLTFile(): string;
    /**
     * Reads the WLT content and converts it into a BrainWallet
     * @param {string} wlt
     * @returns {BrainWallet}
     */
    static readFromWLT(wlt: string): BrainWallet;
}
