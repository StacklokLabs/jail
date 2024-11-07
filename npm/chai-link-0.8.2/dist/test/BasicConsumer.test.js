"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@chainlink/test-helpers");
const cbor_1 = __importDefault(require("cbor"));
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const BasicConsumerFactory_1 = require("../src/generated/BasicConsumerFactory");
const OracleFactory_1 = require("../src/generated/OracleFactory");
const basicConsumerFactory = new BasicConsumerFactory_1.BasicConsumerFactory();
const oracleFactory = new OracleFactory_1.OracleFactory();
const linkTokenFactory = new test_helpers_1.contract.LinkTokenFactory();
// create ethers provider from that web3js instance
const provider = test_helpers_1.setup.provider();
let roles;
beforeAll(async () => {
    const users = await test_helpers_1.setup.users(provider);
    roles = users.roles;
});
describe('BasicConsumer', () => {
    const specId = '0x4c7b7ffb66b344fbaa64995af81e355a'.padEnd(66, '0');
    const currency = 'USD';
    let link;
    let oc;
    let cc;
    const deployment = test_helpers_1.setup.snapshot(provider, async () => {
        link = await linkTokenFactory.connect(roles.defaultAccount).deploy();
        oc = await oracleFactory.connect(roles.oracleNode).deploy(link.address);
        cc = await basicConsumerFactory
            .connect(roles.defaultAccount)
            .deploy(link.address, oc.address, specId);
    });
    beforeEach(async () => {
        await deployment();
    });
    it('has a predictable gas price', async () => {
        var _a, _b, _c, _d, _e, _f;
        const rec = await provider.getTransactionReceipt((_c = (_b = (_a = cc) === null || _a === void 0 ? void 0 : _a.deployTransaction) === null || _b === void 0 ? void 0 : _b.hash, (_c !== null && _c !== void 0 ? _c : '')));
        chai_1.assert.isBelow((_f = (_e = (_d = rec) === null || _d === void 0 ? void 0 : _d.gasUsed) === null || _e === void 0 ? void 0 : _e.toNumber(), (_f !== null && _f !== void 0 ? _f : 0)), 1700000);
    });
    describe('#requestEthereumPrice', () => {
        describe('without LINK', () => {
            it('reverts', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await cc.requestEthereumPrice(currency);
                });
            });
        });
        describe('with LINK', () => {
            beforeEach(async () => {
                await link.transfer(cc.address, ethers_1.ethers.utils.parseEther('1'));
            });
            it('triggers a log event in the Oracle contract', async () => {
                var _a, _b, _c, _d;
                const tx = await cc.requestEthereumPrice(currency);
                const receipt = await tx.wait();
                const log = (_b = (_a = receipt) === null || _a === void 0 ? void 0 : _a.logs) === null || _b === void 0 ? void 0 : _b[3];
                chai_1.assert.equal((_d = (_c = log) === null || _c === void 0 ? void 0 : _c.address, (_d !== null && _d !== void 0 ? _d : '')), oc.address);
                const request = test_helpers_1.oracle.decodeRunRequest(log);
                const expected = {
                    path: ['USD'],
                    get: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY',
                };
                chai_1.assert.equal(test_helpers_1.helpers.toHex(specId), request.specId);
                test_helpers_1.matchers.bigNum(test_helpers_1.helpers.toWei('1'), request.payment);
                chai_1.assert.equal(cc.address, request.requester);
                chai_1.assert.equal(1, request.dataVersion);
                chai_1.assert.deepEqual(expected, cbor_1.default.decodeFirstSync(request.data));
            });
            it('has a reasonable gas cost', async () => {
                var _a, _b;
                const tx = await cc.requestEthereumPrice(currency);
                const receipt = await tx.wait();
                chai_1.assert.isBelow((_b = (_a = receipt.gasUsed) === null || _a === void 0 ? void 0 : _a.toNumber(), (_b !== null && _b !== void 0 ? _b : 0)), 130000);
            });
        });
    });
    describe('#fulfillOracleRequest', () => {
        const response = ethers_1.ethers.utils.formatBytes32String('1,000,000.00');
        let request;
        beforeEach(async () => {
            var _a;
            await link.transfer(cc.address, test_helpers_1.helpers.toWei('1'));
            const tx = await cc.requestEthereumPrice(currency);
            const receipt = await tx.wait();
            request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
        });
        it('records the data given to it by the oracle', async () => {
            await oc
                .connect(roles.oracleNode)
                .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
            const currentPrice = await cc.currentPrice();
            chai_1.assert.equal(currentPrice, response);
        });
        it('logs the data given to it by the oracle', async () => {
            var _a, _b, _c;
            const tx = await oc
                .connect(roles.oracleNode)
                .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
            const receipt = await tx.wait();
            chai_1.assert.equal(2, (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a.length);
            const log = (_b = receipt.logs) === null || _b === void 0 ? void 0 : _b[1];
            chai_1.assert.equal((_c = log) === null || _c === void 0 ? void 0 : _c.topics[2], response);
        });
        describe('when the consumer does not recognize the request ID', () => {
            let otherRequest;
            beforeEach(async () => {
                var _a;
                const args = test_helpers_1.oracle.encodeOracleRequest(specId, cc.address, basicConsumerFactory.interface.functions.fulfill.sighash, 43, '0x0');
                const tx = await link.transferAndCall(oc.address, 0, args);
                const receipt = await tx.wait();
                otherRequest = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[2]);
            });
            it('does not accept the data provided', async () => {
                await oc
                    .connect(roles.oracleNode)
                    .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(otherRequest, response));
                const received = await cc.currentPrice();
                chai_1.assert.equal(ethers_1.ethers.utils.parseBytes32String(received), '');
            });
        });
        describe('when called by anyone other than the oracle contract', () => {
            it('does not accept the data provided', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await cc
                        .connect(roles.oracleNode)
                        .fulfill(request.requestId, response);
                });
                const received = await cc.currentPrice();
                chai_1.assert.equal(ethers_1.ethers.utils.parseBytes32String(received), '');
            });
        });
    });
    describe('#cancelRequest', () => {
        const depositAmount = test_helpers_1.helpers.toWei('1');
        let request;
        beforeEach(async () => {
            var _a;
            await link.transfer(cc.address, depositAmount);
            const tx = await cc.requestEthereumPrice(currency);
            const receipt = await tx.wait();
            request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
        });
        describe('before 5 minutes', () => {
            it('cant cancel the request', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await cc
                        .connect(roles.consumer)
                        .cancelRequest(request.requestId, request.payment, request.callbackFunc, request.expiration);
                });
            });
        });
        describe('after 5 minutes', () => {
            it('can cancel the request', async () => {
                await test_helpers_1.helpers.increaseTime5Minutes(provider);
                await cc
                    .connect(roles.consumer)
                    .cancelRequest(request.requestId, request.payment, request.callbackFunc, request.expiration);
            });
        });
    });
    describe('#withdrawLink', () => {
        const depositAmount = test_helpers_1.helpers.toWei('1');
        beforeEach(async () => {
            await link.transfer(cc.address, depositAmount);
            const balance = await link.balanceOf(cc.address);
            test_helpers_1.matchers.bigNum(balance, depositAmount);
        });
        it('transfers LINK out of the contract', async () => {
            await cc.connect(roles.consumer).withdrawLink();
            const ccBalance = await link.balanceOf(cc.address);
            const consumerBalance = ethers_1.ethers.utils.bigNumberify(await link.balanceOf(roles.consumer.address));
            test_helpers_1.matchers.bigNum(ccBalance, 0);
            test_helpers_1.matchers.bigNum(consumerBalance, depositAmount);
        });
    });
});
//# sourceMappingURL=BasicConsumer.test.js.map