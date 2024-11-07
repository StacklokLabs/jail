"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRON_BIP39_PATH_INDEX_0 = exports.TRON_BIP39_PATH_PREFIX = exports.ADDRESS_PREFIX_REGEX = exports.ADDRESS_PREFIX_BYTE = exports.ADDRESS_PREFIX = exports.ADDRESS_SIZE = void 0;
exports.fromHex = fromHex;
exports.toHex = toHex;
exports.toChecksumAddress = toChecksumAddress;
exports.isChecksumAddress = isChecksumAddress;
exports.fromPrivateKey = fromPrivateKey;
exports.isAddress = isAddress;
const code_js_1 = require("./code.js");
const crypto_js_1 = require("./crypto.js");
const validations_js_1 = require("./validations.js");
const ethersUtils_js_1 = require("./ethersUtils.js");
exports.ADDRESS_SIZE = 34;
exports.ADDRESS_PREFIX = '41';
exports.ADDRESS_PREFIX_BYTE = 0x41;
exports.ADDRESS_PREFIX_REGEX = /^(41)/;
exports.TRON_BIP39_PATH_PREFIX = "m/44'/195'";
exports.TRON_BIP39_PATH_INDEX_0 = exports.TRON_BIP39_PATH_PREFIX + "/0'/0/0";
function fromHex(address) {
    if (!(0, validations_js_1.isHex)(address))
        return address;
    return (0, crypto_js_1.getBase58CheckAddress)((0, code_js_1.hexStr2byteArray)(address.replace(/^0x/, exports.ADDRESS_PREFIX)));
}
function toHex(address) {
    if ((0, validations_js_1.isHex)(address))
        return address.toLowerCase().replace(/^0x/, exports.ADDRESS_PREFIX);
    return (0, code_js_1.byteArray2hexStr)((0, crypto_js_1.decodeBase58Address)(address)).toLowerCase();
}
function getChecksumAddress(address) {
    address = address.toLowerCase();
    const chars = address.substring(2).split('');
    const expanded = new Uint8Array(40);
    for (let i = 0; i < 40; i++) {
        expanded[i] = chars[i].charCodeAt(0);
    }
    const hashed = (0, code_js_1.hexStr2byteArray)((0, ethersUtils_js_1.keccak256)(expanded).slice(2));
    for (let i = 0; i < 40; i += 2) {
        if ((hashed[i >> 1] >> 4) >= 8) {
            chars[i] = chars[i].toUpperCase();
        }
        if ((hashed[i >> 1] & 0x0f) >= 8) {
            chars[i + 1] = chars[i + 1].toUpperCase();
        }
    }
    return exports.ADDRESS_PREFIX + chars.join('');
}
function toChecksumAddress(address) {
    if (!isAddress(address))
        throw new Error(`'${address}' is not a valid address string`);
    return getChecksumAddress(toHex(address));
}
function isChecksumAddress(address) {
    if (!(0, validations_js_1.isHex)(address) || address.length !== 42)
        return false;
    try {
        return toChecksumAddress(address) === address;
    }
    catch {
        return false;
    }
}
function fromPrivateKey(privateKey, strict = false) {
    try {
        return (0, crypto_js_1.pkToAddress)(privateKey, strict);
    }
    catch {
        return false;
    }
}
function isAddress(address) {
    if (!address || !(0, validations_js_1.isString)(address))
        return false;
    // Convert HEX to Base58
    if (address.length === 42) {
        try {
            // it throws an error if the address starts with 0x
            return isAddress((0, crypto_js_1.getBase58CheckAddress)((0, code_js_1.hexStr2byteArray)(address)));
        }
        catch (err) {
            return false;
        }
    }
    try {
        return (0, crypto_js_1.isAddressValid)(address);
    }
    catch (err) {
        return false;
    }
}
//# sourceMappingURL=address.js.map