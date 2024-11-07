"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidMnemonic = exports.wordlists = exports.Wordlist = exports.Mnemonic = exports.id = exports.concat = exports.ethersHDNodeWallet = exports.arrayify = exports.joinSignature = exports.splitSignature = exports.FormatTypes = exports.Interface = exports.AbiCoder = exports.SigningKey = exports.Signature = exports.recoverAddress = exports.toUtf8String = exports.toUtf8Bytes = exports.sha256 = exports.keccak256 = void 0;
const ethers_1 = require("ethers");
Object.defineProperty(exports, "keccak256", { enumerable: true, get: function () { return ethers_1.keccak256; } });
Object.defineProperty(exports, "sha256", { enumerable: true, get: function () { return ethers_1.sha256; } });
Object.defineProperty(exports, "toUtf8Bytes", { enumerable: true, get: function () { return ethers_1.toUtf8Bytes; } });
Object.defineProperty(exports, "toUtf8String", { enumerable: true, get: function () { return ethers_1.toUtf8String; } });
Object.defineProperty(exports, "recoverAddress", { enumerable: true, get: function () { return ethers_1.recoverAddress; } });
Object.defineProperty(exports, "SigningKey", { enumerable: true, get: function () { return ethers_1.SigningKey; } });
Object.defineProperty(exports, "AbiCoder", { enumerable: true, get: function () { return ethers_1.AbiCoder; } });
Object.defineProperty(exports, "Signature", { enumerable: true, get: function () { return ethers_1.Signature; } });
Object.defineProperty(exports, "concat", { enumerable: true, get: function () { return ethers_1.concat; } });
Object.defineProperty(exports, "id", { enumerable: true, get: function () { return ethers_1.id; } });
Object.defineProperty(exports, "Mnemonic", { enumerable: true, get: function () { return ethers_1.Mnemonic; } });
Object.defineProperty(exports, "Wordlist", { enumerable: true, get: function () { return ethers_1.Wordlist; } });
Object.defineProperty(exports, "wordlists", { enumerable: true, get: function () { return ethers_1.wordlists; } });
Object.defineProperty(exports, "ethersHDNodeWallet", { enumerable: true, get: function () { return ethers_1.HDNodeWallet; } });
const interface_js_1 = require("./interface.js");
Object.defineProperty(exports, "Interface", { enumerable: true, get: function () { return interface_js_1.Interface; } });
const splitSignature = (sigBytes) => ethers_1.Signature.from(sigBytes);
exports.splitSignature = splitSignature;
const joinSignature = (splitSig) => ethers_1.Signature.from(splitSig).serialized;
exports.joinSignature = joinSignature;
const arrayify = (value) => (0, ethers_1.getBytes)(value);
exports.arrayify = arrayify;
const FormatTypes = {
    sighash: 'sighash',
    minimal: 'minimal',
    full: 'full',
    json: 'json',
};
exports.FormatTypes = FormatTypes;
const isValidMnemonic = ethers_1.Mnemonic.isValidMnemonic;
exports.isValidMnemonic = isValidMnemonic;
ethers_1.computeHmac.register((algorithm, key, data) => {
    return ethers_1.computeHmac._(algorithm, Buffer.from(key), Buffer.from(data));
});
//# sourceMappingURL=ethersUtils.js.map