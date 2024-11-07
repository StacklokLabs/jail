import { Message } from "./Message";
/**
 * Encrypted Message model
 */
export declare class EncryptedMessage extends Message {
    isEncrypted(): boolean;
    isPlain(): boolean;
}
