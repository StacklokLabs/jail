import { LocalDateTime } from "js-joda";
import { Account } from "../account/Account";
import { Address } from "../account/Address";
import { NetworkTypes } from "../node/NetworkTypes";
import { Password } from "./Password";
export declare enum WalletType {
    SIMPLE = 0,
    BRAIN = 1,
}
/**
 * Wallet base model
 */
export declare abstract class Wallet {
    /**
     * The wallet's name
     */
    readonly name: string;
    /**
     * The wallet's network
     */
    readonly network: NetworkTypes;
    /**
     * The wallet's address
     */
    readonly address: Address;
    /**
     * The wallet's creation date
     */
    readonly creationDate: LocalDateTime;
    /**
     * Wallet schema number
     */
    readonly schema: number;
    /**
     * Abstract open wallet method returning an account from current wallet.
     * @param password
     */
    abstract open(password: Password): Account;
    /**
     * Receives the Private Key for the Wallet
     * @param {Password} password
     * @returns {string}
     */
    abstract unlockPrivateKey(password: Password): string;
    /**
     * Given a WLT string, retusn the WalletType
     * @param {string} wlt
     * @returns {WalletType}
     */
    static walletTypeGivenWLT(wlt: string): WalletType;
}
