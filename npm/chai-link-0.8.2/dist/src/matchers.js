"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ethers_1 = require("ethers");
// Throws if a and b are not equal, as BN's
exports.assertBigNum = (a, b, failureMessage) => chai_1.assert(ethers_1.ethers.utils.bigNumberify(a).eq(ethers_1.ethers.utils.bigNumberify(b)), `BigNum ${a} is not ${b}` + (failureMessage ? ': ' + failureMessage : ''));
//# sourceMappingURL=matchers.js.map