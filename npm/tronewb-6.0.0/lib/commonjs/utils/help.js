"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexStringToBase58 = hexStringToBase58;
exports.base58ToHexString = base58ToHexString;
exports.hexStringToUtf8 = hexStringToUtf8;
exports.stringUtf8tHex = stringUtf8tHex;
exports.address2HexString = address2HexString;
exports.hexString2Address = hexString2Address;
exports.hexString2Utf8 = hexString2Utf8;
exports.stringUtf8toHex = stringUtf8toHex;
const code_js_1 = require("./code.js");
const address_js_1 = require("./address.js");
const crypto_js_1 = require("./crypto.js");
const bytes_js_1 = require("./bytes.js");
function hexStringToBase58(sHexString) {
    if (sHexString.length < 2 || (sHexString.length & 1) != 0)
        return '';
    const bytes = (0, code_js_1.hexStr2byteArray)(sHexString);
    return (0, crypto_js_1.getBase58CheckAddress)(bytes);
}
function base58ToHexString(sBase58) {
    const bytes = (0, crypto_js_1.decodeBase58Address)(sBase58);
    if (!bytes)
        return '';
    return (0, bytes_js_1.byteArray2hexStr)(bytes);
}
function hexStringToUtf8(hex) {
    const arr = hex.split('');
    let out = '';
    for (let i = 0; i < arr.length / 2; i++) {
        const tmp = `0x${arr[i * 2]}${arr[i * 2 + 1]}`;
        const charValue = String.fromCharCode(parseInt(tmp));
        out += charValue;
    }
    return out;
}
function stringUtf8tHex(str) {
    let val = '';
    for (let i = 0; i < str.length; i++) {
        if (val == '')
            val = str.charCodeAt(i).toString(16);
        else
            val += str.charCodeAt(i).toString(16);
    }
    return val;
}
function address2HexString(sHexAddress) {
    if (sHexAddress.length == 42 && sHexAddress.indexOf(address_js_1.ADDRESS_PREFIX) == 0)
        return sHexAddress;
    return base58ToHexString(sHexAddress);
}
function hexString2Address(sAddress) {
    return hexStringToBase58(sAddress);
}
function hexString2Utf8(sHexString) {
    return hexStringToUtf8(sHexString);
}
function stringUtf8toHex(sUtf8) {
    return stringUtf8tHex(sUtf8);
}
//# sourceMappingURL=help.js.map