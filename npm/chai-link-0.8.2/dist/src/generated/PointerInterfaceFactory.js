"use strict";
/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
class PointerInterfaceFactory {
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.PointerInterfaceFactory = PointerInterfaceFactory;
const _abi = [
    {
        constant: true,
        inputs: [],
        name: "getAddress",
        outputs: [
            {
                name: "",
                type: "address"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    }
];
//# sourceMappingURL=PointerInterfaceFactory.js.map