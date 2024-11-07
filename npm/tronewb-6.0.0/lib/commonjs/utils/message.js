"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRON_MESSAGE_PREFIX = void 0;
exports.hashMessage = hashMessage;
exports.signMessage = signMessage;
exports.verifyMessage = verifyMessage;
const ethersUtils_js_1 = require("./ethersUtils.js");
const address_js_1 = require("./address.js");
const crypto_js_1 = require("./crypto.js");
const code_js_1 = require("./code.js");
exports.TRON_MESSAGE_PREFIX = '\x19TRON Signed Message:\n';
function hashMessage(message) {
    if (typeof message === 'string') {
        message = (0, ethersUtils_js_1.toUtf8Bytes)(message);
    }
    else if (Array.isArray(message)) {
        message = new Uint8Array(message);
    }
    return (0, ethersUtils_js_1.keccak256)((0, ethersUtils_js_1.concat)([(0, ethersUtils_js_1.toUtf8Bytes)(exports.TRON_MESSAGE_PREFIX), (0, ethersUtils_js_1.toUtf8Bytes)(String(message.length)), message]));
}
function signMessage(message, privateKey) {
    if (!privateKey.match(/^0x/)) {
        privateKey = '0x' + privateKey;
    }
    const signingKey = new ethersUtils_js_1.SigningKey(privateKey);
    const messageDigest = hashMessage(message);
    const signature = signingKey.sign(messageDigest);
    return (0, ethersUtils_js_1.joinSignature)(signature);
}
function verifyMessage(message, signature) {
    if (!signature.match(/^0x/)) {
        signature = '0x' + signature;
    }
    const recovered = (0, ethersUtils_js_1.recoverAddress)(hashMessage(message), signature);
    const base58Address = (0, crypto_js_1.getBase58CheckAddress)((0, code_js_1.hexStr2byteArray)(recovered.replace(/^0x/, address_js_1.ADDRESS_PREFIX)));
    return base58Address;
}
//# sourceMappingURL=message.js.map