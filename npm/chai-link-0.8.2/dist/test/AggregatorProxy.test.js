"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@chainlink/test-helpers");
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const AggregatorFactory_1 = require("../src/generated/AggregatorFactory");
const AggregatorProxyFactory_1 = require("../src/generated/AggregatorProxyFactory");
const OracleFactory_1 = require("../src/generated/OracleFactory");
let personas;
let defaultAccount;
const provider = test_helpers_1.setup.provider();
const linkTokenFactory = new test_helpers_1.contract.LinkTokenFactory();
const aggregatorFactory = new AggregatorFactory_1.AggregatorFactory();
const oracleFactory = new OracleFactory_1.OracleFactory();
const aggregatorProxyFactory = new AggregatorProxyFactory_1.AggregatorProxyFactory();
beforeAll(async () => {
    const users = await test_helpers_1.setup.users(provider);
    personas = users.personas;
    defaultAccount = users.roles.defaultAccount;
});
describe('AggregatorProxy', () => {
    const jobId1 = '0x4c7b7ffb66b344fbaa64995af81e355a00000000000000000000000000000001';
    const deposit = test_helpers_1.helpers.toWei('100');
    const basePayment = test_helpers_1.helpers.toWei('1');
    const response = test_helpers_1.helpers.numToBytes32(54321);
    const response2 = test_helpers_1.helpers.numToBytes32(67890);
    let link;
    let aggregator;
    let aggregator2;
    let oc1;
    let proxy;
    const deployment = test_helpers_1.setup.snapshot(provider, async () => {
        link = await linkTokenFactory.connect(defaultAccount).deploy();
        oc1 = await oracleFactory.connect(defaultAccount).deploy(link.address);
        aggregator = await aggregatorFactory
            .connect(defaultAccount)
            .deploy(link.address, basePayment, 1, [oc1.address], [jobId1]);
        await link.transfer(aggregator.address, deposit);
        proxy = await aggregatorProxyFactory
            .connect(defaultAccount)
            .deploy(aggregator.address);
    });
    beforeEach(async () => {
        await deployment();
    });
    it('has a limited public interface', () => {
        test_helpers_1.matchers.publicAbi(aggregatorProxyFactory, [
            'aggregator',
            'latestAnswer',
            'latestRound',
            'getAnswer',
            'destroy',
            'setAggregator',
            'latestTimestamp',
            'getTimestamp',
            // Ownable methods:
            'owner',
            'renounceOwnership',
            'transferOwnership',
        ]);
    });
    describe('#latestAnswer', () => {
        beforeEach(async () => {
            var _a;
            const requestTx = await aggregator.requestRateUpdate();
            const receipt = await requestTx.wait();
            const request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
            await oc1.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
            test_helpers_1.matchers.bigNum(ethers_1.ethers.utils.bigNumberify(response), await aggregator.latestAnswer());
        });
        it('pulls the rate from the aggregator', async () => {
            test_helpers_1.matchers.bigNum(response, await proxy.latestAnswer());
            const latestRound = await proxy.latestRound();
            test_helpers_1.matchers.bigNum(response, await proxy.getAnswer(latestRound));
        });
        describe('after being updated to another contract', () => {
            beforeEach(async () => {
                var _a;
                aggregator2 = await aggregatorFactory
                    .connect(defaultAccount)
                    .deploy(link.address, basePayment, 1, [oc1.address], [jobId1]);
                await link.transfer(aggregator2.address, deposit);
                const requestTx = await aggregator2.requestRateUpdate();
                const receipt = await requestTx.wait();
                const request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                await oc1.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response2));
                test_helpers_1.matchers.bigNum(response2, await aggregator2.latestAnswer());
                await proxy.setAggregator(aggregator2.address);
            });
            it('pulls the rate from the new aggregator', async () => {
                test_helpers_1.matchers.bigNum(response2, await proxy.latestAnswer());
                const latestRound = await proxy.latestRound();
                test_helpers_1.matchers.bigNum(response2, await proxy.getAnswer(latestRound));
            });
        });
    });
    describe('#latestTimestamp', () => {
        beforeEach(async () => {
            var _a;
            const requestTx = await aggregator.requestRateUpdate();
            const receipt = await requestTx.wait();
            const request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
            await oc1.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
            const height = await aggregator.latestTimestamp();
            chai_1.assert.notEqual('0', height.toString());
        });
        it('pulls the height from the aggregator', async () => {
            test_helpers_1.matchers.bigNum(await aggregator.latestTimestamp(), await proxy.latestTimestamp());
            const latestRound = await proxy.latestRound();
            test_helpers_1.matchers.bigNum(await aggregator.latestTimestamp(), await proxy.getTimestamp(latestRound));
        });
        describe('after being updated to another contract', () => {
            beforeEach(async () => {
                var _a;
                aggregator2 = await aggregatorFactory
                    .connect(defaultAccount)
                    .deploy(link.address, basePayment, 1, [oc1.address], [jobId1]);
                await link.transfer(aggregator2.address, deposit);
                const requestTx = await aggregator2.requestRateUpdate();
                const receipt = await requestTx.wait();
                const request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                await oc1.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response2));
                const height2 = await aggregator2.latestTimestamp();
                chai_1.assert.notEqual('0', height2.toString());
                const height1 = await aggregator.latestTimestamp();
                chai_1.assert.notEqual(height1.toString(), height2.toString());
                await proxy.setAggregator(aggregator2.address);
            });
            it('pulls the height from the new aggregator', async () => {
                test_helpers_1.matchers.bigNum(await aggregator2.latestTimestamp(), await proxy.latestTimestamp());
                const latestRound = await proxy.latestRound();
                test_helpers_1.matchers.bigNum(await aggregator2.latestTimestamp(), await proxy.getTimestamp(latestRound));
            });
        });
    });
    describe('#setAggregator', () => {
        beforeEach(async () => {
            await proxy.transferOwnership(personas.Carol.address);
            aggregator2 = await aggregatorFactory
                .connect(defaultAccount)
                .deploy(link.address, basePayment, 1, [oc1.address], [jobId1]);
            chai_1.assert.equal(aggregator.address, await proxy.aggregator());
        });
        describe('when called by the owner', () => {
            it('sets the address of the new aggregator', async () => {
                await proxy.connect(personas.Carol).setAggregator(aggregator2.address);
                chai_1.assert.equal(aggregator2.address, await proxy.aggregator());
            });
        });
        describe('when called by a non-owner', () => {
            it('does not update', async () => {
                test_helpers_1.matchers.evmRevert(async () => {
                    await proxy.connect(personas.Neil).setAggregator(aggregator2.address);
                });
                chai_1.assert.equal(aggregator.address, await proxy.aggregator());
            });
        });
    });
    describe('#destroy', () => {
        beforeEach(async () => {
            await proxy.transferOwnership(personas.Carol.address);
        });
        describe('when called by the owner', () => {
            it('succeeds', async () => {
                await proxy.connect(personas.Carol).destroy();
                chai_1.assert.equal('0x', await provider.getCode(proxy.address));
            });
        });
        describe('when called by a non-owner', () => {
            it('fails', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await proxy.connect(personas.Eddy).destroy();
                });
                chai_1.assert.notEqual('0x', await provider.getCode(proxy.address));
            });
        });
    });
});
//# sourceMappingURL=AggregatorProxy.test.js.map