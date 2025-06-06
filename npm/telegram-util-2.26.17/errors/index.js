"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCMessageToError = RPCMessageToError;
const RPCBaseErrors_1 = require("./RPCBaseErrors");
const RPCErrorList_1 = require("./RPCErrorList");
function RPCMessageToError(rpcError, request) {
    for (const [msgRegex, Cls] of RPCErrorList_1.rpcErrorRe) {
        const m = rpcError.errorMessage.match(msgRegex);
        if (m) {
            const capture = m.length === 2 ? parseInt(m[1]) : null;
            return new Cls({ request: request, capture: capture });
        }
    }
    return new RPCBaseErrors_1.RPCError(rpcError.errorMessage, request, rpcError.errorCode);
}
__exportStar(require("./Common"), exports);
__exportStar(require("./RPCBaseErrors"), exports);
__exportStar(require("./RPCErrorList"), exports);
