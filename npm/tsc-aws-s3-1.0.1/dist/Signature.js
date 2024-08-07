"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_js_1 = __importDefault(require("crypto-js"));
var Signature = /** @class */ (function () {
    function Signature() {
    }
    Signature.getSignature = function (config, date, policyBase64) {
        var getSignatureKey = function (key, dateStamp, regionName) {
            var kDate = crypto_js_1.default.HmacSHA256(dateStamp, 'AWS4' + key);
            var kRegion = crypto_js_1.default.HmacSHA256(regionName, kDate);
            var kService = crypto_js_1.default.HmacSHA256('s3', kRegion);
            var kSigning = crypto_js_1.default.HmacSHA256('aws4_request', kService);
            return kSigning;
        };
        var signature = function (policyEncoded) {
            return crypto_js_1.default.HmacSHA256(policyEncoded, getSignatureKey(config.secretAccessKey, date, config.region)).toString(crypto_js_1.default.enc.Hex);
        };
        return signature(policyBase64);
    };
    return Signature;
}());
exports.default = Signature;
