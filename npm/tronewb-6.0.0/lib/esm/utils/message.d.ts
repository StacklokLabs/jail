export declare const TRON_MESSAGE_PREFIX = "\u0019TRON Signed Message:\n";
export declare function hashMessage(message: string | Uint8Array | Array<number>): string;
export declare function signMessage(message: string | Uint8Array | Array<number>, privateKey: string): string;
export declare function verifyMessage(message: string | Uint8Array | Array<number>, signature: string): string;
