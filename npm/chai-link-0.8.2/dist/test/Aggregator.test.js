"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@chainlink/test-helpers");
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const AggregatorFactory_1 = require("../src/generated/AggregatorFactory");
const OracleFactory_1 = require("../src/generated/OracleFactory");
const aggregatorFactory = new AggregatorFactory_1.AggregatorFactory();
const oracleFactory = new OracleFactory_1.OracleFactory();
const linkTokenFactory = new test_helpers_1.contract.LinkTokenFactory();
let personas;
let defaultAccount;
const provider = test_helpers_1.setup.provider();
beforeAll(async () => {
    const users = await test_helpers_1.setup.users(provider);
    personas = users.personas;
    defaultAccount = users.roles.defaultAccount;
});
describe('Aggregator', () => {
    const jobId1 = '0x4c7b7ffb66b344fbaa64995af81e355a00000000000000000000000000000001';
    const jobId2 = '0x4c7b7ffb66b344fbaa64995af81e355a00000000000000000000000000000002';
    const jobId3 = '0x4c7b7ffb66b344fbaa64995af81e355a00000000000000000000000000000003';
    const jobId4 = '0x4c7b7ffb66b344fbaa64995af81e355a00000000000000000000000000000004';
    const deposit = test_helpers_1.helpers.toWei('100');
    const basePayment = test_helpers_1.helpers.toWei('1');
    let link;
    let rate;
    let oc1;
    let oc2;
    let oc3;
    let oc4;
    let oracles;
    let jobIds = [];
    const deployment = test_helpers_1.setup.snapshot(provider, async () => {
        link = await linkTokenFactory.connect(defaultAccount).deploy();
        oc1 = await oracleFactory.connect(defaultAccount).deploy(link.address);
        oc2 = await oracleFactory.connect(defaultAccount).deploy(link.address);
        oc3 = await oracleFactory.connect(defaultAccount).deploy(link.address);
        oc4 = await oracleFactory.connect(defaultAccount).deploy(link.address);
        oracles = [oc1, oc2, oc3];
    });
    beforeEach(async () => {
        await deployment();
    });
    it('has a limited public interface', () => {
        test_helpers_1.matchers.publicAbi(aggregatorFactory, [
            'authorizedRequesters',
            'cancelRequest',
            'chainlinkCallback',
            'latestAnswer',
            'getAnswer',
            'destroy',
            'jobIds',
            'latestRound',
            'minimumResponses',
            'oracles',
            'paymentAmount',
            'requestRateUpdate',
            'setAuthorization',
            'transferLINK',
            'updateRequestDetails',
            'latestTimestamp',
            'getTimestamp',
            // Ownable methods:
            'owner',
            'renounceOwnership',
            'transferOwnership',
        ]);
    });
    describe('#requestRateUpdate', () => {
        const response = test_helpers_1.helpers.numToBytes32(100);
        describe('basic updates', () => {
            beforeEach(async () => {
                rate = await aggregatorFactory
                    .connect(defaultAccount)
                    .deploy(link.address, basePayment, 1, [oc1.address], [jobId1]);
                await link.transfer(rate.address, deposit);
                const current = await rate.latestAnswer();
                test_helpers_1.matchers.bigNum(ethers_1.ethers.constants.Zero, current);
            });
            it('emits a new round log', async () => {
                var _a, _b;
                const requestTx = await rate.requestRateUpdate();
                const receipt = await requestTx.wait();
                const answerId = test_helpers_1.helpers.numToBytes32(1);
                const newRoundLog = (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[receipt.logs.length - 1];
                chai_1.assert.equal(answerId, (_b = newRoundLog) === null || _b === void 0 ? void 0 : _b.topics[1]);
            });
            it('trigger a request to the oracle and accepts a response', async () => {
                var _a, _b;
                const requestTx = await rate.requestRateUpdate();
                const receipt = await requestTx.wait();
                const log = (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3];
                chai_1.assert.equal(oc1.address, (_b = log) === null || _b === void 0 ? void 0 : _b.address);
                const request = test_helpers_1.oracle.decodeRunRequest(log);
                await oc1.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                const current = await rate.latestAnswer();
                test_helpers_1.matchers.bigNum(response, current);
                const answerId = await rate.latestRound();
                const currentMappingValue = await rate.getAnswer(answerId);
                test_helpers_1.matchers.bigNum(current, currentMappingValue);
            });
            it('change the updatedAt record', async () => {
                var _a;
                let updatedAt = await rate.latestTimestamp();
                chai_1.assert.equal('0', updatedAt.toString());
                const requestTx = await rate.requestRateUpdate();
                const receipt = await requestTx.wait();
                const request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                await oc1.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                updatedAt = await rate.latestTimestamp();
                chai_1.assert.notEqual('0', updatedAt.toString());
                const answerId = await rate.latestRound();
                const timestampMappingValue = await rate.getTimestamp(answerId);
                test_helpers_1.matchers.bigNum(updatedAt, timestampMappingValue);
            });
            it('emits a log with the response, answer ID, and sender', async () => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                const requestTx = await rate.requestRateUpdate();
                const requestTxreceipt = await requestTx.wait();
                const request = test_helpers_1.oracle.decodeRunRequest((_a = requestTxreceipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                const fulfillOracleRequest = await oc1.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                const fulfillOracleRequestReceipt = await fulfillOracleRequest.wait();
                const answerId = test_helpers_1.helpers.numToBytes32(1);
                const receivedLog = (_b = fulfillOracleRequestReceipt.logs) === null || _b === void 0 ? void 0 : _b[1];
                chai_1.assert.equal(response, (_d = (_c = receivedLog) === null || _c === void 0 ? void 0 : _c.topics) === null || _d === void 0 ? void 0 : _d[1]);
                chai_1.assert.equal(answerId, (_f = (_e = receivedLog) === null || _e === void 0 ? void 0 : _e.topics) === null || _f === void 0 ? void 0 : _f[2]);
                chai_1.assert.equal(oc1.address, ethers_1.ethers.utils.getAddress((_k = (_j = (_h = (_g = receivedLog) === null || _g === void 0 ? void 0 : _g.topics) === null || _h === void 0 ? void 0 : _h[3]) === null || _j === void 0 ? void 0 : _j.slice(26, 66), (_k !== null && _k !== void 0 ? _k : ''))));
            });
            it('emits a log with the new answer', async () => {
                var _a, _b, _c, _d;
                const requestTx = await rate.requestRateUpdate();
                const requestReceipt = await requestTx.wait();
                const request = test_helpers_1.oracle.decodeRunRequest((_a = requestReceipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                const fulfillOracleRequest = await oc1.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                const fulfillOracleRequestReceipt = await fulfillOracleRequest.wait();
                const answerId = test_helpers_1.helpers.numToBytes32(1);
                const answerUpdatedLog = (_b = fulfillOracleRequestReceipt.logs) === null || _b === void 0 ? void 0 : _b[2];
                chai_1.assert.equal(response, (_c = answerUpdatedLog) === null || _c === void 0 ? void 0 : _c.topics[1]);
                chai_1.assert.equal(answerId, (_d = answerUpdatedLog) === null || _d === void 0 ? void 0 : _d.topics[2]);
            });
        });
        describe('with multiple oracles', () => {
            beforeEach(async () => {
                rate = await aggregatorFactory.connect(defaultAccount).deploy(link.address, basePayment, oracles.length, oracles.map(o => o.address), [jobId1, jobId2, jobId3]);
                await link.transfer(rate.address, deposit);
                const current = await rate.latestAnswer();
                test_helpers_1.matchers.bigNum(ethers_1.ethers.constants.Zero, current);
            });
            it('triggers requests to the oracles and the median of the responses', async () => {
                var _a, _b, _c;
                const requestTx = await rate.requestRateUpdate();
                const receipt = await requestTx.wait();
                const responses = [77, 66, 111].map(test_helpers_1.helpers.numToBytes32);
                for (let i = 0; i < oracles.length; i++) {
                    const o = oracles[i];
                    const log = (_b = (_a = receipt) === null || _a === void 0 ? void 0 : _a.logs) === null || _b === void 0 ? void 0 : _b[i * 4 + 3];
                    chai_1.assert.equal(o.address, (_c = log) === null || _c === void 0 ? void 0 : _c.address);
                    const request = test_helpers_1.oracle.decodeRunRequest(log);
                    await o.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, responses[i]));
                }
                const current = await rate.latestAnswer();
                test_helpers_1.matchers.bigNum(test_helpers_1.helpers.numToBytes32(77), current);
                const answerId = await rate.latestRound();
                const currentMappingValue = await rate.getAnswer(answerId);
                test_helpers_1.matchers.bigNum(current, currentMappingValue);
                const updatedAt = await rate.latestTimestamp();
                chai_1.assert.notEqual('0', updatedAt.toString());
                const timestampMappingValue = await rate.getTimestamp(answerId);
                test_helpers_1.matchers.bigNum(updatedAt, timestampMappingValue);
            });
            it('does not accept old responses', async () => {
                var _a, _b, _c, _d;
                const request1 = await rate.requestRateUpdate();
                const receipt1 = await request1.wait();
                const response1 = test_helpers_1.helpers.numToBytes32(100);
                const requests = [
                    test_helpers_1.oracle.decodeRunRequest((_a = receipt1.logs) === null || _a === void 0 ? void 0 : _a[3]),
                    test_helpers_1.oracle.decodeRunRequest((_b = receipt1.logs) === null || _b === void 0 ? void 0 : _b[7]),
                    test_helpers_1.oracle.decodeRunRequest((_c = receipt1.logs) === null || _c === void 0 ? void 0 : _c[11]),
                ];
                const request2 = await rate.requestRateUpdate();
                const receipt2 = await request2.wait();
                const response2 = test_helpers_1.helpers.numToBytes32(200);
                for (let i = 0; i < oracles.length; i++) {
                    const log = (_d = receipt2.logs) === null || _d === void 0 ? void 0 : _d[i * 4 + 3];
                    const request = test_helpers_1.oracle.decodeRunRequest(log);
                    await oracles[i].fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response2));
                }
                test_helpers_1.matchers.bigNum(response2, await rate.latestAnswer());
                for (let i = 0; i < oracles.length; i++) {
                    await oracles[i].fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(requests[i], response1));
                }
                test_helpers_1.matchers.bigNum(response2, await rate.latestAnswer());
            });
        });
        describe('with an even number of oracles', () => {
            beforeEach(async () => {
                oracles = [oc1, oc2, oc3, oc4];
                rate = await aggregatorFactory.connect(defaultAccount).deploy(link.address, basePayment, oracles.length, oracles.map(o => o.address), [jobId1, jobId2, jobId3, jobId4]);
                await link.transfer(rate.address, deposit);
                const current = await rate.latestAnswer();
                test_helpers_1.matchers.bigNum(ethers_1.ethers.constants.Zero, current);
            });
            it('triggers requests to the oracles and the median of the responses', async () => {
                var _a, _b;
                const requestTx = await rate.requestRateUpdate();
                const receipt = await requestTx.wait();
                const responses = [66, 76, 78, 111].map(test_helpers_1.helpers.numToBytes32);
                for (let i = 0; i < oracles.length; i++) {
                    const o = oracles[i];
                    const log = (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[i * 4 + 3];
                    chai_1.assert.equal(o.address, (_b = log) === null || _b === void 0 ? void 0 : _b.address);
                    const request = test_helpers_1.oracle.decodeRunRequest(log);
                    await o.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, responses[i]));
                }
                const current = await rate.latestAnswer();
                test_helpers_1.matchers.bigNum(77, current);
            });
        });
    });
    describe('#updateRequestDetails', () => {
        beforeEach(async () => {
            rate = await aggregatorFactory
                .connect(defaultAccount)
                .deploy(link.address, basePayment, 1, [oc1.address], [jobId1]);
            await rate.transferOwnership(personas.Carol.address);
            oc2 = await oracleFactory.connect(defaultAccount).deploy(link.address);
            await link.transfer(rate.address, deposit);
            const current = await rate.latestAnswer();
            test_helpers_1.matchers.bigNum(ethers_1.ethers.constants.Zero, current);
        });
        describe('when called by the owner', () => {
            it('changes the amout of LINK sent on a request', async () => {
                const uniquePayment = 7777777;
                await rate
                    .connect(personas.Carol)
                    .updateRequestDetails(uniquePayment, 1, [oc2.address], [jobId2]);
                await rate.connect(personas.Carol).requestRateUpdate();
                test_helpers_1.matchers.bigNum(uniquePayment, await link.balanceOf(oc2.address));
            });
            it('can be configured to accept fewer responses than oracles', async () => {
                var _a, _b;
                await rate
                    .connect(personas.Carol)
                    .updateRequestDetails(basePayment, 1, [oc1.address, oc2.address], [jobId1, jobId2]);
                const requestTx = await rate.connect(personas.Carol).requestRateUpdate();
                const requestTxReceipt = await requestTx.wait();
                const request1 = test_helpers_1.oracle.decodeRunRequest((_a = requestTxReceipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                const request2 = test_helpers_1.oracle.decodeRunRequest((_b = requestTxReceipt.logs) === null || _b === void 0 ? void 0 : _b[7]);
                const response1 = test_helpers_1.helpers.numToBytes32(100);
                await oc1.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request1, response1));
                test_helpers_1.matchers.bigNum(response1, await rate.latestAnswer());
                const response2 = test_helpers_1.helpers.numToBytes32(200);
                await oc2.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request2, response2));
                const response1Bn = ethers_1.ethers.utils.bigNumberify(response1);
                const response2Bn = ethers_1.ethers.utils.bigNumberify(response2);
                const expected = response1Bn.add(response2Bn).div(2);
                chai_1.assert.isTrue(expected.eq(await rate.latestAnswer()));
            });
            describe('and the number of jobs does not match number of oracles', () => {
                it('fails', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await rate
                            .connect(personas.Carol)
                            .updateRequestDetails(basePayment, 2, [oc1.address, oc2.address], [jobId2]);
                    });
                });
            });
            describe('and the oracles required exceeds the available amount', () => {
                it('fails', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await rate
                            .connect(personas.Carol)
                            .updateRequestDetails(basePayment, 3, [oc1.address, oc2.address], [jobId1, jobId2]);
                    });
                });
            });
        });
        describe('when called by a non-owner', () => {
            it('fails', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await rate
                        .connect(personas.Eddy)
                        .updateRequestDetails(basePayment, 1, [oc2.address], [jobId2]);
                });
            });
        });
        describe('when called before a past answer is fulfilled', () => {
            beforeEach(async () => {
                rate = await aggregatorFactory
                    .connect(defaultAccount)
                    .deploy(link.address, basePayment, 1, [oc1.address], [jobId1]);
                await link.transfer(rate.address, deposit);
                oc2 = await oracleFactory.connect(defaultAccount).deploy(link.address);
                oc3 = await oracleFactory.connect(defaultAccount).deploy(link.address);
            });
            it('accepts answers from oracles at the time the request was made', async () => {
                var _a, _b, _c;
                // make request 1
                const request1Tx = await rate.requestRateUpdate();
                const request1Receipt = await request1Tx.wait();
                const request1 = test_helpers_1.oracle.decodeRunRequest((_a = request1Receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                // change oracles
                await rate.updateRequestDetails(basePayment, 2, [oc2.address, oc3.address], [jobId2, jobId3]);
                // make new request
                const request2Tx = await rate.requestRateUpdate();
                const request2Receipt = await request2Tx.wait();
                const request2 = test_helpers_1.oracle.decodeRunRequest((_b = request2Receipt.logs) === null || _b === void 0 ? void 0 : _b[3]);
                const request3 = test_helpers_1.oracle.decodeRunRequest((_c = request2Receipt.logs) === null || _c === void 0 ? void 0 : _c[7]);
                // fulfill request 1
                const response1 = test_helpers_1.helpers.numToBytes32(100);
                await oc1.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request1, response1));
                test_helpers_1.matchers.bigNum(response1, await rate.latestAnswer());
                // fulfill request 2
                const responses2 = [202, 222].map(test_helpers_1.helpers.numToBytes32);
                await oc2.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request2, responses2[0]));
                await oc3.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request3, responses2[1]));
                test_helpers_1.matchers.bigNum(212, await rate.latestAnswer());
            });
        });
        describe('when calling with a large number of oracles', () => {
            const maxOracleCount = 28;
            beforeEach(() => {
                oracles = [];
                jobIds = [];
            });
            it(`does not revert with up to ${maxOracleCount} oracles`, async () => {
                for (let i = 0; i < maxOracleCount; i++) {
                    oracles.push(oc1);
                    jobIds.push(jobId1);
                }
                chai_1.assert.equal(maxOracleCount, oracles.length);
                chai_1.assert.equal(maxOracleCount, jobIds.length);
                await rate.connect(personas.Carol).updateRequestDetails(basePayment, maxOracleCount, oracles.map(o => o.address), jobIds);
            });
            it(`reverts with more than ${maxOracleCount} oracles`, async () => {
                const overMaxOracles = maxOracleCount + 1;
                for (let i = 0; i < overMaxOracles; i++) {
                    oracles.push(oc1);
                    jobIds.push(jobId1);
                }
                chai_1.assert.equal(overMaxOracles, oracles.length);
                chai_1.assert.equal(overMaxOracles, jobIds.length);
                await test_helpers_1.matchers.evmRevert(async () => {
                    await rate.connect(personas.Carol).updateRequestDetails(basePayment, overMaxOracles, oracles.map(o => o.address), jobIds);
                });
            });
        });
    });
    describe('#transferLINK', () => {
        beforeEach(async () => {
            rate = await aggregatorFactory
                .connect(defaultAccount)
                .deploy(link.address, basePayment, 1, [oc1.address], [jobId1]);
            await rate.transferOwnership(personas.Carol.address);
            await link.transfer(rate.address, deposit);
            test_helpers_1.matchers.bigNum(deposit, await link.balanceOf(rate.address));
        });
        describe('when called by the owner', () => {
            it('succeeds', async () => {
                await rate
                    .connect(personas.Carol)
                    .transferLINK(personas.Carol.address, deposit);
                test_helpers_1.matchers.bigNum(0, await link.balanceOf(rate.address));
                test_helpers_1.matchers.bigNum(deposit, await link.balanceOf(personas.Carol.address));
            });
            describe('with a number higher than the LINK balance', () => {
                it('fails', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await rate
                            .connect(personas.Carol)
                            .transferLINK(personas.Carol.address, deposit.add(basePayment));
                    });
                    test_helpers_1.matchers.bigNum(deposit, await link.balanceOf(rate.address));
                });
            });
        });
        describe('when called by a non-owner', () => {
            it('fails', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await rate
                        .connect(personas.Eddy)
                        .transferLINK(personas.Carol.address, deposit);
                });
                test_helpers_1.matchers.bigNum(deposit, await link.balanceOf(rate.address));
            });
        });
    });
    describe('#destroy', () => {
        beforeEach(async () => {
            rate = await aggregatorFactory
                .connect(defaultAccount)
                .deploy(link.address, basePayment, 1, [oc1.address], [jobId1]);
            await rate.transferOwnership(personas.Carol.address);
            await link.transfer(rate.address, deposit);
            test_helpers_1.matchers.bigNum(deposit, await link.balanceOf(rate.address));
        });
        describe('when called by the owner', () => {
            it('succeeds', async () => {
                await rate.connect(personas.Carol).destroy();
                test_helpers_1.matchers.bigNum(0, await link.balanceOf(rate.address));
                test_helpers_1.matchers.bigNum(deposit, await link.balanceOf(personas.Carol.address));
                chai_1.assert.equal('0x', await provider.getCode(rate.address));
            });
        });
        describe('when called by a non-owner', () => {
            it('fails', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await rate.connect(personas.Eddy).destroy();
                });
                test_helpers_1.matchers.bigNum(deposit, await link.balanceOf(rate.address));
                chai_1.assert.notEqual('0x', await provider.getCode(rate.address));
            });
        });
    });
    describe('#setAuthorization', () => {
        beforeEach(async () => {
            rate = await aggregatorFactory
                .connect(defaultAccount)
                .deploy(link.address, basePayment, 1, [oc1.address], [jobId1]);
            await link.transfer(rate.address, deposit);
        });
        describe('when called by an authorized address', () => {
            beforeEach(async () => {
                await rate.setAuthorization(personas.Eddy.address, true);
                chai_1.assert.equal(true, await rate.authorizedRequesters(personas.Eddy.address));
            });
            it('succeeds', async () => {
                await rate.connect(personas.Eddy).requestRateUpdate();
            });
            it('can be unset', async () => {
                await rate.setAuthorization(personas.Eddy.address, false);
                chai_1.assert.equal(false, await rate.authorizedRequesters(personas.Eddy.address));
                await test_helpers_1.matchers.evmRevert(async () => {
                    await rate.connect(personas.Eddy).requestRateUpdate();
                });
            });
        });
        describe('when called by a non-authorized address', () => {
            beforeEach(async () => {
                chai_1.assert.equal(false, await rate.authorizedRequesters(personas.Eddy.address));
            });
            it('fails', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await rate.connect(personas.Eddy).requestRateUpdate();
                });
            });
        });
    });
    describe('#cancelRequest', () => {
        let request;
        beforeEach(async () => {
            var _a;
            rate = await aggregatorFactory
                .connect(defaultAccount)
                .deploy(link.address, basePayment, 1, [oc1.address], [jobId1]);
            await link.transfer(rate.address, basePayment);
            test_helpers_1.matchers.bigNum(basePayment, await link.balanceOf(rate.address));
            test_helpers_1.matchers.bigNum(0, await link.balanceOf(oc1.address));
            const requestTx = await rate.requestRateUpdate();
            const receipt = await requestTx.wait();
            request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
            test_helpers_1.matchers.bigNum(0, await link.balanceOf(rate.address));
            test_helpers_1.matchers.bigNum(basePayment, await link.balanceOf(oc1.address));
            await test_helpers_1.helpers.increaseTime5Minutes(provider); // wait for request to expire
        });
        describe('when a later answer has been provided', () => {
            beforeEach(async () => {
                var _a;
                await link.transfer(rate.address, basePayment);
                const requestTx2 = await rate.requestRateUpdate();
                const receipt = await requestTx2.wait();
                const request2 = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                await oc1.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request2, '17'));
                test_helpers_1.matchers.bigNum(basePayment.mul(2), await link.balanceOf(oc1.address));
            });
            it('gets the LINK deposited back from the oracle', async () => {
                await rate.cancelRequest(request.requestId, request.payment, request.expiration);
                test_helpers_1.matchers.bigNum(basePayment, await link.balanceOf(rate.address));
                test_helpers_1.matchers.bigNum(basePayment, await link.balanceOf(oc1.address));
            });
        });
        describe('when a later answer has not been provided', () => {
            it('does not allow the request to be cancelled', async () => {
                test_helpers_1.matchers.evmRevert(async () => {
                    await rate.cancelRequest(request.requestId, request.payment, request.expiration);
                });
                test_helpers_1.matchers.bigNum(0, await link.balanceOf(rate.address));
                test_helpers_1.matchers.bigNum(basePayment, await link.balanceOf(oc1.address));
            });
        });
    });
    describe('testing various sets of inputs', () => {
        const tests = [
            {
                name: 'ordered ascending',
                responses: [0, 1, 2, 3, 4, 5, 6, 7].map(test_helpers_1.helpers.numToBytes32),
                want: test_helpers_1.helpers.numToBytes32(3),
            },
            {
                name: 'ordered descending',
                responses: [7, 6, 5, 4, 3, 2, 1, 0].map(test_helpers_1.helpers.numToBytes32),
                want: test_helpers_1.helpers.numToBytes32(3),
            },
            {
                name: 'unordered 1',
                responses: [1001, 1, 101, 10, 11, 0, 111].map(test_helpers_1.helpers.numToBytes32),
                want: test_helpers_1.helpers.numToBytes32(11),
            },
            {
                name: 'unordered 2',
                responses: [8, 8, 4, 5, 5, 7, 9, 5, 9].map(test_helpers_1.helpers.numToBytes32),
                want: test_helpers_1.helpers.numToBytes32(7),
            },
            {
                name: 'unordered 3',
                responses: [33, 44, 89, 101, 67, 7, 23, 55, 88, 324, 0, 88].map(test_helpers_1.helpers.numToBytes32),
                want: test_helpers_1.helpers.numToBytes32(61),
            },
            {
                name: 'long unordered',
                responses: [
                    333121,
                    323453,
                    337654,
                    345363,
                    345363,
                    333456,
                    335477,
                    333323,
                    332352,
                    354648,
                    983260,
                    333856,
                    335468,
                    376987,
                    333253,
                    388867,
                    337879,
                    333324,
                    338678,
                ].map(test_helpers_1.helpers.numToBytes32),
                want: test_helpers_1.helpers.numToBytes32(335477),
            },
        ];
        beforeEach(async () => {
            rate = await aggregatorFactory
                .connect(defaultAccount)
                .deploy(link.address, basePayment, 0, [], []);
            await link.transfer(rate.address, deposit);
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const test of tests) {
            const responses = test.responses;
            const oracles = [];
            const jobIds = [];
            it(test.name, async () => {
                var _a, _b;
                for (let i = 0; i < responses.length; i++) {
                    oracles[i] = await oracleFactory
                        .connect(defaultAccount)
                        .deploy(link.address);
                    jobIds[i] = jobId1; // doesn't really matter in this test
                }
                await rate.updateRequestDetails(basePayment, oracles.length, oracles.map(o => o.address), jobIds);
                const requestTx = await rate.requestRateUpdate();
                for (let i = 0; i < responses.length; i++) {
                    const o = oracles[i];
                    const receipt = await requestTx.wait();
                    const log = (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[i * 4 + 3];
                    chai_1.assert.equal(o.address, (_b = log) === null || _b === void 0 ? void 0 : _b.address);
                    const request = test_helpers_1.oracle.decodeRunRequest(log);
                    await o.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, responses[i]));
                }
                test_helpers_1.matchers.bigNum(test.want, await rate.latestAnswer());
            });
        }
    });
});
//# sourceMappingURL=Aggregator.test.js.map