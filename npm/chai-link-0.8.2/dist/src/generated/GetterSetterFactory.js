"use strict";
/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
class GetterSetterFactory extends ethers_1.ContractFactory {
    constructor(signer) {
        super(_abi, _bytecode, signer);
    }
    deploy() {
        return super.deploy();
    }
    getDeployTransaction() {
        return super.getDeployTransaction();
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.GetterSetterFactory = GetterSetterFactory;
const _abi = [
    {
        constant: true,
        inputs: [],
        name: "requestId",
        outputs: [
            {
                name: "",
                type: "bytes32"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "getBytes",
        outputs: [
            {
                name: "",
                type: "bytes"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "getBytes32",
        outputs: [
            {
                name: "",
                type: "bytes32"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_requestId",
                type: "bytes32"
            },
            {
                name: "_value",
                type: "uint256"
            }
        ],
        name: "requestedUint256",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_requestId",
                type: "bytes32"
            },
            {
                name: "_value",
                type: "bytes"
            }
        ],
        name: "requestedBytes",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "getUint256",
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
        constant: false,
        inputs: [
            {
                name: "_value",
                type: "bytes32"
            }
        ],
        name: "setBytes32",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_value",
                type: "uint256"
            }
        ],
        name: "setUint256",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_value",
                type: "bytes"
            }
        ],
        name: "setBytes",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_requestId",
                type: "bytes32"
            },
            {
                name: "_value",
                type: "bytes32"
            }
        ],
        name: "requestedBytes32",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "from",
                type: "address"
            },
            {
                indexed: true,
                name: "value",
                type: "bytes32"
            }
        ],
        name: "SetBytes32",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "from",
                type: "address"
            },
            {
                indexed: true,
                name: "value",
                type: "uint256"
            }
        ],
        name: "SetUint256",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "from",
                type: "address"
            },
            {
                indexed: false,
                name: "value",
                type: "bytes"
            }
        ],
        name: "SetBytes",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: "b32",
                type: "bytes32"
            },
            {
                indexed: false,
                name: "u256",
                type: "uint256"
            },
            {
                indexed: false,
                name: "b322",
                type: "bytes32"
            }
        ],
        name: "Output",
        type: "event"
    }
];
const _bytecode = "0x608060405234801561001057600080fd5b506106bb806100206000396000f3006080604052600436106100a3576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680626d6cae146100a85780630bcd3b33146100db5780631f9030371461016b5780633345b4d01461019e57806346ddd1ff146101d95780636889597914610250578063c2b12a731461027b578063d2282dc5146102ac578063da359dc8146102d9578063ed53e51114610342575b600080fd5b3480156100b457600080fd5b506100bd610381565b60405180826000191660001916815260200191505060405180910390f35b3480156100e757600080fd5b506100f0610387565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610130578082015181840152602081019050610115565b50505050905090810190601f16801561015d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561017757600080fd5b50610180610425565b60405180826000191660001916815260200191505060405180910390f35b3480156101aa57600080fd5b506101d760048036038101908080356000191690602001909291908035906020019092919050505061042b565b005b3480156101e557600080fd5b5061024e6004803603810190808035600019169060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610443565b005b34801561025c57600080fd5b5061026561045b565b6040518082815260200191505060405180910390f35b34801561028757600080fd5b506102aa6004803603810190808035600019169060200190929190505050610461565b005b3480156102b857600080fd5b506102d7600480360381019080803590602001909291905050506104b7565b005b3480156102e557600080fd5b50610340600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610505565b005b34801561034e57600080fd5b5061037f600480360381019080803560001916906020019092919080356000191690602001909291905050506105d2565b005b60025481565b60038054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561041d5780601f106103f25761010080835404028352916020019161041d565b820191906000526020600020905b81548152906001019060200180831161040057829003601f168201915b505050505081565b60005481565b816002816000191690555061043f816104b7565b5050565b816002816000191690555061045781610505565b5050565b60015481565b806000816000191690555080600019163373ffffffffffffffffffffffffffffffffffffffff167fdc73ee99832252105ed74a404690c2f10ad1b294cbbeb0ff5cded48ef2aa437d60405160405180910390a350565b80600181905550803373ffffffffffffffffffffffffffffffffffffffff167fd943f063acdb1c6f206cf6a3f6d1ba39687bcc07feb7f44019bdbd4773c9c28d60405160405180910390a350565b806003908051906020019061051b9291906105ea565b503373ffffffffffffffffffffffffffffffffffffffff167ff22a519d38e59bc517532f666f8da532fdd5356e68d617191e82a8fdcc8abdcf826040518080602001828103825283818151815260200191508051906020019080838360005b8381101561059557808201518184015260208101905061057a565b50505050905090810190601f1680156105c25780820380516001836020036101000a031916815260200191505b509250505060405180910390a250565b81600281600019169055506105e681610461565b5050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061062b57805160ff1916838001178555610659565b82800160010185558215610659579182015b8281111561065857825182559160200191906001019061063d565b5b509050610666919061066a565b5090565b61068c91905b80821115610688576000816000905550600101610670565b5090565b905600a165627a7a723058202eadeed356ef979c6b674d35604e5bdccdcd5091fbf0db2f12c0d3076a296d5e0029";
//# sourceMappingURL=GetterSetterFactory.js.map