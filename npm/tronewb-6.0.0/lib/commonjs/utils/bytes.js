"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byte2hexStr = byte2hexStr;
exports.bytesToString = bytesToString;
exports.hextoString = hextoString;
exports.byteArray2hexStr = byteArray2hexStr;
exports.base64DecodeFromString = base64DecodeFromString;
exports.base64EncodeToString = base64EncodeToString;
const base64_js_1 = require("./base64.js");
function byte2hexStr(byte) {
    if (byte < 0 || byte > 255)
        throw new Error('Input must be a byte');
    const hexByteMap = '0123456789ABCDEF';
    let str = '';
    str += hexByteMap.charAt(byte >> 4);
    str += hexByteMap.charAt(byte & 0x0f);
    return str;
}
function bytesToString(arr) {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        const one = arr[i].toString(2);
        const v = one.match(/^1+?(?=0)/);
        if (v && one.length === 8) {
            const bytesLength = v[0].length;
            let store = arr[i].toString(2).slice(7 - bytesLength);
            for (let st = 1; st < bytesLength; st++)
                store += arr[st + i].toString(2).slice(2);
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        }
        else {
            str += String.fromCharCode(arr[i]);
        }
    }
    return str;
}
function hextoString(hex) {
    const arr = hex.replace(/^0x/, '').split('');
    let out = '';
    for (let i = 0; i < arr.length / 2; i++) {
        const tmp = `0x${arr[i * 2]}${arr[i * 2 + 1]}`;
        out += String.fromCharCode(parseInt(tmp));
    }
    return out;
}
function byteArray2hexStr(byteArray) {
    let str = '';
    for (let i = 0; i < byteArray.length; i++)
        str += byte2hexStr(byteArray[i]);
    return str;
}
function base64DecodeFromString(string64) {
    return new base64_js_1.Base64().decodeToByteArray(string64);
}
function base64EncodeToString(bytes) {
    const b = new base64_js_1.Base64();
    const string64 = b.encodeIgnoreUtf8(bytes);
    return string64;
}
//# sourceMappingURL=bytes.js.map