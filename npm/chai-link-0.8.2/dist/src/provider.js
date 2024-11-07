"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const ganache_core_1 = __importDefault(require("ganache-core"));
/**
 * Create a test provider which uses an in-memory, in-process chain
 */
function makeTestProvider() {
    return new ethers_1.ethers.providers.Web3Provider(ganache_core_1.default.provider());
}
exports.makeTestProvider = makeTestProvider;
//# sourceMappingURL=provider.js.map