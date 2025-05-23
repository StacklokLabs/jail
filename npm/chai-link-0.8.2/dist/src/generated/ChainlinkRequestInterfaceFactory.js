"use strict";
/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
class ChainlinkRequestInterfaceFactory {
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.ChainlinkRequestInterfaceFactory = ChainlinkRequestInterfaceFactory;
const _abi = [
    {
        constant: false,
        inputs: [
            {
                name: "sender",
                type: "address"
            },
            {
                name: "payment",
                type: "uint256"
            },
            {
                name: "id",
                type: "bytes32"
            },
            {
                name: "callbackAddress",
                type: "address"
            },
            {
                name: "callbackFunctionId",
                type: "bytes4"
            },
            {
                name: "nonce",
                type: "uint256"
            },
            {
                name: "version",
                type: "uint256"
            },
            {
                name: "data",
                type: "bytes"
            }
        ],
        name: "oracleRequest",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "requestId",
                type: "bytes32"
            },
            {
                name: "payment",
                type: "uint256"
            },
            {
                name: "callbackFunctionId",
                type: "bytes4"
            },
            {
                name: "expiration",
                type: "uint256"
            }
        ],
        name: "cancelOracleRequest",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    }
];
//# sourceMappingURL=ChainlinkRequestInterfaceFactory.js.map