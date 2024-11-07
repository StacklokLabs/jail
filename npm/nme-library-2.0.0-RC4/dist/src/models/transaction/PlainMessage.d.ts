import { Message } from "./Message";
/**
 * Plain Message model
 */
export declare class PlainMessage extends Message {
    /**
     * Create new constructor
     * @returns {boolean}
     */
    static create(message: string): PlainMessage;
    isEncrypted(): boolean;
    isPlain(): boolean;
    /**
     * Message string
     * @returns {string}
     */
    plain(): string;
}
export declare const EmptyMessage: PlainMessage;
