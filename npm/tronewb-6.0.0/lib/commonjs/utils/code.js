"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64EncodeToString = exports.base64DecodeFromString = exports.byteArray2hexStr = exports.hextoString = exports.bytesToString = exports.byte2hexStr = void 0;
exports.bin2String = bin2String;
exports.arrayEquals = arrayEquals;
exports.stringToBytes = stringToBytes;
exports.hexChar2byte = hexChar2byte;
exports.isHexChar = isHexChar;
exports.hexStr2byteArray = hexStr2byteArray;
exports.strToDate = strToDate;
exports.isNumber = isNumber;
exports.getStringType = getStringType;
const bytes_js_1 = require("./bytes.js");
Object.defineProperty(exports, "byte2hexStr", { enumerable: true, get: function () { return bytes_js_1.byte2hexStr; } });
Object.defineProperty(exports, "bytesToString", { enumerable: true, get: function () { return bytes_js_1.bytesToString; } });
Object.defineProperty(exports, "hextoString", { enumerable: true, get: function () { return bytes_js_1.hextoString; } });
Object.defineProperty(exports, "byteArray2hexStr", { enumerable: true, get: function () { return bytes_js_1.byteArray2hexStr; } });
Object.defineProperty(exports, "base64DecodeFromString", { enumerable: true, get: function () { return bytes_js_1.base64DecodeFromString; } });
Object.defineProperty(exports, "base64EncodeToString", { enumerable: true, get: function () { return bytes_js_1.base64EncodeToString; } });
function bin2String(array) {
    return (0, bytes_js_1.bytesToString)(array);
}
function arrayEquals(array1, array2, strict = false) {
    if (array1.length != array2.length)
        return false;
    for (let i = 0; i < array1.length; i++) {
        if (strict) {
            if (array1[i] != array2[i])
                return false;
        }
        else if (JSON.stringify(array1[i]) != JSON.stringify(array2[i]))
            return false;
    }
    return true;
}
function stringToBytes(str) {
    const bytes = [];
    const len = str.length;
    let c;
    for (let i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10ffff) {
            bytes.push(((c >> 18) & 0x07) | 0xf0);
            bytes.push(((c >> 12) & 0x3f) | 0x80);
            bytes.push(((c >> 6) & 0x3f) | 0x80);
            bytes.push((c & 0x3f) | 0x80);
        }
        else if (c >= 0x000800 && c <= 0x00ffff) {
            bytes.push(((c >> 12) & 0x0f) | 0xe0);
            bytes.push(((c >> 6) & 0x3f) | 0x80);
            bytes.push((c & 0x3f) | 0x80);
        }
        else if (c >= 0x000080 && c <= 0x0007ff) {
            bytes.push(((c >> 6) & 0x1f) | 0xc0);
            bytes.push((c & 0x3f) | 0x80);
        }
        else
            bytes.push(c & 0xff);
    }
    return bytes;
}
function hexChar2byte(c) {
    let d;
    if (c >= 'A' && c <= 'F')
        d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    else if (c >= 'a' && c <= 'f')
        d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
    else if (c >= '0' && c <= '9')
        d = c.charCodeAt(0) - '0'.charCodeAt(0);
    if (typeof d === 'number')
        return d;
    else
        throw new Error('The passed hex char is not a valid hex char');
}
function isHexChar(c) {
    if ((c >= 'A' && c <= 'F') || (c >= 'a' && c <= 'f') || (c >= '0' && c <= '9')) {
        return 1;
    }
    return 0;
}
// set strict as true: if the length of str is odd, add 0 before the str to make its length as even
function hexStr2byteArray(str, strict = false) {
    let len = str.length;
    if (strict) {
        if (len % 2) {
            str = `0${str}`;
            len++;
        }
    }
    const byteArray = [];
    let d = 0;
    let j = 0;
    let k = 0;
    for (let i = 0; i < len; i++) {
        const c = str.charAt(i);
        if (isHexChar(c)) {
            d <<= 4;
            d += hexChar2byte(c);
            j++;
            if (0 === j % 2) {
                byteArray[k++] = d;
                d = 0;
            }
        }
        else
            throw new Error('The passed hex char is not a valid hex string');
    }
    return byteArray;
}
//yyyy-MM-DD HH-mm-ss
function strToDate(str) {
    if (!/^\d{4}-\d{2}-\d{2}( \d{2}-\d{2}-\d{2}|)/.test(str))
        throw new Error('The passed date string is not valid');
    const tempStrs = str.split(' ');
    const dateStrs = tempStrs[0].split('-');
    const year = parseInt(dateStrs[0], 10);
    const month = parseInt(dateStrs[1], 10) - 1;
    const day = parseInt(dateStrs[2], 10);
    if (tempStrs.length > 1) {
        const timeStrs = tempStrs[1].split('-');
        const hour = parseInt(timeStrs[0], 10);
        const minute = parseInt(timeStrs[1], 10);
        const second = parseInt(timeStrs[2], 10);
        return new Date(year, month, day, hour, minute, second);
    }
    return new Date(year, month, day);
}
function isNumber(c) {
    if (c >= '0' && c <= '9')
        return 1;
    return 0;
}
//return 1: address  --- 20Bytes HexString
//return 2: blockNumber ------ Decimal number
//return 3: assetName ------ String
//return other: error
function getStringType(str) {
    if (null == str)
        return -1;
    if (str.length == 0 || str == '')
        return -1;
    let i = 0;
    if (str.length == 40) {
        for (; i < 40; i++) {
            const c = str.charAt(i);
            if (!isHexChar(c))
                break;
        }
    }
    if (i == 40)
        return 1; //40 Hex, Address
    for (i = 0; i < str.length; i++) {
        const c = str.charAt(i);
        if (!isNumber(c))
            break;
    }
    if (i == str.length)
        return 2; // All Decimal number, BlockNumber
    for (i = 0; i < str.length; i++) {
        const c = str.charAt(i);
        if (c > ' ')
            return 3; // At least one visible character
    }
    return -1;
}
//# sourceMappingURL=code.js.map