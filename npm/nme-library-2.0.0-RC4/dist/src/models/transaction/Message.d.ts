/**
 * Message model
 */
export declare abstract class Message {
    /**
     * Message payload
     */
    readonly payload: string;
    abstract isEncrypted(): boolean;
    abstract isPlain(): boolean;
    isHexMessage(): boolean;
}
