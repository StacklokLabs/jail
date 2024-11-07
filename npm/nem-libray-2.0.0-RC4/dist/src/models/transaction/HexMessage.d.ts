import { Message } from "./Message";
export declare class HexMessage extends Message {
    /**
     * Create new constructor
     * @param message
     */
    static create(message: string): HexMessage;
    isEncrypted(): boolean;
    isPlain(): boolean;
}
