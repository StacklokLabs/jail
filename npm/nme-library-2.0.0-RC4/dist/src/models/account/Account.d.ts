import { NetworkTypes } from "../node/NetworkTypes";
import { EncryptedMessage } from "../transaction/EncryptedMessage";
import { PlainMessage } from "../transaction/PlainMessage";
import { SignedTransaction } from "../transaction/SignedTransaction";
import { Transaction } from "../transaction/Transaction";
import { PublicAccount } from "./PublicAccount";
/**
 * Account model
 */
export declare class Account extends PublicAccount {
    readonly privateKey: string;
    /**
     * Sign a transaction
     * @param transaction
     * @returns {{data: any, signature: string}}
     */
    signTransaction(transaction: Transaction): SignedTransaction;
    /**
     * Sign string
     * @param messagestring
     * @returns signatureString
     */
    signMessage(message: string): any;
    /**
     * constructor with private key
     * @param privateKey
     * @returns {Account}
     */
    static createWithPrivateKey(privateKey: string): Account;
    /**
     * generate new account
     * @param walletName
     * @param passphrase
     * @param networkType
     * @returns {Account}
     */
    static generateAccount(walletName: string, passphrase: string, networkType: NetworkTypes): Account;
    /**
     * Create a new encrypted Message
     * @param message
     * @param recipientPublicAccount
     * @returns {EncryptedMessage}
     */
    encryptMessage(message: string, recipientPublicAccount: PublicAccount): EncryptedMessage;
    /**
     * Decrypts an encrypted message
     * @param encryptedMessage
     * @param recipientPublicAccount
     * @returns {PlainMessage}
     */
    decryptMessage(encryptedMessage: EncryptedMessage, recipientPublicAccount: PublicAccount): PlainMessage;
}
