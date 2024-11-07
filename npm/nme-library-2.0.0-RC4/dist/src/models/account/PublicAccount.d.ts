import { Address } from "./Address";
/**
 * Public account model
 */
export declare class PublicAccount {
    readonly address: Address;
    readonly publicKey: string;
    /**
     * @returns {boolean}
     */
    hasPublicKey(): boolean;
    /**
     * Creates a new PublicAccount from a public key
     * @param publicKey
     * @returns {PublicAccount}
     */
    static createWithPublicKey(publicKey: string): PublicAccount;
    /**
     * verify message
     * @param signedMessage
     * @param signature
     * @returns true/false
     */
    verifySignedMessage(signedMessage: string, signature: string): any;
}
