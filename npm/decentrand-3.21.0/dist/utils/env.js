"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnvCi = exports.getProvider = exports.isDev = exports.isDebug = exports.isDevelopment = void 0;
const _1 = require(".");
function isDevelopment() {
    if (!process.env.NODE_ENV) {
        try {
            require.resolve('decentraland-eth');
            return true;
        }
        catch (e) {
            return false;
        }
    }
    return process.env.NODE_ENV !== 'production';
}
exports.isDevelopment = isDevelopment;
function isDebug() {
    return !!process.env.DEBUG;
}
exports.isDebug = isDebug;
exports.isDev = process.env.DCL_ENV === 'dev';
function getProvider() {
    return exports.isDev ? 'https://rpc.decentraland.org/sepolia' : 'https://rpc.decentraland.org/mainnet';
}
exports.getProvider = getProvider;
function isEnvCi() {
    return (0, _1.getOrElse)(process.env.CI, false);
}
exports.isEnvCi = isEnvCi;
//# sourceMappingURL=env.js.map