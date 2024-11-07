"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBase58CheckAddress = getBase58CheckAddress;
exports.decodeBase58Address = decodeBase58Address;
exports.signTransaction = signTransaction;
exports.ecRecover = ecRecover;
exports.arrayToBase64String = arrayToBase64String;
exports.signBytes = signBytes;
exports._signTypedData = _signTypedData;
exports.getRowBytesFromTransactionBase64 = getRowBytesFromTransactionBase64;
exports.genPriKey = genPriKey;
exports.computeAddress = computeAddress;
exports.getAddressFromPriKey = getAddressFromPriKey;
exports.decode58Check = decode58Check;
exports.isAddressValid = isAddressValid;
exports.getBase58CheckAddressFromPriKeyBase64String = getBase58CheckAddressFromPriKeyBase64String;
exports.getHexStrAddressFromPriKeyBase64String = getHexStrAddressFromPriKeyBase64String;
exports.getAddressFromPriKeyBase64String = getAddressFromPriKeyBase64String;
exports.getPubKeyFromPriKey = getPubKeyFromPriKey;
exports.ECKeySign = ECKeySign;
exports.SHA256 = SHA256;
exports.passwordToAddress = passwordToAddress;
exports.pkToAddress = pkToAddress;
exports.sha3 = sha3;
const address_js_1 = require("./address.js");
const code_js_1 = require("./code.js");
const base58_js_1 = require("./base58.js");
const bytes_js_1 = require("./bytes.js");
const ethersUtils_js_1 = require("./ethersUtils.js");
const typedData_js_1 = require("./typedData.js");
const secp256k1_1 = require("ethereum-cryptography/secp256k1");
function normalizePrivateKeyBytes(priKeyBytes) {
    return (0, code_js_1.hexStr2byteArray)((0, bytes_js_1.byteArray2hexStr)(priKeyBytes).padStart(64, '0'));
}
function getBase58CheckAddress(addressBytes) {
    const hash0 = SHA256(addressBytes);
    const hash1 = SHA256(hash0);
    let checkSum = hash1.slice(0, 4);
    checkSum = addressBytes.concat(checkSum);
    return (0, base58_js_1.encode58)(checkSum);
}
function decodeBase58Address(base58Sting) {
    if (typeof base58Sting != 'string')
        return false;
    if (base58Sting.length <= 4)
        return false;
    let address = (0, base58_js_1.decode58)(base58Sting);
    if (base58Sting.length <= 4)
        return false;
    const len = address.length;
    const offset = len - 4;
    const checkSum = address.slice(offset);
    address = address.slice(0, offset);
    const hash0 = SHA256(address);
    const hash1 = SHA256(hash0);
    const checkSum1 = hash1.slice(0, 4);
    if (checkSum[0] == checkSum1[0] &&
        checkSum[1] == checkSum1[1] &&
        checkSum[2] == checkSum1[2] &&
        checkSum[3] == checkSum1[3]) {
        return address;
    }
    throw new Error('Invalid address provided');
}
// @TODO transaction type should be determined.
function signTransaction(priKeyBytes, transaction) {
    if (typeof priKeyBytes === 'string')
        priKeyBytes = (0, code_js_1.hexStr2byteArray)(priKeyBytes);
    const txID = transaction.txID;
    const signature = ECKeySign((0, code_js_1.hexStr2byteArray)(txID), priKeyBytes);
    if (Array.isArray(transaction.signature)) {
        if (!transaction.signature.includes(signature))
            transaction.signature.push(signature);
    }
    else
        transaction.signature = [signature];
    return transaction;
}
function ecRecover(signedData, signature) {
    signedData = '0x' + signedData.replace(/^0x/, '');
    signature = '0x' + signature.replace(/^0x/, '');
    const recovered = (0, ethersUtils_js_1.recoverAddress)((0, ethersUtils_js_1.arrayify)(signedData), ethersUtils_js_1.Signature.from(signature));
    const tronAddress = address_js_1.ADDRESS_PREFIX + recovered.substring(2);
    return tronAddress;
}
function arrayToBase64String(a) {
    return btoa(String.fromCharCode(...a));
}
function signBytes(privateKey, contents) {
    if (typeof privateKey === 'string')
        privateKey = (0, code_js_1.hexStr2byteArray)(privateKey);
    const hashBytes = SHA256(contents);
    const signBytes = ECKeySign(hashBytes, privateKey);
    return signBytes;
}
function _signTypedData(domain, types, value, privateKey) {
    const key = `0x${privateKey.replace(/^0x/, '')}`;
    const signingKey = new ethersUtils_js_1.SigningKey(key);
    const messageDigest = typedData_js_1.TypedDataEncoder.hash(domain, types, value);
    const signature = signingKey.sign(messageDigest);
    const signatureHex = ['0x', signature.r.substring(2), signature.s.substring(2), Number(signature.v).toString(16)].join('');
    return signatureHex;
}
function getRowBytesFromTransactionBase64(base64Data) {
    const bytesDecode = (0, code_js_1.base64DecodeFromString)(base64Data);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const transaction = globalThis.proto.protocol.Transaction.deserializeBinary(bytesDecode);
    const raw = transaction.getRawData();
    return raw.serializeBinary();
}
function genPriKey() {
    const priKey = secp256k1_1.secp256k1.utils.randomPrivateKey();
    let priKeyHex = (0, bytes_js_1.byteArray2hexStr)(priKey);
    priKeyHex = priKeyHex.padStart(64, '0');
    return (0, code_js_1.hexStr2byteArray)(priKeyHex);
}
function computeAddress(pubBytes) {
    if (pubBytes.length === 65)
        pubBytes = pubBytes.slice(1);
    const hash = (0, ethersUtils_js_1.keccak256)(new Uint8Array(pubBytes)).toString().substring(2);
    const addressHex = address_js_1.ADDRESS_PREFIX + hash.substring(24);
    return (0, code_js_1.hexStr2byteArray)(addressHex);
}
function getAddressFromPriKey(priKeyBytes) {
    const pubBytes = getPubKeyFromPriKey(priKeyBytes);
    return computeAddress(pubBytes);
}
function decode58Check(addressStr) {
    const decodeCheck = (0, base58_js_1.decode58)(addressStr);
    if (decodeCheck.length <= 4)
        return false;
    const decodeData = decodeCheck.slice(0, decodeCheck.length - 4);
    const hash0 = SHA256(decodeData);
    const hash1 = SHA256(hash0);
    if (hash1[0] === decodeCheck[decodeData.length] &&
        hash1[1] === decodeCheck[decodeData.length + 1] &&
        hash1[2] === decodeCheck[decodeData.length + 2] &&
        hash1[3] === decodeCheck[decodeData.length + 3]) {
        return decodeData;
    }
    return false;
}
function isAddressValid(base58Str) {
    if (typeof base58Str !== 'string')
        return false;
    if (base58Str.length !== address_js_1.ADDRESS_SIZE)
        return false;
    let address = (0, base58_js_1.decode58)(base58Str);
    if (address.length !== 25)
        return false;
    if (address[0] !== address_js_1.ADDRESS_PREFIX_BYTE)
        return false;
    const checkSum = address.slice(21);
    address = address.slice(0, 21);
    const hash0 = SHA256(address);
    const hash1 = SHA256(hash0);
    const checkSum1 = hash1.slice(0, 4);
    if (checkSum[0] == checkSum1[0] &&
        checkSum[1] == checkSum1[1] &&
        checkSum[2] == checkSum1[2] &&
        checkSum[3] == checkSum1[3]) {
        return true;
    }
    return false;
}
function getBase58CheckAddressFromPriKeyBase64String(priKeyBase64String) {
    const priKeyBytes = (0, code_js_1.base64DecodeFromString)(priKeyBase64String);
    const pubBytes = getPubKeyFromPriKey(priKeyBytes);
    const addressBytes = computeAddress(pubBytes);
    return getBase58CheckAddress(addressBytes);
}
function getHexStrAddressFromPriKeyBase64String(priKeyBase64String) {
    const priKeyBytes = (0, code_js_1.base64DecodeFromString)(priKeyBase64String);
    const pubBytes = getPubKeyFromPriKey(priKeyBytes);
    const addressBytes = computeAddress(pubBytes);
    const addressHex = (0, bytes_js_1.byteArray2hexStr)(addressBytes);
    return addressHex;
}
function getAddressFromPriKeyBase64String(priKeyBase64String) {
    const priKeyBytes = (0, code_js_1.base64DecodeFromString)(priKeyBase64String);
    const pubBytes = getPubKeyFromPriKey(priKeyBytes);
    const addressBytes = computeAddress(pubBytes);
    const addressBase64 = (0, code_js_1.base64EncodeToString)(addressBytes);
    return addressBase64;
}
function getPubKeyFromPriKey(priKeyBytes) {
    const pubkey = secp256k1_1.secp256k1.ProjectivePoint.fromPrivateKey(new Uint8Array(normalizePrivateKeyBytes(priKeyBytes)));
    const x = pubkey.x;
    const y = pubkey.y;
    const xHex = x.toString(16).padStart(64, '0');
    const yHex = y.toString(16).padStart(64, '0');
    const pubkeyHex = `04${xHex}${yHex}`;
    const pubkeyBytes = (0, code_js_1.hexStr2byteArray)(pubkeyHex);
    return pubkeyBytes;
}
function ECKeySign(hashBytes, priKeyBytes) {
    const signature = secp256k1_1.secp256k1.sign((0, bytes_js_1.byteArray2hexStr)(hashBytes), (0, bytes_js_1.byteArray2hexStr)(priKeyBytes));
    const r = signature.r.toString(16);
    const s = signature.s.toString(16);
    const v = signature.recovery + 27;
    return r.padStart(64, '0') + s.padStart(64, '0') + (0, bytes_js_1.byte2hexStr)(v);
}
function SHA256(msgBytes) {
    const msgHex = (0, bytes_js_1.byteArray2hexStr)(msgBytes);
    const hashHex = (0, ethersUtils_js_1.sha256)('0x' + msgHex).replace(/^0x/, '');
    return (0, code_js_1.hexStr2byteArray)(hashHex);
}
function passwordToAddress(password) {
    const com_priKeyBytes = (0, code_js_1.base64DecodeFromString)(password);
    const com_addressBytes = getAddressFromPriKey(com_priKeyBytes);
    return getBase58CheckAddress(com_addressBytes);
}
function pkToAddress(privateKey, strict = false) {
    const com_priKeyBytes = (0, code_js_1.hexStr2byteArray)(privateKey, strict);
    const com_addressBytes = getAddressFromPriKey(com_priKeyBytes);
    return getBase58CheckAddress(com_addressBytes);
}
function sha3(string, prefix = true) {
    return (prefix ? '0x' : '') + (0, ethersUtils_js_1.keccak256)(Buffer.from(string, 'utf-8')).toString().substring(2);
}
//# sourceMappingURL=crypto.js.map