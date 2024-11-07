"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccount = generateAccount;
exports.generateRandom = generateRandom;
exports.generateAccountWithMnemonic = generateAccountWithMnemonic;
const bytes_js_1 = require("./bytes.js");
const crypto_js_1 = require("./crypto.js");
const ethersUtils_js_1 = require("./ethersUtils.js");
const address_js_1 = require("./address.js");
const INVALID_TRON_PATH_ERROR_MSG = 'Invalid tron path provided';
function generateAccount() {
    const priKeyBytes = (0, crypto_js_1.genPriKey)();
    const pubKeyBytes = (0, crypto_js_1.getPubKeyFromPriKey)(priKeyBytes);
    const addressBytes = (0, crypto_js_1.getAddressFromPriKey)(priKeyBytes);
    const privateKey = (0, bytes_js_1.byteArray2hexStr)(priKeyBytes);
    const publicKey = (0, bytes_js_1.byteArray2hexStr)(pubKeyBytes);
    return {
        privateKey,
        publicKey,
        address: {
            base58: (0, crypto_js_1.getBase58CheckAddress)(addressBytes),
            hex: (0, bytes_js_1.byteArray2hexStr)(addressBytes),
        },
    };
}
function generateRandom(password = '', path = address_js_1.TRON_BIP39_PATH_INDEX_0, wordlist) {
    const account = ethersUtils_js_1.ethersHDNodeWallet.createRandom(password, path, wordlist);
    const result = {
        mnemonic: account.mnemonic,
        privateKey: account.privateKey,
        publicKey: account.signingKey.publicKey,
        address: (0, crypto_js_1.pkToAddress)(account.privateKey.replace(/^0x/, '')),
        path: account.path,
    };
    return result;
}
function generateAccountWithMnemonic(mnemonic, path = address_js_1.TRON_BIP39_PATH_INDEX_0, password = '', wordlist = null) {
    // eslint-disable-next-line no-useless-escape
    if (!String(path).match(/^m\/44\'\/195\'/)) {
        throw new Error(INVALID_TRON_PATH_ERROR_MSG);
    }
    const account = ethersUtils_js_1.ethersHDNodeWallet.fromMnemonic(ethersUtils_js_1.Mnemonic.fromPhrase(mnemonic, password, wordlist), path);
    const result = {
        mnemonic: account.mnemonic,
        privateKey: account.privateKey,
        publicKey: account.signingKey.publicKey,
        address: (0, crypto_js_1.pkToAddress)(account.privateKey.replace(/^0x/, '')),
    };
    return result;
}
//# sourceMappingURL=accounts.js.map