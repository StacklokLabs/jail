"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
const tslib_1 = require("tslib");
/* eslint-disable no-control-regex */
const index_js_1 = tslib_1.__importDefault(require("../../utils/index.js"));
const abi_js_1 = require("../../utils/abi.js");
const crypto_js_1 = require("../../utils/crypto.js");
const getFunctionSelector = (abi) => {
    if ('stateMutability' in abi) {
        abi.stateMutability = abi.stateMutability ? abi.stateMutability.toLowerCase() : 'nonpayable';
    }
    abi.type = abi.type ? abi.type.toLowerCase() : '';
    if (abi.type === 'fallback' || abi.type === 'receive')
        return '0x';
    const iface = new index_js_1.default.ethersUtils.Interface([abi]);
    let obj;
    if (abi.type === 'event') {
        obj = iface.getEvent(abi.name);
    }
    else {
        obj = iface.getFunction(abi.name);
    }
    if (obj) {
        return obj.format('sighash');
    }
    throw new Error('unknown function');
};
const decodeOutput = (abi, output) => {
    return (0, abi_js_1.decodeParamsV2ByABI)(abi, output);
};
class Method {
    tronWeb;
    contract;
    abi;
    name;
    inputs;
    outputs;
    functionSelector;
    signature;
    defaultOptions;
    constructor(contract, abi) {
        this.tronWeb = contract.tronWeb;
        this.contract = contract;
        this.abi = abi;
        this.name = abi.name || abi.type;
        this.inputs = abi.inputs || [];
        this.outputs = [];
        if ('outputs' in abi && abi.outputs) {
            this.outputs = abi.outputs;
        }
        this.functionSelector = getFunctionSelector(abi);
        this.signature = (0, crypto_js_1.sha3)(this.functionSelector, false).slice(0, 8);
        this.defaultOptions = {
            feeLimit: this.tronWeb.feeLimit,
            callValue: 0,
            userFeePercentage: 100,
            shouldPollResponse: false, // Only used for sign()
        };
    }
    decodeInput(data) {
        const abi = JSON.parse(JSON.stringify(this.abi));
        abi.outputs = abi.inputs;
        return decodeOutput(abi, '0x' + data);
    }
    onMethod(...args) {
        let rawParameter = '';
        if (this.abi && !/event/i.test(this.abi.type)) {
            rawParameter = (0, abi_js_1.encodeParamsV2ByABI)(this.abi, args);
        }
        return {
            call: async (options = {}) => {
                options = {
                    ...options,
                    rawParameter,
                };
                return await this._call([], [], options);
            },
            send: async (options = {}, privateKey = this.tronWeb.defaultPrivateKey) => {
                options = {
                    ...options,
                    rawParameter,
                };
                return await this._send([], [], options, privateKey);
            },
        };
    }
    async _call(types, args, options = {}) {
        if (types.length !== args.length) {
            throw new Error('Invalid argument count provided');
        }
        if (!this.contract.address) {
            throw new Error('Smart contract is missing address');
        }
        if (!this.contract.deployed) {
            throw new Error('Calling smart contracts requires you to load the contract first');
        }
        if ('stateMutability' in this.abi) {
            const { stateMutability } = this.abi;
            if (stateMutability && !['pure', 'view'].includes(stateMutability.toLowerCase())) {
                throw new Error(`Methods with state mutability "${stateMutability}" must use send()`);
            }
        }
        options = {
            ...this.defaultOptions,
            from: this.tronWeb.defaultAddress.hex,
            ...options,
            _isConstant: true,
        };
        const parameters = args.map((value, index) => ({
            type: types[index],
            value,
        }));
        const transaction = await this.tronWeb.transactionBuilder.triggerSmartContract(this.contract.address, this.functionSelector, options, parameters, options.from ? this.tronWeb.address.toHex(options.from) : undefined);
        if (!index_js_1.default.hasProperty(transaction, 'constant_result')) {
            throw new Error('Failed to execute');
        }
        const len = transaction.constant_result[0].length;
        if (len === 0 || len % 64 === 8) {
            let msg = 'The call has been reverted or has thrown an error.';
            if (len !== 0) {
                msg += ' Error message: ';
                let msg2 = '';
                const chunk = transaction.constant_result[0].substring(8);
                for (let i = 0; i < len - 8; i += 64) {
                    msg2 += this.tronWeb.toUtf8(chunk.substring(i, i + 64));
                }
                msg += msg2
                    .replace(/(\u0000|\u000b|\f)+/g, ' ')
                    .replace(/ +/g, ' ')
                    .replace(/\s+$/g, '');
            }
            throw new Error(msg);
        }
        let output = decodeOutput(this.abi, '0x' + transaction.constant_result[0]);
        if (output.length === 1 && Object.keys(output).length === 1) {
            output = output[0];
        }
        return output;
    }
    async _send(types, args, options = {}, privateKey = this.tronWeb.defaultPrivateKey) {
        if (types.length !== args.length) {
            throw new Error('Invalid argument count provided');
        }
        if (!this.contract.address) {
            throw new Error('Smart contract is missing address');
        }
        if (!this.contract.deployed) {
            throw new Error('Calling smart contracts requires you to load the contract first');
        }
        const { stateMutability } = this.abi;
        if (['pure', 'view'].includes(stateMutability.toLowerCase())) {
            throw new Error(`Methods with state mutability "${stateMutability}" must use call()`);
        }
        // If a function isn't payable, dont provide a callValue.
        if (!['payable'].includes(stateMutability.toLowerCase())) {
            options.callValue = 0;
        }
        options = {
            ...this.defaultOptions,
            from: this.tronWeb.defaultAddress.hex,
            ...options,
        };
        const parameters = args.map((value, index) => ({
            type: types[index],
            value,
        }));
        const address = privateKey ? this.tronWeb.address.fromPrivateKey(privateKey) : this.tronWeb.defaultAddress.base58;
        const transaction = await this.tronWeb.transactionBuilder.triggerSmartContract(this.contract.address, this.functionSelector, options, parameters, this.tronWeb.address.toHex(address));
        if (!transaction.result || !transaction.result.result) {
            throw new Error('Unknown error: ' + JSON.stringify(transaction, null, 2));
        }
        // If privateKey is false, this won't be signed here. We assume sign functionality will be replaced.
        const signedTransaction = await this.tronWeb.trx.sign(transaction.transaction, privateKey);
        if (!signedTransaction.signature) {
            if (!privateKey) {
                throw new Error('Transaction was not signed properly');
            }
            throw new Error('Invalid private key provided');
        }
        const broadcast = await this.tronWeb.trx.sendRawTransaction(signedTransaction);
        if (broadcast.code) {
            const err = {
                error: broadcast.code,
                message: broadcast.code,
            };
            if (broadcast.message)
                err.message = this.tronWeb.toUtf8(broadcast.message);
            const error = new Error(err.message);
            error.error = broadcast.code;
            throw error;
        }
        if (!options.shouldPollResponse) {
            return signedTransaction.txID;
        }
        const checkResult = async (index) => {
            if (index === (options.pollTimes || 20)) {
                const error = new Error('Cannot find result in solidity node');
                error.error = 'Cannot find result in solidity node';
                error.transaction = signedTransaction;
                throw error;
            }
            const output = await this.tronWeb.trx.getTransactionInfo(signedTransaction.txID);
            if (!Object.keys(output).length) {
                await new Promise((r) => setTimeout(r, 3000));
                return checkResult(index + 1);
            }
            if (output.result && output.result === 'FAILED') {
                const error = new Error(this.tronWeb.toUtf8(output.resMessage));
                error.error = this.tronWeb.toUtf8(output.resMessage);
                error.transaction = signedTransaction;
                error.output = output;
                throw error;
            }
            if (!index_js_1.default.hasProperty(output, 'contractResult')) {
                const error = new Error('Failed to execute: ' + JSON.stringify(output, null, 2));
                error.error = 'Failed to execute: ' + JSON.stringify(output, null, 2);
                error.transaction = signedTransaction;
                error.output = output;
                throw error;
            }
            if (options.rawResponse) {
                return output;
            }
            let decoded = decodeOutput(this.abi, '0x' + output.contractResult[0]);
            if (decoded.length === 1 && Object.keys(decoded).length === 1) {
                decoded = decoded[0];
            }
            if (options.keepTxID) {
                return [signedTransaction.txID, decoded];
            }
            return decoded;
        };
        return checkResult(0);
    }
}
exports.Method = Method;
//# sourceMappingURL=method.js.map