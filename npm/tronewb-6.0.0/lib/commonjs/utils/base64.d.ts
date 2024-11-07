import type { BytesLike } from '../types/UtilsTypes.js';
export declare class Base64 {
    encode(input: string): string;
    encodeIgnoreUtf8(inputBytes: BytesLike): string;
    decode(input: string): string;
    decodeToByteArray(input: string): number[];
    _out2ByteArray(utftext: string): number[];
    _utf8_encode(string: string): string;
    _utf8_decode(utftext: string): string;
}
