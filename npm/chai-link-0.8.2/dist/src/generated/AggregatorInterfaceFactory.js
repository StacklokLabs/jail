"use strict";
/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
class AggregatorInterfaceFactory {
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.AggregatorInterfaceFactory = AggregatorInterfaceFactory;
const _abi = [
    {
        constant: true,
        inputs: [],
        name: "latestAnswer",
        outputs: [
            {
                name: "",
                type: "int256"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "latestRound",
        outputs: [
            {
                name: "",
                type: "uint256"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "latestTimestamp",
        outputs: [
            {
                name: "",
                type: "uint256"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [
            {
                name: "roundId",
                type: "uint256"
            }
        ],
        name: "getAnswer",
        outputs: [
            {
                name: "",
                type: "int256"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [
            {
                name: "roundId",
                type: "uint256"
            }
        ],
        name: "getTimestamp",
        outputs: [
            {
                name: "",
                type: "uint256"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "current",
                type: "int256"
            },
            {
                indexed: true,
                name: "roundId",
                type: "uint256"
            },
            {
                indexed: false,
                name: "timestamp",
                type: "uint256"
            }
        ],
        name: "AnswerUpdated",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "roundId",
                type: "uint256"
            },
            {
                indexed: true,
                name: "startedBy",
                type: "address"
            }
        ],
        name: "NewRound",
        type: "event"
    }
];
//# sourceMappingURL=AggregatorInterfaceFactory.js.map