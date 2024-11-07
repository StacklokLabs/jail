"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionBuilder = void 0;
const tronweb_js_1 = require("../../tronweb.js");
const ethersUtils_js_1 = require("../../utils/ethersUtils.js");
const address_js_1 = require("../../utils/address.js");
const abi_js_1 = require("../../utils/abi.js");
const index_js_1 = require("../../paramValidator/index.js");
const validations_js_1 = require("../../utils/validations.js");
const Contract_js_1 = require("../../types/Contract.js");
const helper_js_1 = require("./helper.js");
class TransactionBuilder {
    tronWeb;
    validator;
    constructor(tronWeb) {
        if (!tronWeb || !(tronWeb instanceof tronweb_js_1.TronWeb)) {
            throw new Error('Expected instance of TronWeb');
        }
        this.tronWeb = tronWeb;
        this.validator = new index_js_1.Validator();
    }
    async sendTrx(to, amount = 0, from = this.tronWeb.defaultAddress.hex, options = {}) {
        // accept amounts passed as strings
        amount = parseInt(amount);
        this.validator.notValid([
            {
                name: 'recipient',
                type: 'address',
                value: to,
            },
            {
                name: 'origin',
                type: 'address',
                value: from,
            },
            {
                names: ['recipient', 'origin'],
                type: 'notEqual',
                msg: 'Cannot transfer TRX to the same account',
            },
            {
                name: 'amount',
                type: 'integer',
                gt: 0,
                value: amount,
            },
        ]);
        const data = {
            to_address: (0, address_js_1.toHex)(to),
            owner_address: (0, address_js_1.toHex)(from),
            amount: amount,
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.TransferContract, data, options?.permissionId, transactionOptions);
    }
    async sendToken(to, amount = 0, tokenId, from = this.tronWeb.defaultAddress.hex, options = {}) {
        amount = parseInt(amount);
        this.validator.notValid([
            {
                name: 'recipient',
                type: 'address',
                value: to,
            },
            {
                name: 'origin',
                type: 'address',
                value: from,
            },
            {
                names: ['recipient', 'origin'],
                type: 'notEqual',
                msg: 'Cannot transfer tokens to the same account',
            },
            {
                name: 'amount',
                type: 'integer',
                gt: 0,
                value: amount,
            },
            {
                name: 'token ID',
                type: 'tokenId',
                value: tokenId,
            },
        ]);
        const data = {
            to_address: (0, address_js_1.toHex)(to),
            owner_address: (0, address_js_1.toHex)(from),
            asset_name: (0, helper_js_1.fromUtf8)(tokenId),
            amount,
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.TransferAssetContract, data, options?.permissionId, transactionOptions);
    }
    async purchaseToken(issuerAddress, tokenId, amount = 0, buyer = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'buyer',
                type: 'address',
                value: buyer,
            },
            {
                name: 'issuer',
                type: 'address',
                value: issuerAddress,
            },
            {
                names: ['buyer', 'issuer'],
                type: 'notEqual',
                msg: 'Cannot purchase tokens from same account',
            },
            {
                name: 'amount',
                type: 'integer',
                gt: 0,
                value: amount,
            },
            {
                name: 'token ID',
                type: 'tokenId',
                value: tokenId,
            },
        ]);
        const data = {
            to_address: (0, address_js_1.toHex)(issuerAddress),
            owner_address: (0, address_js_1.toHex)(buyer),
            asset_name: (0, helper_js_1.fromUtf8)(tokenId),
            amount: parseInt(amount),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.ParticipateAssetIssueContract, data, options?.permissionId, transactionOptions);
    }
    async freezeBalance(amount = 0, duration = 3, resource = 'BANDWIDTH', ownerAddress = this.tronWeb.defaultAddress.hex, receiverAddress, options = {}) {
        this.validator.notValid([
            {
                name: 'origin',
                type: 'address',
                value: ownerAddress,
            },
            {
                name: 'receiver',
                type: 'address',
                value: receiverAddress,
                optional: true,
            },
            {
                name: 'amount',
                type: 'integer',
                gt: 0,
                value: amount,
            },
            {
                name: 'duration',
                type: 'integer',
                gte: 3,
                value: duration,
            },
            {
                name: 'resource',
                type: 'resource',
                value: resource,
                msg: 'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"',
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(ownerAddress),
            frozen_balance: parseInt(amount),
            frozen_duration: parseInt(String(duration)),
        };
        if (resource !== 'BANDWIDTH') {
            data.resource = resource;
        }
        if ((0, validations_js_1.isNotNullOrUndefined)(receiverAddress) && (0, address_js_1.toHex)(receiverAddress) !== (0, address_js_1.toHex)(ownerAddress)) {
            data.receiver_address = (0, address_js_1.toHex)(receiverAddress);
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.FreezeBalanceContract, data, options?.permissionId, transactionOptions);
    }
    async unfreezeBalance(resource = 'BANDWIDTH', address = this.tronWeb.defaultAddress.hex, receiverAddress, options = {}) {
        this.validator.notValid([
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
            {
                name: 'receiver',
                type: 'address',
                value: receiverAddress,
                optional: true,
            },
            {
                name: 'resource',
                type: 'resource',
                value: resource,
                msg: 'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"',
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(address),
        };
        if (resource !== 'BANDWIDTH') {
            data.resource = resource;
        }
        if ((0, validations_js_1.isNotNullOrUndefined)(receiverAddress) && (0, address_js_1.toHex)(receiverAddress) !== (0, address_js_1.toHex)(address)) {
            data.receiver_address = (0, address_js_1.toHex)(receiverAddress);
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.UnfreezeBalanceContract, data, options?.permissionId, transactionOptions);
    }
    async freezeBalanceV2(amount = 0, resource = 'BANDWIDTH', address = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
            {
                name: 'amount',
                type: 'integer',
                gt: 0,
                value: amount,
            },
            {
                name: 'resource',
                type: 'resource',
                value: resource,
                msg: 'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"',
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(address),
            frozen_balance: parseInt(amount),
        };
        if (resource !== 'BANDWIDTH') {
            data.resource = resource;
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.FreezeBalanceV2Contract, data, options?.permissionId, transactionOptions);
    }
    async unfreezeBalanceV2(amount = 0, resource = 'BANDWIDTH', address = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
            {
                name: 'amount',
                type: 'integer',
                gt: 0,
                value: amount,
            },
            {
                name: 'resource',
                type: 'resource',
                value: resource,
                msg: 'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"',
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(address),
            unfreeze_balance: parseInt(amount),
        };
        if (resource !== 'BANDWIDTH') {
            data.resource = resource;
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.UnfreezeBalanceV2Contract, data, options?.permissionId, transactionOptions);
    }
    async cancelUnfreezeBalanceV2(address = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(address),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.CancelAllUnfreezeV2Contract, data, options?.permissionId, transactionOptions);
    }
    async delegateResource(amount = 0, receiverAddress, resource = 'BANDWIDTH', address = this.tronWeb.defaultAddress.hex, lock = false, lockPeriod, options = {}) {
        this.validator.notValid([
            {
                name: 'amount',
                type: 'integer',
                gt: 0,
                value: amount,
            },
            {
                name: 'resource',
                type: 'resource',
                value: resource,
                msg: 'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"',
            },
            {
                name: 'receiver',
                type: 'address',
                value: receiverAddress,
            },
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
            {
                name: 'lock',
                type: 'boolean',
                value: lock,
            },
            {
                name: 'lock period',
                type: 'integer',
                gte: 0,
                value: lockPeriod,
                optional: true,
            },
        ]);
        if ((0, address_js_1.toHex)(receiverAddress) === (0, address_js_1.toHex)(address)) {
            throw new Error('Receiver address must not be the same as owner address');
        }
        const data = {
            owner_address: (0, address_js_1.toHex)(address),
            receiver_address: (0, address_js_1.toHex)(receiverAddress),
            balance: parseInt(amount),
        };
        if (resource !== 'BANDWIDTH') {
            data.resource = resource;
        }
        if (lock) {
            data.lock = lock;
            if ((0, validations_js_1.isNotNullOrUndefined)(lockPeriod)) {
                data.lock_period = lockPeriod;
            }
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.DelegateResourceContract, data, options?.permissionId, transactionOptions);
    }
    async undelegateResource(amount = 0, receiverAddress, resource = 'BANDWIDTH', address = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
            {
                name: 'receiver',
                type: 'address',
                value: receiverAddress,
            },
            {
                name: 'amount',
                type: 'integer',
                gt: 0,
                value: amount,
            },
            {
                name: 'resource',
                type: 'resource',
                value: resource,
                msg: 'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"',
            },
        ]);
        if ((0, address_js_1.toHex)(receiverAddress) === (0, address_js_1.toHex)(address)) {
            throw new Error('Receiver address must not be the same as owner address');
        }
        const data = {
            owner_address: (0, address_js_1.toHex)(address),
            receiver_address: (0, address_js_1.toHex)(receiverAddress),
            balance: parseInt(amount),
        };
        if (resource !== 'BANDWIDTH') {
            data.resource = resource;
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.UnDelegateResourceContract, data, options?.permissionId, transactionOptions);
    }
    async withdrawExpireUnfreeze(address = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(address),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.WithdrawExpireUnfreezeContract, data, options?.permissionId, transactionOptions);
    }
    async withdrawBlockRewards(address = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(address),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.WithdrawBalanceContract, data, options?.permissionId, transactionOptions);
    }
    async applyForSR(address = this.tronWeb.defaultAddress.hex, url = '', options = {}) {
        this.validator.notValid([
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
            {
                name: 'url',
                type: 'url',
                value: url,
                msg: 'Invalid url provided',
            },
            {
                name: 'url',
                type: 'string',
                value: url,
                lte: 256,
                msg: 'Invalid url provided',
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(address),
            url: (0, helper_js_1.fromUtf8)(url),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.WitnessCreateContract, data, options?.permissionId, transactionOptions);
    }
    async vote(votes = {}, voterAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'voter',
                type: 'address',
                value: voterAddress,
            },
            {
                name: 'votes',
                type: 'notEmptyObject',
                value: votes,
            },
        ]);
        const entries = Object.entries(votes);
        for (const [srAddress, voteCount] of entries) {
            this.validator.notValid([
                {
                    name: 'SR',
                    type: 'address',
                    value: srAddress,
                },
                {
                    name: 'vote count',
                    type: 'integer',
                    gt: 0,
                    value: voteCount,
                    msg: 'Invalid vote count provided for SR: ' + srAddress,
                },
            ]);
        }
        const voteList = entries.map(([srAddress, voteCount]) => {
            return {
                vote_address: (0, address_js_1.toHex)(srAddress),
                vote_count: parseInt(voteCount),
            };
        });
        const data = {
            owner_address: (0, address_js_1.toHex)(voterAddress),
            votes: voteList,
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.VoteWitnessContract, data, options?.permissionId, transactionOptions);
    }
    async createSmartContract(options = {}, issuerAddress = this.tronWeb.defaultAddress.hex) {
        const feeLimit = options.feeLimit || this.tronWeb.feeLimit;
        let userFeePercentage = options.userFeePercentage;
        if (typeof userFeePercentage !== 'number' && !userFeePercentage) {
            userFeePercentage = 100;
        }
        const originEnergyLimit = options.originEnergyLimit || 10_000_000;
        const callValue = options.callValue || 0;
        const tokenValue = options.tokenValue;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const tokenId = options.tokenId || options.token_id;
        let { abi } = options;
        const { parameters = [] } = options;
        let parameter = '';
        const { bytecode = false, name = '' } = options;
        if (abi && (0, validations_js_1.isString)(abi)) {
            try {
                abi = JSON.parse(abi);
            }
            catch {
                throw new Error('Invalid options.abi provided');
            }
        }
        const newAbi = abi;
        let entries = newAbi;
        if (newAbi.entrys) {
            entries = newAbi.entrys;
        }
        if (!(0, validations_js_1.isArray)(entries))
            throw new Error('Invalid options.abi provided');
        const payable = entries.some((func) => {
            return func.type === 'constructor' && 'payable' === func.stateMutability.toLowerCase();
        });
        this.validator.notValid([
            {
                name: 'bytecode',
                type: 'hex',
                value: bytecode,
            },
            {
                name: 'feeLimit',
                type: 'integer',
                value: feeLimit,
                gt: 0,
            },
            {
                name: 'callValue',
                type: 'integer',
                value: callValue,
                gte: 0,
            },
            {
                name: 'userFeePercentage',
                type: 'integer',
                value: userFeePercentage,
                gte: 0,
                lte: 100,
            },
            {
                name: 'originEnergyLimit',
                type: 'integer',
                value: originEnergyLimit,
                gte: 0,
                lte: 10_000_000,
            },
            {
                name: 'parameters',
                type: 'array',
                value: parameters,
            },
            {
                name: 'issuer',
                type: 'address',
                value: issuerAddress,
            },
            {
                name: 'tokenValue',
                type: 'integer',
                value: tokenValue,
                gte: 0,
                optional: true,
            },
            {
                name: 'tokenId',
                type: 'integer',
                value: tokenId,
                gte: 0,
                optional: true,
            },
        ]);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!payable && (callValue > 0 || tokenValue > 0))
            throw new Error('When contract is not payable, options.callValue and options.tokenValue must be 0');
        const { rawParameter, funcABIV2, parametersV2 } = options;
        if (rawParameter && (0, validations_js_1.isString)(rawParameter)) {
            parameter = rawParameter.replace(/^(0x)/, '');
        }
        else if (funcABIV2) {
            parameter = (0, abi_js_1.encodeParamsV2ByABI)(funcABIV2, parametersV2).replace(/^(0x)/, '');
        }
        else {
            let constructorParams = entries.find((it) => {
                return it.type === 'constructor';
            });
            if (typeof constructorParams !== 'undefined' && constructorParams) {
                const abiCoder = new ethersUtils_js_1.AbiCoder();
                const types = [];
                const values = [];
                constructorParams = constructorParams.inputs;
                if (parameters.length != constructorParams.length)
                    throw new Error(`constructor needs ${constructorParams.length} but ${parameters.length} provided`);
                for (let i = 0; i < parameters.length; i++) {
                    let type = constructorParams[i].type;
                    let value = parameters[i];
                    if (!type || !(0, validations_js_1.isString)(type) || !type.length)
                        throw new Error('Invalid parameter type provided: ' + type);
                    const replaceAddressPrefix = (value) => {
                        if ((0, validations_js_1.isArray)(value)) {
                            return value.map((v) => replaceAddressPrefix(v));
                        }
                        return (0, address_js_1.toHex)(value).replace(address_js_1.ADDRESS_PREFIX_REGEX, '0x');
                    };
                    if (type === 'address')
                        value = replaceAddressPrefix(value);
                    else if (type.match(/^([^\x5b]*)(\x5b|$)/)?.[0] === 'address[')
                        value = replaceAddressPrefix(value);
                    else if (/trcToken/.test(type)) {
                        type = type.replace(/trcToken/, 'uint256');
                    }
                    types.push(type);
                    values.push(value);
                }
                try {
                    parameter = abiCoder.encode(types, values).replace(/^(0x)/, '');
                }
                catch (ex) {
                    throw new Error(ex);
                }
            }
            else {
                parameter = '';
            }
        }
        const args = {
            owner_address: (0, address_js_1.toHex)(issuerAddress),
            fee_limit: parseInt(feeLimit),
            call_value: parseInt(callValue),
            consume_user_resource_percent: userFeePercentage,
            origin_energy_limit: originEnergyLimit,
            abi: JSON.stringify(abi),
            bytecode,
            parameter,
            name,
        };
        // tokenValue and tokenId can cause errors if provided when the trx10 proposal has not been approved yet. So we set them only if they are passed to the method.
        if ((0, validations_js_1.isNotNullOrUndefined)(tokenValue)) {
            args.call_token_value = parseInt(tokenValue);
        }
        if ((0, validations_js_1.isNotNullOrUndefined)(tokenId)) {
            args.token_id = parseInt(tokenId);
        }
        const contract = {};
        contract.owner_address = args.owner_address;
        if ((0, validations_js_1.isNotNullOrUndefined)(args.call_token_value)) {
            contract.call_token_value = args.call_token_value;
        }
        if ((0, validations_js_1.isNotNullOrUndefined)(args.token_id)) {
            contract.token_id = args.token_id;
        }
        const new_contract = (contract.new_contract = {});
        if (args.abi) {
            new_contract.abi = {
                entrys: JSON.parse(args.abi),
            };
        }
        else {
            new_contract.abi = {};
        }
        if (args.call_value) {
            new_contract.call_value = args.call_value;
        }
        new_contract.consume_user_resource_percent = args.consume_user_resource_percent;
        new_contract.origin_energy_limit = args.origin_energy_limit;
        new_contract.origin_address = args.origin_address ?? args.owner_address;
        if (args.bytecode + args.parameter) {
            new_contract.bytecode = (args.bytecode + args.parameter).replace(/^0x/, '');
        }
        if ((0, validations_js_1.isNotNullOrUndefined)(args.name)) {
            new_contract.name = args.name;
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        const tx = (await (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.CreateSmartContract, contract, options?.permissionId, {
            ...transactionOptions,
            fee_limit: args.fee_limit,
        }));
        tx.contract_address = (0, helper_js_1.genContractAddress)(args.owner_address, tx.txID);
        return tx;
    }
    async triggerSmartContract(contractAddress, functionSelector, options, parameters, issuerAddress) {
        const params = [
            contractAddress,
            functionSelector,
            options,
            parameters,
            issuerAddress,
        ];
        if (typeof params[2] !== 'object') {
            params[2] = {
                feeLimit: params[2],
                callValue: params[3],
            };
            params.splice(3, 1);
        }
        if (params[2]?.txLocal) {
            return this._triggerSmartContractLocal(...params);
        }
        return this._triggerSmartContract(...params);
    }
    async triggerConstantContract(contractAddress, functionSelector, options = {}, parameters = [], issuerAddress = this.tronWeb.defaultAddress.hex) {
        options._isConstant = true;
        return this._triggerSmartContract(contractAddress, functionSelector, options, parameters, issuerAddress);
    }
    async triggerConfirmedConstantContract(contractAddress, functionSelector, options = {}, parameters = [], issuerAddress = this.tronWeb.defaultAddress.hex) {
        options._isConstant = true;
        options.confirmed = true;
        return this._triggerSmartContract(contractAddress, functionSelector, options, parameters, issuerAddress);
    }
    async estimateEnergy(contractAddress, functionSelector, options = {}, parameters = [], issuerAddress = this.tronWeb.defaultAddress.hex) {
        options.estimateEnergy = true;
        const result = await this._triggerSmartContract(contractAddress, functionSelector, options, parameters, issuerAddress);
        return result;
    }
    async deployConstantContract(options = { input: '', ownerAddress: '' }) {
        const { input, ownerAddress, tokenId, tokenValue, callValue = 0 } = options;
        this.validator.notValid([
            {
                name: 'input',
                type: 'not-empty-string',
                value: input,
            },
            {
                name: 'callValue',
                type: 'integer',
                value: callValue,
                gte: 0,
            },
            {
                name: 'owner',
                type: 'address',
                value: ownerAddress,
            },
            {
                name: 'tokenValue',
                type: 'integer',
                value: tokenValue,
                gte: 0,
                optional: true,
            },
            {
                name: 'tokenId',
                type: 'integer',
                value: tokenId,
                gte: 0,
                optional: true,
            },
        ]);
        const args = {
            data: input,
            owner_address: (0, address_js_1.toHex)(ownerAddress),
            call_value: callValue,
        };
        if (tokenId) {
            args.token_id = tokenId;
        }
        if (tokenValue) {
            args.call_token_value = tokenValue;
        }
        const pathInfo = `wallet${options.confirmed ? 'solidity' : ''}/estimateenergy`;
        const transaction = await this.tronWeb[options.confirmed ? 'solidityNode' : 'fullNode'].request(pathInfo, args, 'post');
        if (transaction.Error)
            throw new Error(transaction.Error);
        if (transaction.result && transaction.result.message) {
            throw new Error(this.tronWeb.toUtf8(transaction.result.message));
        }
        return transaction;
    }
    _getTriggerSmartContractArgs(contractAddress, functionSelector, options, parameters, issuerAddress, tokenValue, tokenId, callValue, feeLimit) {
        const args = {
            contract_address: (0, address_js_1.toHex)(contractAddress),
            owner_address: (0, address_js_1.toHex)(issuerAddress),
        };
        if (functionSelector && (0, validations_js_1.isString)(functionSelector)) {
            functionSelector = functionSelector.replace(/\s*/g, '');
            let parameterStr;
            if (parameters.length) {
                const abiCoder = new ethersUtils_js_1.AbiCoder();
                let types = [];
                const values = [];
                for (let i = 0; i < parameters.length; i++) {
                    let { value } = parameters[i];
                    const { type } = parameters[i];
                    if (!type || !(0, validations_js_1.isString)(type) || !type.length)
                        throw new Error('Invalid parameter type provided: ' + type);
                    const replaceAddressPrefix = (value) => {
                        if ((0, validations_js_1.isArray)(value)) {
                            return value.map((v) => replaceAddressPrefix(v));
                        }
                        return (0, address_js_1.toHex)(value).replace(address_js_1.ADDRESS_PREFIX_REGEX, '0x');
                    };
                    if (type === 'address')
                        value = replaceAddressPrefix(value);
                    else if (type.match(/^([^\x5b]*)(\x5b|$)/)?.[0] === 'address[')
                        value = replaceAddressPrefix(value);
                    types.push(type);
                    values.push(value);
                }
                try {
                    // workaround for unsupported trcToken type
                    types = types.map((type) => {
                        if (/trcToken/.test(type)) {
                            type = type.replace(/trcToken/, 'uint256');
                        }
                        return type;
                    });
                    parameterStr = abiCoder.encode(types, values).replace(/^(0x)/, '');
                }
                catch (ex) {
                    throw new Error(ex);
                }
            }
            else
                parameterStr = '';
            // work for abiv2 if passed the function abi in options
            if (options.funcABIV2) {
                parameterStr = (0, abi_js_1.encodeParamsV2ByABI)(options.funcABIV2, options.parametersV2).replace(/^(0x)/, '');
            }
            if (options.shieldedParameter && (0, validations_js_1.isString)(options.shieldedParameter)) {
                parameterStr = options.shieldedParameter.replace(/^(0x)/, '');
            }
            if (options.rawParameter && (0, validations_js_1.isString)(options.rawParameter)) {
                parameterStr = options.rawParameter.replace(/^(0x)/, '');
            }
            args.function_selector = functionSelector;
            args.parameter = parameterStr;
        }
        else if (options.input) {
            args.data = options.input;
        }
        args.call_value = parseInt(callValue);
        if ((0, validations_js_1.isNotNullOrUndefined)(tokenValue))
            args.call_token_value = parseInt(tokenValue);
        if ((0, validations_js_1.isNotNullOrUndefined)(tokenId))
            args.token_id = parseInt(tokenId);
        if (!(options._isConstant || options.estimateEnergy)) {
            args.fee_limit = parseInt(feeLimit);
        }
        if (options.permissionId) {
            args.Permission_id = options.permissionId;
        }
        return args;
    }
    async _triggerSmartContractLocal(contractAddress, functionSelector, options = {}, parameters = [], issuerAddress = this.tronWeb.defaultAddress.hex) {
        const { tokenValue, tokenId, callValue, feeLimit } = Object.assign({
            callValue: 0,
            feeLimit: this.tronWeb.feeLimit,
        }, options);
        this.validator.notValid([
            {
                name: 'feeLimit',
                type: 'integer',
                value: feeLimit,
                gt: 0,
            },
            {
                name: 'callValue',
                type: 'integer',
                value: callValue,
                gte: 0,
            },
            {
                name: 'parameters',
                type: 'array',
                value: parameters,
            },
            {
                name: 'contract',
                type: 'address',
                value: contractAddress,
            },
            {
                name: 'issuer',
                type: 'address',
                value: issuerAddress,
                optional: true,
            },
            {
                name: 'tokenValue',
                type: 'integer',
                value: tokenValue,
                gte: 0,
                optional: true,
            },
            {
                name: 'tokenId',
                type: 'integer',
                value: tokenId,
                gte: 0,
                optional: true,
            },
        ]);
        const args = this._getTriggerSmartContractArgs(contractAddress, functionSelector, options, parameters, issuerAddress, tokenValue, tokenId, callValue, feeLimit);
        if (args.function_selector) {
            args.data = (0, ethersUtils_js_1.keccak256)(Buffer.from(args.function_selector, 'utf-8')).toString().substring(2, 10) + args.parameter;
        }
        const value = {
            data: args.data,
            owner_address: args.owner_address,
            contract_address: args.contract_address,
        };
        if (args.call_value) {
            value.call_value = args.call_value;
        }
        if (args.call_token_value) {
            value.call_token_value = args.call_token_value;
        }
        if (args.token_id) {
            value.token_id = args.token_id;
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        const transaction = await (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.TriggerSmartContract, value, options.permissionId, {
            ...transactionOptions,
            fee_limit: args.fee_limit,
        });
        return {
            result: {
                result: true,
            },
            transaction,
        };
    }
    async _triggerSmartContract(contractAddress, functionSelector, options = {}, parameters = [], issuerAddress = this.tronWeb.defaultAddress.hex) {
        const { tokenValue, tokenId, callValue, feeLimit } = Object.assign({
            callValue: 0,
            feeLimit: this.tronWeb.feeLimit,
        }, options);
        this.validator.notValid([
            {
                name: 'feeLimit',
                type: 'integer',
                value: feeLimit,
                gt: 0,
            },
            {
                name: 'callValue',
                type: 'integer',
                value: callValue,
                gte: 0,
            },
            {
                name: 'parameters',
                type: 'array',
                value: parameters,
            },
            {
                name: 'contract',
                type: 'address',
                value: contractAddress,
            },
            {
                name: 'issuer',
                type: 'address',
                value: issuerAddress,
                optional: true,
            },
            {
                name: 'tokenValue',
                type: 'integer',
                value: tokenValue,
                gte: 0,
                optional: true,
            },
            {
                name: 'tokenId',
                type: 'integer',
                value: tokenId,
                gte: 0,
                optional: true,
            },
        ]);
        const args = this._getTriggerSmartContractArgs(contractAddress, functionSelector, options, parameters, issuerAddress, tokenValue, tokenId, callValue, feeLimit);
        let pathInfo = 'triggersmartcontract';
        if (options._isConstant) {
            pathInfo = 'triggerconstantcontract';
        }
        else if (options.estimateEnergy) {
            pathInfo = 'estimateenergy';
        }
        pathInfo = `wallet${options.confirmed ? 'solidity' : ''}/${pathInfo}`;
        const transaction = await this.tronWeb[options.confirmed ? 'solidityNode' : 'fullNode'].request(pathInfo, args, 'post');
        return (0, helper_js_1.resultManagerTriggerSmartContract)(transaction, args, options);
    }
    async clearABI(contractAddress, ownerAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        if (!tronweb_js_1.TronWeb.isAddress(contractAddress))
            throw new Error('Invalid contract address provided');
        if (!tronweb_js_1.TronWeb.isAddress(ownerAddress))
            throw new Error('Invalid owner address provided');
        const data = {
            contract_address: (0, address_js_1.toHex)(contractAddress),
            owner_address: (0, address_js_1.toHex)(ownerAddress),
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (this.tronWeb.trx.cache.contracts[contractAddress]) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            delete this.tronWeb.trx.cache.contracts[contractAddress];
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.ClearABIContract, data, options?.permissionId, transactionOptions);
    }
    async updateBrokerage(brokerage, ownerAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        if (!(0, validations_js_1.isNotNullOrUndefined)(brokerage))
            throw new Error('Invalid brokerage provided');
        if (!(0, validations_js_1.isInteger)(brokerage) || brokerage < 0 || brokerage > 100)
            throw new Error('Brokerage must be an integer between 0 and 100');
        if (!tronweb_js_1.TronWeb.isAddress(ownerAddress))
            throw new Error('Invalid owner address provided');
        const data = {
            brokerage: parseInt(brokerage),
            owner_address: (0, address_js_1.toHex)(ownerAddress),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.UpdateBrokerageContract, data, options?.permissionId, transactionOptions);
    }
    async createToken(options = {}, issuerAddress = this.tronWeb.defaultAddress.hex) {
        const { name = false, abbreviation = false, description = '', url = false, totalSupply = 0, trxRatio = 1, // How much TRX will `tokenRatio` cost
        tokenRatio = 1, // How many tokens will `trxRatio` afford
        saleStart = Date.now(), saleEnd = false, freeBandwidth = 0, // The creator's "donated" bandwidth for use by token holders
        freeBandwidthLimit = 0, // Out of `totalFreeBandwidth`, the amount each token holder get
        frozenAmount = 0, frozenDuration = 0, 
        // for now there is no default for the following values
        voteScore, precision, } = options;
        this.validator.notValid([
            {
                name: 'Supply amount',
                type: 'positive-integer',
                value: totalSupply,
            },
            {
                name: 'TRX ratio',
                type: 'positive-integer',
                value: trxRatio,
            },
            {
                name: 'Token ratio',
                type: 'positive-integer',
                value: tokenRatio,
            },
            {
                name: 'token abbreviation',
                type: 'string',
                value: abbreviation,
                lte: 32,
                gt: 0,
            },
            {
                name: 'token name',
                type: 'not-empty-string',
                value: name,
            },
            {
                name: 'token description',
                type: 'string',
                value: description,
                lte: 200,
            },
            {
                name: 'token url',
                type: 'url',
                value: url,
            },
            {
                name: 'token url',
                type: 'string',
                value: url,
                lte: 256,
            },
            {
                name: 'issuer',
                type: 'address',
                value: issuerAddress,
            },
            {
                name: 'sale start timestamp',
                type: 'integer',
                value: saleStart,
                gte: Date.now(),
            },
            {
                name: 'sale end timestamp',
                type: 'integer',
                value: saleEnd,
                gt: saleStart,
            },
            {
                name: 'Frozen supply',
                type: 'integer',
                value: frozenAmount,
                gte: 0,
            },
            {
                name: 'Frozen duration',
                type: 'integer',
                value: frozenDuration,
                gte: 0,
            },
        ]);
        if ((0, validations_js_1.isNotNullOrUndefined)(voteScore) && (!(0, validations_js_1.isInteger)(voteScore) || voteScore <= 0))
            throw new Error('voteScore must be a positive integer greater than 0');
        if ((0, validations_js_1.isNotNullOrUndefined)(precision) && (!(0, validations_js_1.isInteger)(precision) || precision < 0 || precision > 6))
            throw new Error('precision must be a positive integer >= 0 and <= 6');
        const data = {
            owner_address: (0, address_js_1.toHex)(issuerAddress),
            name: (0, helper_js_1.fromUtf8)(name),
            abbr: (0, helper_js_1.fromUtf8)(abbreviation),
            description: (0, helper_js_1.fromUtf8)(description),
            url: (0, helper_js_1.fromUtf8)(url),
            total_supply: parseInt(totalSupply),
            trx_num: parseInt(trxRatio),
            num: parseInt(tokenRatio),
            start_time: parseInt(saleStart),
            end_time: parseInt(saleEnd),
            frozen_supply: [
                {
                    frozen_amount: parseInt(frozenAmount),
                    frozen_days: parseInt(frozenDuration),
                },
            ],
        };
        ['name', 'abbr', 'description', 'url'].forEach((key) => {
            if (!data[key]) {
                delete data[key];
            }
        });
        if (!(parseInt(frozenAmount) > 0)) {
            delete data.frozen_supply;
        }
        if (freeBandwidth && !isNaN(parseInt(freeBandwidth)) && parseInt(freeBandwidth) >= 0) {
            data.free_asset_net_limit = parseInt(freeBandwidth);
        }
        if (freeBandwidthLimit && !isNaN(parseInt(freeBandwidthLimit)) && parseInt(freeBandwidthLimit) >= 0) {
            data.public_free_asset_net_limit = parseInt(freeBandwidthLimit);
        }
        if (precision && !isNaN(parseInt(precision))) {
            data.precision = parseInt(precision);
        }
        if (voteScore && !isNaN(parseInt(voteScore))) {
            data.vote_score = parseInt(voteScore);
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.AssetIssueContract, data, options?.permissionId, transactionOptions);
    }
    async createAccount(accountAddress, address = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'account',
                type: 'address',
                value: accountAddress,
            },
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(address),
            account_address: (0, address_js_1.toHex)(accountAddress),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.AccountCreateContract, data, options?.permissionId, transactionOptions);
    }
    async updateAccount(accountName, address = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'Name',
                type: 'string',
                lte: 200,
                gt: 0,
                value: accountName,
                msg: 'Invalid accountName',
            },
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
        ]);
        const data = {
            account_name: (0, helper_js_1.fromUtf8)(accountName),
            owner_address: (0, address_js_1.toHex)(address),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.AccountUpdateContract, data, options?.permissionId, transactionOptions);
    }
    async setAccountId(accountId, address = this.tronWeb.defaultAddress.hex, options = {}) {
        if (accountId && (0, validations_js_1.isString)(accountId) && accountId.startsWith('0x')) {
            accountId = accountId.slice(2);
        }
        this.validator.notValid([
            {
                name: 'accountId',
                type: 'hex',
                value: accountId,
            },
            {
                name: 'accountId',
                type: 'string',
                lte: 32,
                gte: 8,
                value: accountId,
            },
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
        ]);
        const data = {
            account_id: accountId,
            owner_address: (0, address_js_1.toHex)(address),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.SetAccountIdContract, data, options?.permissionId, transactionOptions);
    }
    async updateToken(options = {}, issuerAddress = this.tronWeb.defaultAddress.hex) {
        const { description = '', url = false, freeBandwidth = 0, // The creator's "donated" bandwidth for use by token holders
        freeBandwidthLimit = 0, // Out of `totalFreeBandwidth`, the amount each token holder get
         } = options;
        this.validator.notValid([
            {
                name: 'token description',
                type: 'string',
                value: description,
                lte: 200,
            },
            {
                name: 'token url',
                type: 'url',
                value: url,
            },
            {
                name: 'token url',
                type: 'string',
                value: url,
                lte: 256,
            },
            {
                name: 'issuer',
                type: 'address',
                value: issuerAddress,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(issuerAddress),
            description: (0, helper_js_1.fromUtf8)(description),
            url: (0, helper_js_1.fromUtf8)(url),
        };
        if (freeBandwidth && !isNaN(parseInt(freeBandwidth)) && parseInt(freeBandwidth) >= 0) {
            data.new_limit = parseInt(freeBandwidth);
        }
        if (freeBandwidthLimit && !isNaN(parseInt(freeBandwidthLimit)) && parseInt(freeBandwidthLimit) >= 0) {
            data.new_public_limit = parseInt(freeBandwidthLimit);
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.UpdateAssetContract, data, options?.permissionId, transactionOptions);
    }
    async sendAsset(to, amount = 0, tokenId, from = this.tronWeb.defaultAddress.hex, options = {}) {
        return this.sendToken(to, amount, tokenId, from, options);
    }
    async purchaseAsset(issuerAddress, tokenId, amount = 0, buyer = this.tronWeb.defaultAddress.hex, options = {}) {
        return this.purchaseToken(issuerAddress, tokenId, amount, buyer, options);
    }
    async createAsset(options, issuerAddress) {
        return this.createToken(options, issuerAddress);
    }
    async updateAsset(options = {}, issuerAddress = this.tronWeb.defaultAddress.hex) {
        return this.updateToken(options, issuerAddress);
    }
    /**
     * Creates a proposal to modify the network.
     * Can only be created by a current Super Representative.
     */
    async createProposal(parameters, issuerAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'issuer',
                type: 'address',
                value: issuerAddress,
            },
        ]);
        const invalid = 'Invalid proposal parameters provided';
        if (!parameters)
            throw new Error(invalid);
        const newParams = (0, validations_js_1.isArray)(parameters) ? parameters : [parameters];
        for (const parameter of newParams) {
            if (!(0, validations_js_1.isObject)(parameter))
                throw new Error(invalid);
        }
        const data = {
            owner_address: (0, address_js_1.toHex)(issuerAddress),
            parameters: newParams,
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.ProposalCreateContract, data, options?.permissionId, transactionOptions);
    }
    /**
     * Deletes a network modification proposal that the owner issued.
     * Only current Super Representative can vote on a proposal.
     */
    async deleteProposal(proposalID, issuerAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'issuer',
                type: 'address',
                value: issuerAddress,
            },
            {
                name: 'proposalID',
                type: 'integer',
                value: proposalID,
                gte: 0,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(issuerAddress),
            proposal_id: parseInt(proposalID),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.ProposalDeleteContract, data, options?.permissionId, transactionOptions);
    }
    /**
     * Adds a vote to an issued network modification proposal.
     * Only current Super Representative can vote on a proposal.
     */
    async voteProposal(proposalID, isApproval = false, voterAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'voter',
                type: 'address',
                value: voterAddress,
            },
            {
                name: 'proposalID',
                type: 'integer',
                value: proposalID,
                gte: 0,
            },
            {
                name: 'has approval',
                type: 'boolean',
                value: isApproval,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(voterAddress),
            proposal_id: parseInt(proposalID),
            is_add_approval: isApproval,
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.ProposalApproveContract, data, options?.permissionId, transactionOptions);
    }
    /**
     * Create an exchange between a token and TRX.
     * Token Name should be a CASE SENSITIVE string.
     * PLEASE VERIFY THIS ON TRONSCAN.
     */
    async createTRXExchange(tokenName, tokenBalance, trxBalance, ownerAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'owner',
                type: 'address',
                value: ownerAddress,
            },
            {
                name: 'token name',
                type: 'not-empty-string',
                value: tokenName,
            },
            {
                name: 'token balance',
                type: 'positive-integer',
                value: tokenBalance,
            },
            {
                name: 'trx balance',
                type: 'positive-integer',
                value: trxBalance,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(ownerAddress),
            first_token_id: (0, helper_js_1.fromUtf8)(tokenName),
            first_token_balance: tokenBalance,
            second_token_id: '5f', // Constant for TRX.
            second_token_balance: trxBalance,
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.ExchangeCreateContract, data, options?.permissionId, transactionOptions);
    }
    /**
     * Create an exchange between a token and another token.
     * DO NOT USE THIS FOR TRX.
     * Token Names should be a CASE SENSITIVE string.
     * PLEASE VERIFY THIS ON TRONSCAN.
     */
    async createTokenExchange(firstTokenName, firstTokenBalance, secondTokenName, secondTokenBalance, ownerAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'owner',
                type: 'address',
                value: ownerAddress,
            },
            {
                name: 'first token name',
                type: 'not-empty-string',
                value: firstTokenName,
            },
            {
                name: 'second token name',
                type: 'not-empty-string',
                value: secondTokenName,
            },
            {
                name: 'first token balance',
                type: 'positive-integer',
                value: firstTokenBalance,
            },
            {
                name: 'second token balance',
                type: 'positive-integer',
                value: secondTokenBalance,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(ownerAddress),
            first_token_id: (0, helper_js_1.fromUtf8)(firstTokenName),
            first_token_balance: firstTokenBalance,
            second_token_id: (0, helper_js_1.fromUtf8)(secondTokenName),
            second_token_balance: secondTokenBalance,
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.ExchangeCreateContract, data, options?.permissionId, transactionOptions);
    }
    /**
     * Adds tokens into a bancor style exchange.
     * Will add both tokens at market rate.
     * Use "_" for the constant value for TRX.
     */
    async injectExchangeTokens(exchangeID, tokenName, tokenAmount, ownerAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'owner',
                type: 'address',
                value: ownerAddress,
            },
            {
                name: 'token name',
                type: 'not-empty-string',
                value: tokenName,
            },
            {
                name: 'token amount',
                type: 'integer',
                value: tokenAmount,
                gte: 1,
            },
            {
                name: 'exchangeID',
                type: 'integer',
                value: exchangeID,
                gte: 0,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(ownerAddress),
            exchange_id: parseInt(exchangeID),
            token_id: (0, helper_js_1.fromUtf8)(tokenName),
            quant: parseInt(tokenAmount),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.ExchangeInjectContract, data, options?.permissionId, transactionOptions);
    }
    /**
     * Withdraws tokens from a bancor style exchange.
     * Will withdraw at market rate both tokens.
     * Use "_" for the constant value for TRX.
     */
    async withdrawExchangeTokens(exchangeID, tokenName, tokenAmount, ownerAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'owner',
                type: 'address',
                value: ownerAddress,
            },
            {
                name: 'token name',
                type: 'not-empty-string',
                value: tokenName,
            },
            {
                name: 'token amount',
                type: 'integer',
                value: tokenAmount,
                gte: 1,
            },
            {
                name: 'exchangeID',
                type: 'integer',
                value: exchangeID,
                gte: 0,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(ownerAddress),
            exchange_id: parseInt(exchangeID),
            token_id: (0, helper_js_1.fromUtf8)(tokenName),
            quant: parseInt(tokenAmount),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.ExchangeWithdrawContract, data, options?.permissionId, transactionOptions);
    }
    /**
     * Trade tokens on a bancor style exchange.
     * Expected value is a validation and used to cap the total amt of token 2 spent.
     * Use "_" for the constant value for TRX.
     */
    async tradeExchangeTokens(exchangeID, tokenName, tokenAmountSold, tokenAmountExpected, ownerAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'owner',
                type: 'address',
                value: ownerAddress,
            },
            {
                name: 'token name',
                type: 'not-empty-string',
                value: tokenName,
            },
            {
                name: 'tokenAmountSold',
                type: 'integer',
                value: tokenAmountSold,
                gte: 1,
            },
            {
                name: 'tokenAmountExpected',
                type: 'integer',
                value: tokenAmountExpected,
                gte: 1,
            },
            {
                name: 'exchangeID',
                type: 'integer',
                value: exchangeID,
                gte: 0,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(ownerAddress),
            exchange_id: parseInt(exchangeID),
            token_id: tronweb_js_1.TronWeb.fromAscii(tokenName).replace(/^0x/, ''),
            quant: parseInt(tokenAmountSold),
            expected: parseInt(tokenAmountExpected),
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.ExchangeTransactionContract, data, options?.permissionId, transactionOptions);
    }
    /**
     * Update userFeePercentage.
     */
    async updateSetting(contractAddress, userFeePercentage, ownerAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'owner',
                type: 'address',
                value: ownerAddress,
            },
            {
                name: 'contract',
                type: 'address',
                value: contractAddress,
            },
            {
                name: 'userFeePercentage',
                type: 'integer',
                value: userFeePercentage,
                gte: 0,
                lte: 100,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(ownerAddress),
            contract_address: (0, address_js_1.toHex)(contractAddress),
            consume_user_resource_percent: userFeePercentage,
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.UpdateSettingContract, data, options?.permissionId, transactionOptions);
    }
    /**
     * Update energy limit.
     */
    async updateEnergyLimit(contractAddress, originEnergyLimit = 0, ownerAddress = this.tronWeb.defaultAddress.hex, options = {}) {
        this.validator.notValid([
            {
                name: 'owner',
                type: 'address',
                value: ownerAddress,
            },
            {
                name: 'contract',
                type: 'address',
                value: contractAddress,
            },
            {
                name: 'originEnergyLimit',
                type: 'integer',
                value: originEnergyLimit,
                gte: 0,
                lte: 10_000_000,
            },
        ]);
        const data = {
            owner_address: (0, address_js_1.toHex)(ownerAddress),
            contract_address: (0, address_js_1.toHex)(contractAddress),
            origin_energy_limit: originEnergyLimit,
        };
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.UpdateEnergyLimitContract, data, options?.permissionId, transactionOptions);
    }
    checkPermissions(permissions, type) {
        if (permissions) {
            if (permissions.type !== type ||
                !permissions.permission_name ||
                !(0, validations_js_1.isString)(permissions.permission_name) ||
                !(0, validations_js_1.isInteger)(permissions.threshold) ||
                permissions.threshold < 1 ||
                !permissions.keys) {
                return false;
            }
            for (const key of permissions.keys) {
                if (!tronweb_js_1.TronWeb.isAddress(key.address) ||
                    !(0, validations_js_1.isInteger)(key.weight) ||
                    key.weight > permissions.threshold ||
                    key.weight < 1 ||
                    (type === 2 && !permissions.operations)) {
                    return false;
                }
            }
        }
        return true;
    }
    async updateAccountPermissions(ownerAddress = this.tronWeb.defaultAddress.hex, ownerPermission, witnessPermission, activesPermissions, options = {}) {
        if (!tronweb_js_1.TronWeb.isAddress(ownerAddress))
            throw new Error('Invalid ownerAddress provided');
        if (!this.checkPermissions(ownerPermission, 0)) {
            throw new Error('Invalid ownerPermissions provided');
        }
        if (!this.checkPermissions(witnessPermission, 1)) {
            throw new Error('Invalid witnessPermissions provided');
        }
        if (!Array.isArray(activesPermissions)) {
            activesPermissions = [activesPermissions];
        }
        for (const activesPermission of activesPermissions) {
            if (!this.checkPermissions(activesPermission, 2)) {
                throw new Error('Invalid activesPermissions provided');
            }
        }
        const data = {
            owner_address: (0, address_js_1.toHex)(ownerAddress),
        };
        if (ownerPermission) {
            const _ownerPermissions = (0, helper_js_1.deepCopyJson)(ownerPermission);
            // for compatible with old way of building transaction from chain which type prop is omitted
            if ('type' in _ownerPermissions) {
                delete _ownerPermissions.type;
            }
            _ownerPermissions.keys = _ownerPermissions.keys?.map(({ address, weight }) => ({
                address: this.tronWeb.address.toHex(address),
                weight,
            }));
            data.owner = _ownerPermissions;
        }
        if (witnessPermission) {
            const _witnessPermissions = (0, helper_js_1.deepCopyJson)(witnessPermission);
            // for compatible with old way of building transaction from chain which type prop is Witness
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _witnessPermissions.type = 'Witness';
            _witnessPermissions.keys = _witnessPermissions.keys.map(({ address, weight }) => ({
                address: this.tronWeb.address.toHex(address),
                weight,
            }));
            data.witness = _witnessPermissions;
        }
        if (activesPermissions) {
            const _activesPermissions = (0, helper_js_1.deepCopyJson)(activesPermissions);
            // for compatible with old way of building transaction from chain which type prop is Active
            _activesPermissions.forEach((activePermissions) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                activePermissions.type = 'Active';
            });
            _activesPermissions.forEach((_activesPermission) => {
                _activesPermission.keys = _activesPermission.keys.map(({ address, weight }) => ({
                    address: this.tronWeb.address.toHex(address),
                    weight,
                }));
            });
            data.actives = _activesPermissions;
        }
        const transactionOptions = (0, helper_js_1.getTransactionOptions)(options);
        return (0, helper_js_1.createTransaction)(this.tronWeb, Contract_js_1.ContractType.AccountPermissionUpdateContract, data, options?.permissionId, transactionOptions);
    }
    async newTxID(transaction, options = {}) {
        if (options?.txLocal) {
            const contract = transaction.raw_data.contract[0];
            try {
                const tx = await (0, helper_js_1.createTransaction)(this.tronWeb, contract.type, contract.parameter.value, contract.Permission_id, {
                    fee_limit: transaction.raw_data.fee_limit,
                    data: transaction.raw_data.data,
                    ref_block_bytes: transaction.raw_data.ref_block_bytes,
                    ref_block_hash: transaction.raw_data.ref_block_hash,
                    expiration: transaction.raw_data.expiration,
                    timestamp: transaction.raw_data.timestamp,
                });
                tx.signature = transaction.signature;
                tx.visible = transaction.visible;
                return tx;
            }
            catch (e) {
                throw new Error('Error generating a new transaction id.');
            }
        }
        try {
            const res = await this.tronWeb.fullNode.request('wallet/getsignweight', transaction, 'post');
            if (typeof transaction.visible === 'boolean') {
                res.transaction.transaction.visible = transaction.visible;
            }
            return (0, helper_js_1.resultManager)(res.transaction.transaction, {
                ...transaction.raw_data.contract[0].parameter.value,
                Permission_id: transaction.raw_data.contract[0].Permission_id,
            }, 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /* @ts-ignore */
            { data: transaction.raw_data.data, fee_limit: transaction.raw_data.fee_limit });
        }
        catch (e) {
            throw new Error('Error generating a new transaction id.');
        }
    }
    async alterTransaction(transaction, options = {}) {
        if (Reflect.has(transaction, 'signature'))
            throw new Error('You can not extend the expiration of a signed transaction.');
        if (options.data) {
            if (options.dataFormat !== 'hex')
                options.data = tronweb_js_1.TronWeb.toHex(options.data);
            options.data = options.data.replace(/^0x/, '');
            if (options.data.length === 0)
                throw new Error('Invalid data provided');
            transaction.raw_data.data = options.data;
        }
        if (options.extension) {
            options.extension = parseInt(options.extension * 1000);
            if (isNaN(options.extension) || transaction.raw_data.expiration + options.extension <= Date.now() + 3000)
                throw new Error('Invalid extension provided');
            transaction.raw_data.expiration += options.extension;
        }
        return await this.newTxID(transaction, { txLocal: options.txLocal });
    }
    async extendExpiration(transaction, extension, options = {}) {
        return await this.alterTransaction(transaction, { extension, txLocal: options?.txLocal });
    }
    async addUpdateData(transaction, data, dataFormat = 'utf8', options = {}) {
        return this.alterTransaction(transaction, { data, dataFormat: dataFormat, txLocal: options?.txLocal });
    }
}
exports.TransactionBuilder = TransactionBuilder;
//# sourceMappingURL=TransactionBuilder.js.map