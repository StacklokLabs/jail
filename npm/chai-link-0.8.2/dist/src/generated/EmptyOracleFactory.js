"use strict";
/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
class EmptyOracleFactory extends ethers_1.ContractFactory {
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
exports.EmptyOracleFactory = EmptyOracleFactory;
const _abi = [
    {
        constant: false,
        inputs: [
            {
                name: "",
                type: "address"
            },
            {
                name: "",
                type: "uint256"
            },
            {
                name: "",
                type: "bytes32"
            },
            {
                name: "",
                type: "address"
            },
            {
                name: "",
                type: "bytes4"
            },
            {
                name: "",
                type: "uint256"
            },
            {
                name: "",
                type: "uint256"
            },
            {
                name: "",
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
                name: "",
                type: "bytes32"
            },
            {
                name: "",
                type: "uint256"
            },
            {
                name: "",
                type: "address"
            },
            {
                name: "",
                type: "bytes4"
            },
            {
                name: "",
                type: "uint256"
            },
            {
                name: "",
                type: "bytes32"
            }
        ],
        name: "fulfillOracleRequest",
        outputs: [
            {
                name: "",
                type: "bool"
            }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "withdrawable",
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
                name: "",
                type: "bytes32"
            },
            {
                name: "",
                type: "uint256"
            },
            {
                name: "",
                type: "bytes4"
            },
            {
                name: "",
                type: "uint256"
            }
        ],
        name: "cancelOracleRequest",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "",
                type: "address"
            },
            {
                name: "",
                type: "bool"
            }
        ],
        name: "setFulfillmentPermission",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [
            {
                name: "",
                type: "address"
            },
            {
                name: "",
                type: "uint256"
            },
            {
                name: "",
                type: "bytes"
            }
        ],
        name: "onTokenTransfer",
        outputs: [],
        payable: false,
        stateMutability: "pure",
        type: "function"
    },
    {
        constant: true,
        inputs: [
            {
                name: "",
                type: "address"
            }
        ],
        name: "getAuthorizationStatus",
        outputs: [
            {
                name: "",
                type: "bool"
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
                name: "",
                type: "address"
            },
            {
                name: "",
                type: "uint256"
            }
        ],
        name: "withdraw",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    }
];
const _bytecode = "0x608060405234801561001057600080fd5b50610472806100206000396000f30060806040526004361061008e576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806340429946146100935780634ab0d1901461016357806350188301146102175780636ee4d553146102425780637fcd56db146102b0578063a4c0ed36146102ff578063d3e9c31414610364578063f3fef3a3146103bf575b600080fd5b34801561009f57600080fd5b50610161600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19169060200190929190803590602001909291908035906020019092919080359060200190820180359060200191909192939192939050505061040c565b005b34801561016f57600080fd5b506101fd600480360381019080803560001916906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19169060200190929190803590602001909291908035600019169060200190929190505050610417565b604051808215151515815260200191505060405180910390f35b34801561022357600080fd5b5061022c610423565b6040518082815260200191505060405180910390f35b34801561024e57600080fd5b506102ae60048036038101908080356000191690602001909291908035906020019092919080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916906020019092919080359060200190929190505050610428565b005b3480156102bc57600080fd5b506102fd600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080351515906020019092919050505061042e565b005b34801561030b57600080fd5b50610362600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001908201803590602001919091929391929390505050610432565b005b34801561037057600080fd5b506103a5600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610438565b604051808215151515815260200191505060405180910390f35b3480156103cb57600080fd5b5061040a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610442565b005b505050505050505050565b60009695505050505050565b600090565b50505050565b5050565b50505050565b6000809050919050565b50505600a165627a7a72305820fffa245a50d4f1bd37175a6c1899272209a1c01f8d255cd2a44a7918dbe15ed30029";
//# sourceMappingURL=EmptyOracleFactory.js.map