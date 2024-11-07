"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trx = void 0;
const tslib_1 = require("tslib");
const tronweb_js_1 = require("../tronweb.js");
const index_js_1 = tslib_1.__importDefault(require("../utils/index.js"));
const ethersUtils_js_1 = require("../utils/ethersUtils.js");
const address_js_1 = require("../utils/address.js");
const index_js_2 = require("../paramValidator/index.js");
const transaction_js_1 = require("../utils/transaction.js");
const crypto_js_1 = require("../utils/crypto.js");
const TRX_MESSAGE_HEADER = '\x19TRON Signed Message:\n32';
// it should be: '\x15TRON Signed Message:\n32';
const ETH_MESSAGE_HEADER = '\x19Ethereum Signed Message:\n32';
function toHex(value) {
    return tronweb_js_1.TronWeb.address.toHex(value);
}
class Trx {
    tronWeb;
    cache;
    validator;
    signMessage;
    sendAsset;
    send;
    sendTrx;
    broadcast;
    broadcastHex;
    signTransaction;
    constructor(tronWeb) {
        this.tronWeb = tronWeb;
        this.cache = {
            contracts: {},
        };
        this.validator = new index_js_2.Validator();
        this.signMessage = this.sign;
        this.sendAsset = this.sendToken;
        this.send = this.sendTransaction;
        this.sendTrx = this.sendTransaction;
        this.broadcast = this.sendRawTransaction;
        this.broadcastHex = this.sendHexTransaction;
        this.signTransaction = this.sign;
    }
    _parseToken(token) {
        return {
            ...token,
            name: this.tronWeb.toUtf8(token.name),
            abbr: token.abbr && this.tronWeb.toUtf8(token.abbr),
            description: token.description && this.tronWeb.toUtf8(token.description),
            url: token.url && this.tronWeb.toUtf8(token.url),
        };
    }
    getCurrentBlock() {
        return this.tronWeb.fullNode.request('wallet/getnowblock');
    }
    getConfirmedCurrentBlock() {
        return this.tronWeb.solidityNode.request('walletsolidity/getnowblock');
    }
    async getBlock(block = this.tronWeb.defaultBlock) {
        if (block === false) {
            throw new Error('No block identifier provided');
        }
        if (block == 'earliest')
            block = 0;
        if (block == 'latest')
            return this.getCurrentBlock();
        if (isNaN(+block) && index_js_1.default.isHex(block.toString()))
            return this.getBlockByHash(block);
        return this.getBlockByNumber(block);
    }
    async getBlockByHash(blockHash) {
        const block = await this.tronWeb.fullNode.request('wallet/getblockbyid', {
            value: blockHash,
        }, 'post');
        if (!Object.keys(block).length) {
            throw new Error('Block not found');
        }
        return block;
    }
    async getBlockByNumber(blockID) {
        if (!index_js_1.default.isInteger(blockID) || blockID < 0) {
            throw new Error('Invalid block number provided');
        }
        return this.tronWeb.fullNode
            .request('wallet/getblockbynum', {
            num: parseInt(blockID),
        }, 'post')
            .then((block) => {
            if (!Object.keys(block).length) {
                throw new Error('Block not found');
            }
            return block;
        });
    }
    async getBlockTransactionCount(block = this.tronWeb.defaultBlock) {
        const { transactions = [] } = await this.getBlock(block);
        return transactions.length;
    }
    async getTransactionFromBlock(block = this.tronWeb.defaultBlock, index) {
        const { transactions } = await this.getBlock(block);
        if (!transactions) {
            throw new Error('Transaction not found in block');
        }
        if (index >= 0 && index < transactions.length)
            return transactions[index];
        else
            throw new Error('Invalid transaction index provided');
    }
    async getTransactionsFromBlock(block = this.tronWeb.defaultBlock) {
        const { transactions } = await this.getBlock(block);
        if (!transactions) {
            throw new Error('Transaction not found in block');
        }
        return transactions;
    }
    async getTransaction(transactionID) {
        const transaction = await this.tronWeb.fullNode.request('wallet/gettransactionbyid', {
            value: transactionID,
        }, 'post');
        if (!Object.keys(transaction).length) {
            throw new Error('Transaction not found');
        }
        return transaction;
    }
    async getConfirmedTransaction(transactionID) {
        const transaction = await this.tronWeb.solidityNode.request('walletsolidity/gettransactionbyid', {
            value: transactionID,
        }, 'post');
        if (!Object.keys(transaction).length) {
            throw new Error('Transaction not found');
        }
        return transaction;
    }
    getUnconfirmedTransactionInfo(transactionID) {
        return this.tronWeb.fullNode.request('wallet/gettransactioninfobyid', { value: transactionID }, 'post');
    }
    getTransactionInfo(transactionID) {
        return this.tronWeb.solidityNode.request('walletsolidity/gettransactioninfobyid', { value: transactionID }, 'post');
    }
    getTransactionsToAddress(address = this.tronWeb.defaultAddress.hex, limit = 30, offset = 0) {
        return this.getTransactionsRelated(this.tronWeb.address.toHex(address), 'to', limit, offset);
    }
    getTransactionsFromAddress(address = this.tronWeb.defaultAddress.hex, limit = 30, offset = 0) {
        return this.getTransactionsRelated(this.tronWeb.address.toHex(address), 'from', limit, offset);
    }
    async getTransactionsRelated(address = this.tronWeb.defaultAddress.hex, direction = 'all', limit = 30, offset = 0) {
        if (!['to', 'from', 'all'].includes(direction)) {
            throw new Error('Invalid direction provided: Expected "to", "from" or "all"');
        }
        if (direction == 'all') {
            const [from, to] = await Promise.all([
                this.getTransactionsRelated(address, 'from', limit, offset),
                this.getTransactionsRelated(address, 'to', limit, offset),
            ]);
            return [
                ...from.map((tx) => ((tx.direction = 'from'), tx)),
                ...to.map((tx) => ((tx.direction = 'to'), tx)),
            ].sort((a, b) => {
                return b.raw_data.timestamp - a.raw_data.timestamp;
            });
        }
        if (!this.tronWeb.isAddress(address)) {
            throw new Error('Invalid address provided');
        }
        if (!index_js_1.default.isInteger(limit) || limit < 0 || (offset && limit < 1)) {
            throw new Error('Invalid limit provided');
        }
        if (!index_js_1.default.isInteger(offset) || offset < 0) {
            throw new Error('Invalid offset provided');
        }
        address = this.tronWeb.address.toHex(address);
        return this.tronWeb.solidityNode
            .request(`walletextension/gettransactions${direction}this`, {
            account: {
                address,
            },
            offset,
            limit,
        }, 'post')
            .then(({ transaction }) => {
            return transaction;
        });
    }
    async getAccount(address = this.tronWeb.defaultAddress.hex) {
        if (!this.tronWeb.isAddress(address)) {
            throw new Error('Invalid address provided');
        }
        address = this.tronWeb.address.toHex(address);
        return this.tronWeb.solidityNode.request('walletsolidity/getaccount', {
            address,
        }, 'post');
    }
    getAccountById(id) {
        return this.getAccountInfoById(id, { confirmed: true });
    }
    async getAccountInfoById(id, options) {
        this.validator.notValid([
            {
                name: 'accountId',
                type: 'hex',
                value: id,
            },
            {
                name: 'accountId',
                type: 'string',
                lte: 32,
                gte: 8,
                value: id,
            },
        ]);
        if (id.startsWith('0x')) {
            id = id.slice(2);
        }
        return this.tronWeb[options.confirmed ? 'solidityNode' : 'fullNode'].request(`wallet${options.confirmed ? 'solidity' : ''}/getaccountbyid`, {
            account_id: id,
        }, 'post');
    }
    async getBalance(address = this.tronWeb.defaultAddress.hex) {
        const { balance = 0 } = await this.getAccount(address);
        return balance;
    }
    async getUnconfirmedAccount(address = this.tronWeb.defaultAddress.hex) {
        if (!this.tronWeb.isAddress(address)) {
            throw new Error('Invalid address provided');
        }
        address = this.tronWeb.address.toHex(address);
        return this.tronWeb.fullNode.request('wallet/getaccount', {
            address,
        }, 'post');
    }
    getUnconfirmedAccountById(id) {
        return this.getAccountInfoById(id, { confirmed: false });
    }
    async getUnconfirmedBalance(address = this.tronWeb.defaultAddress.hex) {
        const { balance = 0 } = await this.getUnconfirmedAccount(address);
        return balance;
    }
    async getBandwidth(address = this.tronWeb.defaultAddress.hex) {
        if (!this.tronWeb.isAddress(address)) {
            throw new Error('Invalid address provided');
        }
        address = this.tronWeb.address.toHex(address);
        return this.tronWeb.fullNode
            .request('wallet/getaccountnet', {
            address,
        }, 'post')
            .then(({ freeNetUsed = 0, freeNetLimit = 0, NetUsed = 0, NetLimit = 0 }) => {
            return freeNetLimit - freeNetUsed + (NetLimit - NetUsed);
        });
    }
    async getTokensIssuedByAddress(address = this.tronWeb.defaultAddress.hex) {
        if (!this.tronWeb.isAddress(address)) {
            throw new Error('Invalid address provided');
        }
        address = this.tronWeb.address.toHex(address);
        return this.tronWeb.fullNode
            .request('wallet/getassetissuebyaccount', {
            address,
        }, 'post')
            .then(({ assetIssue }) => {
            if (!assetIssue)
                return {};
            const tokens = assetIssue
                .map((token) => {
                return this._parseToken(token);
            })
                .reduce((tokens, token) => {
                return (tokens[token.name] = token), tokens;
            }, {});
            return tokens;
        });
    }
    async getTokenFromID(tokenID) {
        if (index_js_1.default.isInteger(tokenID))
            tokenID = tokenID.toString();
        if (!index_js_1.default.isString(tokenID) || !tokenID.length) {
            throw new Error('Invalid token ID provided');
        }
        return this.tronWeb.fullNode
            .request('wallet/getassetissuebyname', {
            value: this.tronWeb.fromUtf8(tokenID),
        }, 'post')
            .then((token) => {
            if (!token.name) {
                throw new Error('Token does not exist');
            }
            return this._parseToken(token);
        });
    }
    async listNodes() {
        const { nodes = [] } = await this.tronWeb.fullNode.request('wallet/listnodes');
        return nodes.map(({ address: { host, port } }) => `${this.tronWeb.toUtf8(host)}:${port}`);
    }
    async getBlockRange(start = 0, end = 30) {
        if (!index_js_1.default.isInteger(start) || start < 0) {
            throw new Error('Invalid start of range provided');
        }
        if (!index_js_1.default.isInteger(end) || end < start) {
            throw new Error('Invalid end of range provided');
        }
        if (end + 1 - start > 100) {
            throw new Error('Invalid range size, which should be no more than 100.');
        }
        return this.tronWeb.fullNode
            .request('wallet/getblockbylimitnext', {
            startNum: parseInt(start),
            endNum: parseInt(end) + 1,
        }, 'post')
            .then(({ block = [] }) => block);
    }
    async listSuperRepresentatives() {
        const { witnesses = [] } = await this.tronWeb.fullNode.request('wallet/listwitnesses');
        return witnesses;
    }
    async listTokens(limit = 0, offset = 0) {
        if (!index_js_1.default.isInteger(limit) || limit < 0 || (offset && limit < 1)) {
            throw new Error('Invalid limit provided');
        }
        if (!index_js_1.default.isInteger(offset) || offset < 0) {
            throw new Error('Invalid offset provided');
        }
        if (!limit) {
            return this.tronWeb.fullNode
                .request('wallet/getassetissuelist')
                .then(({ assetIssue = [] }) => assetIssue.map((token) => this._parseToken(token)));
        }
        return this.tronWeb.fullNode
            .request('wallet/getpaginatedassetissuelist', {
            offset: parseInt(offset),
            limit: parseInt(limit),
        }, 'post')
            .then(({ assetIssue = [] }) => assetIssue.map((token) => this._parseToken(token)));
    }
    async timeUntilNextVoteCycle() {
        const { num = -1 } = await this.tronWeb.fullNode.request('wallet/getnextmaintenancetime');
        if (num == -1) {
            throw new Error('Failed to get time until next vote cycle');
        }
        return Math.floor(num / 1000);
    }
    async getContract(contractAddress) {
        if (!this.tronWeb.isAddress(contractAddress)) {
            throw new Error('Invalid contract address provided');
        }
        if (this.cache.contracts[contractAddress]) {
            return this.cache.contracts[contractAddress];
        }
        contractAddress = this.tronWeb.address.toHex(contractAddress);
        const contract = await this.tronWeb.fullNode.request('wallet/getcontract', {
            value: contractAddress,
        });
        if (contract.Error) {
            throw new Error('Contract does not exist');
        }
        this.cache.contracts[contractAddress] = contract;
        return contract;
    }
    ecRecover(transaction) {
        return Trx.ecRecover(transaction);
    }
    static ecRecover(transaction) {
        if (!(0, transaction_js_1.txCheck)(transaction)) {
            throw new Error('Invalid transaction');
        }
        if (!transaction.signature?.length) {
            throw new Error('Transaction is not signed');
        }
        if (transaction.signature.length === 1) {
            const tronAddress = (0, crypto_js_1.ecRecover)(transaction.txID, transaction.signature[0]);
            return tronweb_js_1.TronWeb.address.fromHex(tronAddress);
        }
        return transaction.signature.map((sig) => {
            const tronAddress = (0, crypto_js_1.ecRecover)(transaction.txID, sig);
            return tronweb_js_1.TronWeb.address.fromHex(tronAddress);
        });
    }
    async verifyMessage(message, signature, address = this.tronWeb.defaultAddress.base58, useTronHeader = true) {
        if (!index_js_1.default.isHex(message)) {
            throw new Error('Expected hex message input');
        }
        if (Trx.verifySignature(message, address, signature, useTronHeader)) {
            return true;
        }
        throw new Error('Signature does not match');
    }
    static verifySignature(message, address, signature, useTronHeader = true) {
        message = message.replace(/^0x/, '');
        const messageBytes = [
            ...(0, ethersUtils_js_1.toUtf8Bytes)(useTronHeader ? TRX_MESSAGE_HEADER : ETH_MESSAGE_HEADER),
            ...index_js_1.default.code.hexStr2byteArray(message),
        ];
        const messageDigest = (0, ethersUtils_js_1.keccak256)(new Uint8Array(messageBytes));
        const recovered = (0, ethersUtils_js_1.recoverAddress)(messageDigest, ethersUtils_js_1.Signature.from(`0x${signature.replace(/^0x/, '')}`));
        const tronAddress = address_js_1.ADDRESS_PREFIX + recovered.substr(2);
        const base58Address = tronweb_js_1.TronWeb.address.fromHex(tronAddress);
        return base58Address == tronweb_js_1.TronWeb.address.fromHex(address);
    }
    async verifyMessageV2(message, signature) {
        return Trx.verifyMessageV2(message, signature);
    }
    static verifyMessageV2(message, signature) {
        return index_js_1.default.message.verifyMessage(message, signature);
    }
    verifyTypedData(domain, types, value, signature, address = this.tronWeb.defaultAddress.base58) {
        if (Trx.verifyTypedData(domain, types, value, signature, address))
            return true;
        throw new Error('Signature does not match');
    }
    static verifyTypedData(domain, types, value, signature, address) {
        const messageDigest = index_js_1.default._TypedDataEncoder.hash(domain, types, value);
        const recovered = (0, ethersUtils_js_1.recoverAddress)(messageDigest, ethersUtils_js_1.Signature.from(`0x${signature.replace(/^0x/, '')}`));
        const tronAddress = address_js_1.ADDRESS_PREFIX + recovered.substr(2);
        const base58Address = tronweb_js_1.TronWeb.address.fromHex(tronAddress);
        return base58Address == tronweb_js_1.TronWeb.address.fromHex(address);
    }
    async sign(transaction, privateKey = this.tronWeb.defaultPrivateKey, useTronHeader = true, multisig = false) {
        // Message signing
        if (index_js_1.default.isString(transaction)) {
            if (!index_js_1.default.isHex(transaction)) {
                throw new Error('Expected hex message input');
            }
            return Trx.signString(transaction, privateKey, useTronHeader);
        }
        if (!index_js_1.default.isObject(transaction)) {
            throw new Error('Invalid transaction provided');
        }
        if (!multisig && transaction.signature) {
            throw new Error('Transaction is already signed');
        }
        if (!multisig) {
            const address = this.tronWeb.address
                .toHex(this.tronWeb.address.fromPrivateKey(privateKey))
                .toLowerCase();
            if (address !== this.tronWeb.address.toHex(transaction.raw_data.contract[0].parameter.value.owner_address)) {
                throw new Error('Private key does not match address in transaction');
            }
            if (!(0, transaction_js_1.txCheck)(transaction)) {
                throw new Error('Invalid transaction');
            }
        }
        return index_js_1.default.crypto.signTransaction(privateKey, transaction);
    }
    static signString(message, privateKey, useTronHeader = true) {
        message = message.replace(/^0x/, '');
        const value = `0x${privateKey.replace(/^0x/, '')}`;
        const signingKey = new ethersUtils_js_1.SigningKey(value);
        const messageBytes = [
            ...(0, ethersUtils_js_1.toUtf8Bytes)(useTronHeader ? TRX_MESSAGE_HEADER : ETH_MESSAGE_HEADER),
            ...index_js_1.default.code.hexStr2byteArray(message),
        ];
        const messageDigest = (0, ethersUtils_js_1.keccak256)(new Uint8Array(messageBytes));
        const signature = signingKey.sign(messageDigest);
        const signatureHex = ['0x', signature.r.substring(2), signature.s.substring(2), Number(signature.v).toString(16)].join('');
        return signatureHex;
    }
    /**
     * sign message v2 for verified header length
     *
     * @param {message to be signed, should be Bytes or string} message
     * @param {privateKey for signature} privateKey
     * @param {reserved} options
     */
    signMessageV2(message, privateKey = this.tronWeb.defaultPrivateKey) {
        return Trx.signMessageV2(message, privateKey);
    }
    static signMessageV2(message, privateKey) {
        return index_js_1.default.message.signMessage(message, privateKey);
    }
    _signTypedData(domain, types, value, privateKey = this.tronWeb.defaultPrivateKey) {
        return Trx._signTypedData(domain, types, value, privateKey);
    }
    static _signTypedData(domain, types, value, privateKey) {
        return index_js_1.default.crypto._signTypedData(domain, types, value, privateKey);
    }
    async multiSign(transaction, privateKey = this.tronWeb.defaultPrivateKey, permissionId = 0) {
        if (!index_js_1.default.isObject(transaction) || !transaction.raw_data || !transaction.raw_data.contract) {
            throw new Error('Invalid transaction provided');
        }
        // If owner permission or permission id exists in transaction, do sign directly
        // If no permission id inside transaction or user passes permission id, use old way to reset permission id
        if (!transaction.raw_data.contract[0].Permission_id && permissionId > 0) {
            // set permission id
            transaction.raw_data.contract[0].Permission_id = permissionId;
            // check if private key insides permission list
            const address = this.tronWeb.address
                .toHex(this.tronWeb.address.fromPrivateKey(privateKey))
                .toLowerCase();
            const signWeight = await this.getSignWeight(transaction, permissionId);
            if (signWeight.result.code === 'PERMISSION_ERROR') {
                throw new Error(signWeight.result.message);
            }
            let foundKey = false;
            signWeight.permission.keys.map((key) => {
                if (key.address === address)
                    foundKey = true;
            });
            if (!foundKey) {
                throw new Error(privateKey + ' has no permission to sign');
            }
            if (signWeight.approved_list && signWeight.approved_list.indexOf(address) != -1) {
                throw new Error(privateKey + ' already sign transaction');
            }
            // reset transaction
            if (signWeight.transaction && signWeight.transaction.transaction) {
                transaction = signWeight.transaction.transaction;
                if (permissionId > 0) {
                    transaction.raw_data.contract[0].Permission_id = permissionId;
                }
            }
            else {
                throw new Error('Invalid transaction provided');
            }
        }
        // sign
        if (!(0, transaction_js_1.txCheck)(transaction)) {
            throw new Error('Invalid transaction');
        }
        return index_js_1.default.crypto.signTransaction(privateKey, transaction);
    }
    async getApprovedList(transaction) {
        if (!index_js_1.default.isObject(transaction)) {
            throw new Error('Invalid transaction provided');
        }
        return this.tronWeb.fullNode.request('wallet/getapprovedlist', transaction, 'post');
    }
    async getSignWeight(transaction, permissionId) {
        if (!index_js_1.default.isObject(transaction) || !transaction.raw_data || !transaction.raw_data.contract)
            throw new Error('Invalid transaction provided');
        if (index_js_1.default.isInteger(permissionId)) {
            transaction.raw_data.contract[0].Permission_id = parseInt(permissionId);
        }
        else if (typeof transaction.raw_data.contract[0].Permission_id !== 'number') {
            transaction.raw_data.contract[0].Permission_id = 0;
        }
        return this.tronWeb.fullNode.request('wallet/getsignweight', transaction, 'post');
    }
    async sendRawTransaction(signedTransaction) {
        if (!index_js_1.default.isObject(signedTransaction)) {
            throw new Error('Invalid transaction provided');
        }
        if (!signedTransaction.signature || !index_js_1.default.isArray(signedTransaction.signature)) {
            throw new Error('Transaction is not signed');
        }
        const result = await this.tronWeb.fullNode.request('wallet/broadcasttransaction', signedTransaction, 'post');
        return {
            ...result,
            transaction: signedTransaction,
        };
    }
    async sendHexTransaction(signedHexTransaction) {
        if (!index_js_1.default.isHex(signedHexTransaction)) {
            throw new Error('Invalid hex transaction provided');
        }
        const params = {
            transaction: signedHexTransaction,
        };
        const result = await this.tronWeb.fullNode.request('wallet/broadcasthex', params, 'post');
        if (result.result) {
            return {
                ...result,
                transaction: JSON.parse(result.transaction),
                hexTransaction: signedHexTransaction,
            };
        }
        return result;
    }
    async sendTransaction(to, amount, options = {}) {
        if (typeof options === 'string')
            options = { privateKey: options };
        if (!this.tronWeb.isAddress(to)) {
            throw new Error('Invalid recipient provided');
        }
        if (!index_js_1.default.isInteger(amount) || amount <= 0) {
            throw new Error('Invalid amount provided');
        }
        options = {
            privateKey: this.tronWeb.defaultPrivateKey,
            address: this.tronWeb.defaultAddress.hex,
            ...options,
        };
        if (!options.privateKey && !options.address) {
            throw new Error('Function requires either a private key or address to be set');
        }
        const address = options.privateKey ? this.tronWeb.address.fromPrivateKey(options.privateKey) : options.address;
        const transaction = await this.tronWeb.transactionBuilder.sendTrx(to, amount, address);
        const signedTransaction = await this.sign(transaction, options.privateKey);
        const result = await this.sendRawTransaction(signedTransaction);
        return result;
    }
    async sendToken(to, amount, tokenID, options = {}) {
        if (typeof options === 'string')
            options = { privateKey: options };
        if (!this.tronWeb.isAddress(to)) {
            throw new Error('Invalid recipient provided');
        }
        if (!index_js_1.default.isInteger(amount) || amount <= 0) {
            throw new Error('Invalid amount provided');
        }
        if (index_js_1.default.isInteger(tokenID))
            tokenID = tokenID.toString();
        if (!index_js_1.default.isString(tokenID)) {
            throw new Error('Invalid token ID provided');
        }
        options = {
            privateKey: this.tronWeb.defaultPrivateKey,
            address: this.tronWeb.defaultAddress.hex,
            ...options,
        };
        if (!options.privateKey && !options.address) {
            throw new Error('Function requires either a private key or address to be set');
        }
        const address = options.privateKey ? this.tronWeb.address.fromPrivateKey(options.privateKey) : options.address;
        const transaction = await this.tronWeb.transactionBuilder.sendToken(to, amount, tokenID, address);
        const signedTransaction = await this.sign(transaction, options.privateKey);
        const result = await this.sendRawTransaction(signedTransaction);
        return result;
    }
    /**
     * Freezes an amount of TRX.
     * Will give bandwidth OR Energy and TRON Power(voting rights)
     * to the owner of the frozen tokens.
     *
     * @param amount - is the number of frozen trx
     * @param duration - is the duration in days to be frozen
     * @param resource - is the type, must be either "ENERGY" or "BANDWIDTH"
     * @param options
     */
    async freezeBalance(amount = 0, duration = 3, resource = 'BANDWIDTH', options = {}, receiverAddress) {
        if (typeof options === 'string')
            options = { privateKey: options };
        if (!['BANDWIDTH', 'ENERGY'].includes(resource)) {
            throw new Error('Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"');
        }
        if (!index_js_1.default.isInteger(amount) || amount <= 0) {
            throw new Error('Invalid amount provided');
        }
        if (!index_js_1.default.isInteger(duration) || duration < 3) {
            throw new Error('Invalid duration provided, minimum of 3 days');
        }
        options = {
            privateKey: this.tronWeb.defaultPrivateKey,
            address: this.tronWeb.defaultAddress.hex,
            ...options,
        };
        if (!options.privateKey && !options.address) {
            throw new Error('Function requires either a private key or address to be set');
        }
        const address = options.privateKey ? this.tronWeb.address.fromPrivateKey(options.privateKey) : options.address;
        const freezeBalance = await this.tronWeb.transactionBuilder.freezeBalance(amount, duration, resource, address, receiverAddress);
        const signedTransaction = await this.sign(freezeBalance, options.privateKey);
        const result = await this.sendRawTransaction(signedTransaction);
        return result;
    }
    /**
     * Unfreeze TRX that has passed the minimum freeze duration.
     * Unfreezing will remove bandwidth and TRON Power.
     *
     * @param resource - is the type, must be either "ENERGY" or "BANDWIDTH"
     * @param options
     */
    async unfreezeBalance(resource = 'BANDWIDTH', options = {}, receiverAddress) {
        if (typeof options === 'string')
            options = { privateKey: options };
        if (!['BANDWIDTH', 'ENERGY'].includes(resource)) {
            throw new Error('Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"');
        }
        options = {
            privateKey: this.tronWeb.defaultPrivateKey,
            address: this.tronWeb.defaultAddress.hex,
            ...options,
        };
        if (!options.privateKey && !options.address) {
            throw new Error('Function requires either a private key or address to be set');
        }
        const address = options.privateKey ? this.tronWeb.address.fromPrivateKey(options.privateKey) : options.address;
        const unfreezeBalance = await this.tronWeb.transactionBuilder.unfreezeBalance(resource, address, receiverAddress);
        const signedTransaction = await this.sign(unfreezeBalance, options.privateKey);
        const result = await this.sendRawTransaction(signedTransaction);
        return result;
    }
    /**
     * Modify account name
     * Note: Username is allowed to edit only once.
     *
     * @param privateKey - Account private Key
     * @param accountName - name of the account
     *
     * @return modified Transaction Object
     */
    async updateAccount(accountName, options = {}) {
        if (typeof options === 'string')
            options = { privateKey: options };
        if (!index_js_1.default.isString(accountName) || !accountName.length) {
            throw new Error('Name must be a string');
        }
        options = {
            privateKey: this.tronWeb.defaultPrivateKey,
            address: this.tronWeb.defaultAddress.hex,
            ...options,
        };
        if (!options.privateKey && !options.address)
            throw Error('Function requires either a private key or address to be set');
        const address = options.privateKey ? this.tronWeb.address.fromPrivateKey(options.privateKey) : options.address;
        const updateAccount = await this.tronWeb.transactionBuilder.updateAccount(accountName, address);
        const signedTransaction = await this.sign(updateAccount, options.privateKey);
        const result = await this.sendRawTransaction(signedTransaction);
        return result;
    }
    /**
     * Gets a network modification proposal by ID.
     */
    async getProposal(proposalID) {
        if (!index_js_1.default.isInteger(proposalID) || proposalID < 0) {
            throw new Error('Invalid proposalID provided');
        }
        return this.tronWeb.fullNode.request('wallet/getproposalbyid', {
            id: parseInt(proposalID),
        }, 'post');
    }
    /**
     * Lists all network modification proposals.
     */
    async listProposals() {
        const { proposals = [] } = await this.tronWeb.fullNode.request('wallet/listproposals', {}, 'post');
        return proposals;
    }
    /**
     * Lists all parameters available for network modification proposals.
     */
    async getChainParameters() {
        const { chainParameter = [] } = await this.tronWeb.fullNode.request('wallet/getchainparameters', {}, 'post');
        return chainParameter;
    }
    /**
     * Get the account resources
     */
    async getAccountResources(address = this.tronWeb.defaultAddress.hex) {
        if (!this.tronWeb.isAddress(address)) {
            throw new Error('Invalid address provided');
        }
        return this.tronWeb.fullNode.request('wallet/getaccountresource', {
            address: this.tronWeb.address.toHex(address),
        }, 'post');
    }
    /**
     * Query the amount of resources of a specific resourceType delegated by fromAddress to toAddress
     */
    async getDelegatedResourceV2(fromAddress = this.tronWeb.defaultAddress.hex, toAddress = this.tronWeb.defaultAddress.hex, options = { confirmed: true }) {
        if (!this.tronWeb.isAddress(fromAddress)) {
            throw new Error('Invalid address provided');
        }
        if (!this.tronWeb.isAddress(toAddress)) {
            throw new Error('Invalid address provided');
        }
        return this.tronWeb[options.confirmed ? 'solidityNode' : 'fullNode'].request(`wallet${options.confirmed ? 'solidity' : ''}/getdelegatedresourcev2`, {
            fromAddress: toHex(fromAddress),
            toAddress: toHex(toAddress),
        }, 'post');
    }
    /**
     * Query the resource delegation index by an account
     */
    async getDelegatedResourceAccountIndexV2(address = this.tronWeb.defaultAddress.hex, options = { confirmed: true }) {
        if (!this.tronWeb.isAddress(address)) {
            throw new Error('Invalid address provided');
        }
        return this.tronWeb[options.confirmed ? 'solidityNode' : 'fullNode'].request(`wallet${options.confirmed ? 'solidity' : ''}/getdelegatedresourceaccountindexv2`, {
            value: toHex(address),
        }, 'post');
    }
    /**
     * Query the amount of delegatable resources of the specified resource Type for target address, unit is sun.
     */
    async getCanDelegatedMaxSize(address = this.tronWeb.defaultAddress.hex, resource = 'BANDWIDTH', options = { confirmed: true }) {
        if (!this.tronWeb.isAddress(address)) {
            throw new Error('Invalid address provided');
        }
        this.validator.notValid([
            {
                name: 'resource',
                type: 'resource',
                value: resource,
                msg: 'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"',
            },
        ]);
        return this.tronWeb[options.confirmed ? 'solidityNode' : 'fullNode'].request(`wallet${options.confirmed ? 'solidity' : ''}/getcandelegatedmaxsize`, {
            owner_address: toHex(address),
            type: resource === 'ENERGY' ? 1 : 0,
        }, 'post');
    }
    /**
     * Remaining times of available unstaking API
     */
    async getAvailableUnfreezeCount(address = this.tronWeb.defaultAddress.hex, options = { confirmed: true }) {
        if (!this.tronWeb.isAddress(address)) {
            throw new Error('Invalid address provided');
        }
        return this.tronWeb[options.confirmed ? 'solidityNode' : 'fullNode'].request(`wallet${options.confirmed ? 'solidity' : ''}/getavailableunfreezecount`, {
            owner_address: toHex(address),
        }, 'post');
    }
    /**
     * Query the withdrawable balance at the specified timestamp
     */
    async getCanWithdrawUnfreezeAmount(address = this.tronWeb.defaultAddress.hex, timestamp = Date.now(), options = { confirmed: true }) {
        if (!this.tronWeb.isAddress(address)) {
            throw new Error('Invalid address provided');
        }
        if (!index_js_1.default.isInteger(timestamp) || timestamp < 0) {
            throw new Error('Invalid timestamp provided');
        }
        return this.tronWeb[options.confirmed ? 'solidityNode' : 'fullNode'].request(`wallet${options.confirmed ? 'solidity' : ''}/getcanwithdrawunfreezeamount`, {
            owner_address: toHex(address),
            timestamp: timestamp,
        }, 'post');
    }
    /**
     * Get the exchange ID.
     */
    async getExchangeByID(exchangeID) {
        if (!index_js_1.default.isInteger(exchangeID) || exchangeID < 0) {
            throw new Error('Invalid exchangeID provided');
        }
        return this.tronWeb.fullNode.request('wallet/getexchangebyid', {
            id: exchangeID,
        }, 'post');
    }
    /**
     * Lists the exchanges
     */
    async listExchanges() {
        return this.tronWeb.fullNode
            .request('wallet/listexchanges', {}, 'post')
            .then(({ exchanges = [] }) => exchanges);
    }
    /**
     * Lists all network modification proposals.
     */
    async listExchangesPaginated(limit = 10, offset = 0) {
        return this.tronWeb.fullNode
            .request('wallet/getpaginatedexchangelist', {
            limit,
            offset,
        }, 'post')
            .then(({ exchanges = [] }) => exchanges);
    }
    /**
     * Get info about thre node
     */
    async getNodeInfo() {
        return this.tronWeb.fullNode.request('wallet/getnodeinfo', {}, 'post');
    }
    async getTokenListByName(tokenID) {
        if (index_js_1.default.isInteger(tokenID))
            tokenID = tokenID.toString();
        if (!index_js_1.default.isString(tokenID) || !tokenID.length) {
            throw new Error('Invalid token ID provided');
        }
        return this.tronWeb.fullNode
            .request('wallet/getassetissuelistbyname', {
            value: this.tronWeb.fromUtf8(tokenID),
        }, 'post')
            .then((token) => {
            if (Array.isArray(token.assetIssue)) {
                return token.assetIssue.map((t) => this._parseToken(t));
            }
            else if (!token.name) {
                throw new Error('Token does not exist');
            }
            return this._parseToken(token);
        });
    }
    getTokenByID(tokenID) {
        if (index_js_1.default.isInteger(tokenID))
            tokenID = tokenID.toString();
        if (!index_js_1.default.isString(tokenID) || !tokenID.length) {
            throw new Error('Invalid token ID provided');
        }
        return this.tronWeb.fullNode
            .request('wallet/getassetissuebyid', {
            value: tokenID,
        }, 'post')
            .then((token) => {
            if (!token.name) {
                throw new Error('Token does not exist');
            }
            return this._parseToken(token);
        });
    }
    async getReward(address, options = {}) {
        options.confirmed = true;
        return this._getReward(address, options);
    }
    async getUnconfirmedReward(address, options = {}) {
        options.confirmed = false;
        return this._getReward(address, options);
    }
    async getBrokerage(address, options = {}) {
        options.confirmed = true;
        return this._getBrokerage(address, options);
    }
    async getUnconfirmedBrokerage(address, options = {}) {
        options.confirmed = false;
        return this._getBrokerage(address, options);
    }
    async _getReward(address = this.tronWeb.defaultAddress.hex, options) {
        this.validator.notValid([
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
        ]);
        const data = {
            address: toHex(address),
        };
        return this.tronWeb[options.confirmed ? 'solidityNode' : 'fullNode']
            .request(`wallet${options.confirmed ? 'solidity' : ''}/getReward`, data, 'post')
            .then((result = { reward: undefined }) => {
            if (typeof result.reward === 'undefined') {
                throw new Error('Not found.');
            }
            return result.reward;
        });
    }
    async _getBrokerage(address = this.tronWeb.defaultAddress.hex, options) {
        this.validator.notValid([
            {
                name: 'origin',
                type: 'address',
                value: address,
            },
        ]);
        const data = {
            address: toHex(address),
        };
        return this.tronWeb[options.confirmed ? 'solidityNode' : 'fullNode']
            .request(`wallet${options.confirmed ? 'solidity' : ''}/getBrokerage`, data, 'post')
            .then((result = {}) => {
            if (typeof result.brokerage === 'undefined') {
                throw new Error('Not found.');
            }
            return result.brokerage;
        });
    }
    async getBandwidthPrices() {
        return this.tronWeb.fullNode.request('wallet/getbandwidthprices', {}, 'post')
            .then((result = {}) => {
            if (typeof result.prices === 'undefined') {
                throw new Error('Not found.');
            }
            return result.prices;
        });
    }
    async getEnergyPrices() {
        return this.tronWeb.fullNode.request('wallet/getenergyprices', {}, 'post')
            .then((result = {}) => {
            if (typeof result.prices === 'undefined') {
                throw new Error('Not found.');
            }
            return result.prices;
        });
    }
}
exports.Trx = Trx;
//# sourceMappingURL=trx.js.map