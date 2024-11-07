"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@chainlink/test-helpers");
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const BasicConsumerFactory_1 = require("../src/generated/BasicConsumerFactory");
const GetterSetterFactory_1 = require("../src/generated/GetterSetterFactory");
const MaliciousConsumerFactory_1 = require("../src/generated/MaliciousConsumerFactory");
const MaliciousRequesterFactory_1 = require("../src/generated/MaliciousRequesterFactory");
const OracleFactory_1 = require("../src/generated/OracleFactory");
const basicConsumerFactory = new BasicConsumerFactory_1.BasicConsumerFactory();
const getterSetterFactory = new GetterSetterFactory_1.GetterSetterFactory();
const maliciousRequesterFactory = new MaliciousRequesterFactory_1.MaliciousRequesterFactory();
const maliciousConsumerFactory = new MaliciousConsumerFactory_1.MaliciousConsumerFactory();
const oracleFactory = new OracleFactory_1.OracleFactory();
const linkTokenFactory = new test_helpers_1.contract.LinkTokenFactory();
let roles;
const provider = test_helpers_1.setup.provider();
beforeAll(async () => {
    const users = await test_helpers_1.setup.users(provider);
    roles = users.roles;
});
describe('Oracle', () => {
    const fHash = getterSetterFactory.interface.functions.requestedBytes32.sighash;
    const specId = '0x4c7b7ffb66b344fbaa64995af81e355a00000000000000000000000000000000';
    const to = '0x80e29acb842498fe6591f020bd82766dce619d43';
    let link;
    let oc;
    const deployment = test_helpers_1.setup.snapshot(provider, async () => {
        link = await linkTokenFactory.connect(roles.defaultAccount).deploy();
        oc = await oracleFactory.connect(roles.defaultAccount).deploy(link.address);
        await oc.setFulfillmentPermission(roles.oracleNode.address, true);
    });
    beforeEach(async () => {
        await deployment();
    });
    it('has a limited public interface', () => {
        test_helpers_1.matchers.publicAbi(oracleFactory, [
            'EXPIRY_TIME',
            'cancelOracleRequest',
            'fulfillOracleRequest',
            'getAuthorizationStatus',
            'onTokenTransfer',
            'oracleRequest',
            'setFulfillmentPermission',
            'withdraw',
            'withdrawable',
            // Ownable methods:
            'owner',
            'renounceOwnership',
            'transferOwnership',
        ]);
    });
    describe('#setFulfillmentPermission', () => {
        describe('when called by the owner', () => {
            beforeEach(async () => {
                await oc
                    .connect(roles.defaultAccount)
                    .setFulfillmentPermission(roles.stranger.address, true);
            });
            it('adds an authorized node', async () => {
                const authorized = await oc.getAuthorizationStatus(roles.stranger.address);
                chai_1.assert.equal(true, authorized);
            });
            it('removes an authorized node', async () => {
                await oc
                    .connect(roles.defaultAccount)
                    .setFulfillmentPermission(roles.stranger.address, false);
                const authorized = await oc.getAuthorizationStatus(roles.stranger.address);
                chai_1.assert.equal(false, authorized);
            });
        });
        describe('when called by a non-owner', () => {
            it('cannot add an authorized node', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await oc
                        .connect(roles.stranger)
                        .setFulfillmentPermission(roles.stranger.address, true);
                });
            });
        });
    });
    describe('#onTokenTransfer', () => {
        describe('when called from any address but the LINK token', () => {
            it('triggers the intended method', async () => {
                const callData = test_helpers_1.oracle.encodeOracleRequest(specId, to, fHash, 0, '0x0');
                await test_helpers_1.matchers.evmRevert(async () => {
                    await oc.onTokenTransfer(roles.defaultAccount.address, 0, callData);
                });
            });
        });
        describe('when called from the LINK token', () => {
            it('triggers the intended method', async () => {
                var _a;
                const callData = test_helpers_1.oracle.encodeOracleRequest(specId, to, fHash, 0, '0x0');
                const tx = await link.transferAndCall(oc.address, 0, callData, {
                    value: 0,
                });
                const receipt = await tx.wait();
                chai_1.assert.equal(3, (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a.length);
            });
            describe('with no data', () => {
                it('reverts', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await link.transferAndCall(oc.address, 0, '0x', {
                            value: 0,
                        });
                    });
                });
            });
        });
        describe('malicious requester', () => {
            let mock;
            let requester;
            const paymentAmount = test_helpers_1.helpers.toWei('1');
            beforeEach(async () => {
                mock = await maliciousRequesterFactory
                    .connect(roles.defaultAccount)
                    .deploy(link.address, oc.address);
                await link.transfer(mock.address, paymentAmount);
            });
            it('cannot withdraw from oracle', async () => {
                const ocOriginalBalance = await link.balanceOf(oc.address);
                const mockOriginalBalance = await link.balanceOf(mock.address);
                await test_helpers_1.matchers.evmRevert(async () => {
                    await mock.maliciousWithdraw();
                });
                const ocNewBalance = await link.balanceOf(oc.address);
                const mockNewBalance = await link.balanceOf(mock.address);
                test_helpers_1.matchers.bigNum(ocOriginalBalance, ocNewBalance);
                test_helpers_1.matchers.bigNum(mockNewBalance, mockOriginalBalance);
            });
            describe('if the requester tries to create a requestId for another contract', () => {
                it('the requesters ID will not match with the oracle contract', async () => {
                    var _a, _b;
                    const tx = await mock.maliciousTargetConsumer(to);
                    const receipt = await tx.wait();
                    const mockRequestId = (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[0].data;
                    const requestId = ((_b = receipt.events) === null || _b === void 0 ? void 0 : _b[0].args).requestId;
                    chai_1.assert.notEqual(mockRequestId, requestId);
                });
                it('the target requester can still create valid requests', async () => {
                    requester = await basicConsumerFactory
                        .connect(roles.defaultAccount)
                        .deploy(link.address, oc.address, specId);
                    await link.transfer(requester.address, paymentAmount);
                    await mock.maliciousTargetConsumer(requester.address);
                    await requester.requestEthereumPrice('USD');
                });
            });
        });
        it('does not allow recursive calls of onTokenTransfer', async () => {
            const requestPayload = test_helpers_1.oracle.encodeOracleRequest(specId, to, fHash, 0, '0x0');
            const ottSelector = oracleFactory.interface.functions.onTokenTransfer.sighash;
            const header = '000000000000000000000000c5fdf4076b8f3a5357c5e395ab970b5b54098fef' + // to
                '0000000000000000000000000000000000000000000000000000000000000539' + // amount
                '0000000000000000000000000000000000000000000000000000000000000060' + // offset
                '0000000000000000000000000000000000000000000000000000000000000136'; //   length
            const maliciousPayload = ottSelector + header + requestPayload.slice(2);
            await test_helpers_1.matchers.evmRevert(async () => {
                await link.transferAndCall(oc.address, 0, maliciousPayload, {
                    value: 0,
                });
            });
        });
    });
    describe('#oracleRequest', () => {
        describe('when called through the LINK token', () => {
            const paid = 100;
            let log;
            let receipt;
            beforeEach(async () => {
                var _a, _b;
                const args = test_helpers_1.oracle.encodeOracleRequest(specId, to, fHash, 1, '0x0');
                const tx = await link.transferAndCall(oc.address, paid, args);
                receipt = await tx.wait();
                chai_1.assert.equal(3, (_b = (_a = receipt) === null || _a === void 0 ? void 0 : _a.logs) === null || _b === void 0 ? void 0 : _b.length);
                log = receipt.logs && receipt.logs[2];
            });
            it('logs an event', async () => {
                var _a, _b, _c, _d, _e;
                chai_1.assert.equal(oc.address, (_a = log) === null || _a === void 0 ? void 0 : _a.address);
                chai_1.assert.equal((_c = (_b = log) === null || _b === void 0 ? void 0 : _b.topics) === null || _c === void 0 ? void 0 : _c[1], specId);
                const req = test_helpers_1.oracle.decodeRunRequest((_e = (_d = receipt) === null || _d === void 0 ? void 0 : _d.logs) === null || _e === void 0 ? void 0 : _e[2]);
                chai_1.assert.equal(roles.defaultAccount.address, req.requester);
                test_helpers_1.matchers.bigNum(paid, req.payment);
            });
            it('uses the expected event signature', async () => {
                var _a, _b;
                // If updating this test, be sure to update models.RunLogTopic.
                const eventSignature = '0xd8d7ecc4800d25fa53ce0372f13a416d98907a7ef3d8d3bdd79cf4fe75529c65';
                chai_1.assert.equal(eventSignature, (_b = (_a = log) === null || _a === void 0 ? void 0 : _a.topics) === null || _b === void 0 ? void 0 : _b[0]);
            });
            it('does not allow the same requestId to be used twice', async () => {
                const args2 = test_helpers_1.oracle.encodeOracleRequest(specId, to, fHash, 1, '0x0');
                await test_helpers_1.matchers.evmRevert(async () => {
                    await link.transferAndCall(oc.address, paid, args2);
                });
            });
            describe('when called with a payload less than 2 EVM words + function selector', () => {
                const funcSelector = oracleFactory.interface.functions.oracleRequest.sighash;
                const maliciousData = funcSelector +
                    '0000000000000000000000000000000000000000000000000000000000000000000';
                it('throws an error', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await link.transferAndCall(oc.address, paid, maliciousData);
                    });
                });
            });
            describe('when called with a payload between 3 and 9 EVM words', () => {
                const funcSelector = oracleFactory.interface.functions.oracleRequest.sighash;
                const maliciousData = funcSelector +
                    '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001';
                it('throws an error', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await link.transferAndCall(oc.address, paid, maliciousData);
                    });
                });
            });
        });
        describe('when not called through the LINK token', () => {
            it('reverts', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await oc
                        .connect(roles.oracleNode)
                        .oracleRequest('0x0000000000000000000000000000000000000000', 0, specId, to, fHash, 1, 1, '0x');
                });
            });
        });
    });
    describe('#fulfillOracleRequest', () => {
        const response = 'Hi Mom!';
        let maliciousRequester;
        let basicConsumer;
        let maliciousConsumer;
        let request;
        describe('cooperative consumer', () => {
            beforeEach(async () => {
                var _a;
                basicConsumer = await basicConsumerFactory
                    .connect(roles.defaultAccount)
                    .deploy(link.address, oc.address, specId);
                const paymentAmount = test_helpers_1.helpers.toWei('1');
                await link.transfer(basicConsumer.address, paymentAmount);
                const currency = 'USD';
                const tx = await basicConsumer.requestEthereumPrice(currency);
                const receipt = await tx.wait();
                request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
            });
            describe('when called by an unauthorized node', () => {
                beforeEach(async () => {
                    chai_1.assert.equal(false, await oc.getAuthorizationStatus(roles.stranger.address));
                });
                it('raises an error', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await oc
                            .connect(roles.stranger)
                            .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    });
                });
            });
            describe('when called by an authorized node', () => {
                it('raises an error if the request ID does not exist', async () => {
                    request.requestId = ethers_1.ethers.utils.formatBytes32String('DOESNOTEXIST');
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await oc
                            .connect(roles.oracleNode)
                            .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    });
                });
                it('sets the value on the requested contract', async () => {
                    await oc
                        .connect(roles.oracleNode)
                        .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    const currentValue = await basicConsumer.currentPrice();
                    chai_1.assert.equal(response, ethers_1.ethers.utils.parseBytes32String(currentValue));
                });
                it('does not allow a request to be fulfilled twice', async () => {
                    const response2 = response + ' && Hello World!!';
                    await oc
                        .connect(roles.oracleNode)
                        .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await oc
                            .connect(roles.oracleNode)
                            .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response2));
                    });
                    const currentValue = await basicConsumer.currentPrice();
                    chai_1.assert.equal(response, ethers_1.ethers.utils.parseBytes32String(currentValue));
                });
            });
            describe('when the oracle does not provide enough gas', () => {
                // if updating this defaultGasLimit, be sure it matches with the
                // defaultGasLimit specified in store/tx_manager.go
                const defaultGasLimit = 500000;
                beforeEach(async () => {
                    test_helpers_1.matchers.bigNum(0, await oc.withdrawable());
                });
                it('does not allow the oracle to withdraw the payment', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await oc.connect(roles.oracleNode).fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response, {
                            gasLimit: 70000,
                        }));
                    });
                    test_helpers_1.matchers.bigNum(0, await oc.withdrawable());
                });
                it(`${defaultGasLimit} is enough to pass the gas requirement`, async () => {
                    await oc.connect(roles.oracleNode).fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response, {
                        gasLimit: defaultGasLimit,
                    }));
                    test_helpers_1.matchers.bigNum(request.payment, await oc.withdrawable());
                });
            });
        });
        describe('with a malicious requester', () => {
            beforeEach(async () => {
                const paymentAmount = test_helpers_1.helpers.toWei('1');
                maliciousRequester = await maliciousRequesterFactory
                    .connect(roles.defaultAccount)
                    .deploy(link.address, oc.address);
                await link.transfer(maliciousRequester.address, paymentAmount);
            });
            it('cannot cancel before the expiration', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await maliciousRequester.maliciousRequestCancel(specId, ethers_1.ethers.utils.toUtf8Bytes('doesNothing(bytes32,bytes32)'));
                });
            });
            it('cannot call functions on the LINK token through callbacks', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await maliciousRequester.request(specId, link.address, ethers_1.ethers.utils.toUtf8Bytes('transfer(address,uint256)'));
                });
            });
            describe('requester lies about amount of LINK sent', () => {
                it('the oracle uses the amount of LINK actually paid', async () => {
                    var _a;
                    const tx = await maliciousRequester.maliciousPrice(specId);
                    const receipt = await tx.wait();
                    const req = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                    chai_1.assert(test_helpers_1.helpers.toWei('1').eq(req.payment));
                });
            });
        });
        describe('with a malicious consumer', () => {
            const paymentAmount = test_helpers_1.helpers.toWei('1');
            beforeEach(async () => {
                maliciousConsumer = await maliciousConsumerFactory
                    .connect(roles.defaultAccount)
                    .deploy(link.address, oc.address);
                await link.transfer(maliciousConsumer.address, paymentAmount);
            });
            describe('fails during fulfillment', () => {
                beforeEach(async () => {
                    var _a;
                    const tx = await maliciousConsumer.requestData(specId, ethers_1.ethers.utils.toUtf8Bytes('assertFail(bytes32,bytes32)'));
                    const receipt = await tx.wait();
                    request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                });
                it('allows the oracle node to receive their payment', async () => {
                    await oc
                        .connect(roles.oracleNode)
                        .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    const balance = await link.balanceOf(roles.oracleNode.address);
                    test_helpers_1.matchers.bigNum(balance, 0);
                    await oc
                        .connect(roles.defaultAccount)
                        .withdraw(roles.oracleNode.address, paymentAmount);
                    const newBalance = await link.balanceOf(roles.oracleNode.address);
                    test_helpers_1.matchers.bigNum(paymentAmount, newBalance);
                });
                it("can't fulfill the data again", async () => {
                    const response2 = 'hack the planet 102';
                    await oc
                        .connect(roles.oracleNode)
                        .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await oc
                            .connect(roles.oracleNode)
                            .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response2));
                    });
                });
            });
            describe('calls selfdestruct', () => {
                beforeEach(async () => {
                    var _a;
                    const tx = await maliciousConsumer.requestData(specId, ethers_1.ethers.utils.toUtf8Bytes('doesNothing(bytes32,bytes32)'));
                    const receipt = await tx.wait();
                    request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                    await maliciousConsumer.remove();
                });
                it('allows the oracle node to receive their payment', async () => {
                    await oc
                        .connect(roles.oracleNode)
                        .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    const balance = await link.balanceOf(roles.oracleNode.address);
                    test_helpers_1.matchers.bigNum(balance, 0);
                    await oc
                        .connect(roles.defaultAccount)
                        .withdraw(roles.oracleNode.address, paymentAmount);
                    const newBalance = await link.balanceOf(roles.oracleNode.address);
                    test_helpers_1.matchers.bigNum(paymentAmount, newBalance);
                });
            });
            describe('request is canceled during fulfillment', () => {
                beforeEach(async () => {
                    var _a;
                    const tx = await maliciousConsumer.requestData(specId, ethers_1.ethers.utils.toUtf8Bytes('cancelRequestOnFulfill(bytes32,bytes32)'));
                    const receipt = await tx.wait();
                    request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                    test_helpers_1.matchers.bigNum(0, await link.balanceOf(maliciousConsumer.address));
                });
                it('allows the oracle node to receive their payment', async () => {
                    await oc
                        .connect(roles.oracleNode)
                        .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    const mockBalance = await link.balanceOf(maliciousConsumer.address);
                    test_helpers_1.matchers.bigNum(mockBalance, 0);
                    const balance = await link.balanceOf(roles.oracleNode.address);
                    test_helpers_1.matchers.bigNum(balance, 0);
                    await oc
                        .connect(roles.defaultAccount)
                        .withdraw(roles.oracleNode.address, paymentAmount);
                    const newBalance = await link.balanceOf(roles.oracleNode.address);
                    test_helpers_1.matchers.bigNum(paymentAmount, newBalance);
                });
                it("can't fulfill the data again", async () => {
                    const response2 = 'hack the planet 102';
                    await oc
                        .connect(roles.oracleNode)
                        .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await oc
                            .connect(roles.oracleNode)
                            .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response2));
                    });
                });
            });
            describe('tries to steal funds from node', () => {
                it('is not successful with call', async () => {
                    var _a;
                    const tx = await maliciousConsumer.requestData(specId, ethers_1.ethers.utils.toUtf8Bytes('stealEthCall(bytes32,bytes32)'));
                    const receipt = await tx.wait();
                    request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                    await oc
                        .connect(roles.oracleNode)
                        .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    test_helpers_1.matchers.bigNum(0, await provider.getBalance(maliciousConsumer.address));
                });
                it('is not successful with send', async () => {
                    var _a;
                    const tx = await maliciousConsumer.requestData(specId, ethers_1.ethers.utils.toUtf8Bytes('stealEthSend(bytes32,bytes32)'));
                    const receipt = await tx.wait();
                    request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                    await oc
                        .connect(roles.oracleNode)
                        .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    test_helpers_1.matchers.bigNum(0, await provider.getBalance(maliciousConsumer.address));
                });
                it('is not successful with transfer', async () => {
                    var _a;
                    const tx = await maliciousConsumer.requestData(specId, ethers_1.ethers.utils.toUtf8Bytes('stealEthTransfer(bytes32,bytes32)'));
                    const receipt = await tx.wait();
                    request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
                    await oc
                        .connect(roles.oracleNode)
                        .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                    test_helpers_1.matchers.bigNum(0, await provider.getBalance(maliciousConsumer.address));
                });
            });
        });
    });
    describe('#withdraw', () => {
        describe('without reserving funds via oracleRequest', () => {
            it('does nothing', async () => {
                let balance = await link.balanceOf(roles.oracleNode.address);
                chai_1.assert.equal(0, balance.toNumber());
                await test_helpers_1.matchers.evmRevert(async () => {
                    await oc
                        .connect(roles.defaultAccount)
                        .withdraw(roles.oracleNode.address, test_helpers_1.helpers.toWei('1'));
                });
                balance = await link.balanceOf(roles.oracleNode.address);
                chai_1.assert.equal(0, balance.toNumber());
            });
        });
        describe('reserving funds via oracleRequest', () => {
            const payment = 15;
            let request;
            beforeEach(async () => {
                var _a, _b;
                const mock = await getterSetterFactory
                    .connect(roles.defaultAccount)
                    .deploy();
                const args = test_helpers_1.oracle.encodeOracleRequest(specId, mock.address, fHash, 0, '0x0');
                const tx = await link.transferAndCall(oc.address, payment, args);
                const receipt = await tx.wait();
                chai_1.assert.equal(3, (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a.length);
                request = test_helpers_1.oracle.decodeRunRequest((_b = receipt.logs) === null || _b === void 0 ? void 0 : _b[2]);
            });
            describe('but not freeing funds w fulfillOracleRequest', () => {
                it('does not transfer funds', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await oc
                            .connect(roles.defaultAccount)
                            .withdraw(roles.oracleNode.address, payment);
                    });
                    const balance = await link.balanceOf(roles.oracleNode.address);
                    chai_1.assert.equal(0, balance.toNumber());
                });
            });
            describe('and freeing funds', () => {
                beforeEach(async () => {
                    await oc
                        .connect(roles.oracleNode)
                        .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, 'Hello World!'));
                });
                it('does not allow input greater than the balance', async () => {
                    const originalOracleBalance = await link.balanceOf(oc.address);
                    const originalStrangerBalance = await link.balanceOf(roles.stranger.address);
                    const withdrawalAmount = payment + 1;
                    chai_1.assert.isAbove(withdrawalAmount, originalOracleBalance.toNumber());
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await oc
                            .connect(roles.defaultAccount)
                            .withdraw(roles.stranger.address, withdrawalAmount);
                    });
                    const newOracleBalance = await link.balanceOf(oc.address);
                    const newStrangerBalance = await link.balanceOf(roles.stranger.address);
                    chai_1.assert.equal(originalOracleBalance.toNumber(), newOracleBalance.toNumber());
                    chai_1.assert.equal(originalStrangerBalance.toNumber(), newStrangerBalance.toNumber());
                });
                it('allows transfer of partial balance by owner to specified address', async () => {
                    const partialAmount = 6;
                    const difference = payment - partialAmount;
                    await oc
                        .connect(roles.defaultAccount)
                        .withdraw(roles.stranger.address, partialAmount);
                    const strangerBalance = await link.balanceOf(roles.stranger.address);
                    const oracleBalance = await link.balanceOf(oc.address);
                    chai_1.assert.equal(partialAmount, strangerBalance.toNumber());
                    chai_1.assert.equal(difference, oracleBalance.toNumber());
                });
                it('allows transfer of entire balance by owner to specified address', async () => {
                    await oc
                        .connect(roles.defaultAccount)
                        .withdraw(roles.stranger.address, payment);
                    const balance = await link.balanceOf(roles.stranger.address);
                    chai_1.assert.equal(payment, balance.toNumber());
                });
                it('does not allow a transfer of funds by non-owner', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await oc
                            .connect(roles.stranger)
                            .withdraw(roles.stranger.address, payment);
                    });
                    const balance = await link.balanceOf(roles.stranger.address);
                    chai_1.assert.isTrue(ethers_1.ethers.constants.Zero.eq(balance));
                });
            });
        });
    });
    describe('#withdrawable', () => {
        let request;
        beforeEach(async () => {
            var _a, _b;
            const amount = test_helpers_1.helpers.toWei('1');
            const mock = await getterSetterFactory
                .connect(roles.defaultAccount)
                .deploy();
            const args = test_helpers_1.oracle.encodeOracleRequest(specId, mock.address, fHash, 0, '0x0');
            const tx = await link.transferAndCall(oc.address, amount, args);
            const receipt = await tx.wait();
            chai_1.assert.equal(3, (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a.length);
            request = test_helpers_1.oracle.decodeRunRequest((_b = receipt.logs) === null || _b === void 0 ? void 0 : _b[2]);
            await oc
                .connect(roles.oracleNode)
                .fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, 'Hello World!'));
        });
        it('returns the correct value', async () => {
            const withdrawAmount = await oc.withdrawable();
            test_helpers_1.matchers.bigNum(withdrawAmount, request.payment);
        });
    });
    describe('#cancelOracleRequest', () => {
        describe('with no pending requests', () => {
            it('fails', async () => {
                const fakeRequest = {
                    requestId: ethers_1.ethers.utils.formatBytes32String('1337'),
                    payment: '0',
                    callbackFunc: getterSetterFactory.interface.functions.requestedBytes32.sighash,
                    expiration: '999999999999',
                    callbackAddr: '',
                    data: Buffer.from(''),
                    dataVersion: 0,
                    specId: '',
                    requester: '',
                    topic: '',
                };
                await test_helpers_1.helpers.increaseTime5Minutes(provider);
                await test_helpers_1.matchers.evmRevert(async () => {
                    await oc
                        .connect(roles.stranger)
                        .cancelOracleRequest(...test_helpers_1.oracle.convertCancelParams(fakeRequest));
                });
            });
        });
        describe('with a pending request', () => {
            const startingBalance = 100;
            let request;
            let receipt;
            beforeEach(async () => {
                var _a, _b;
                const requestAmount = 20;
                await link.transfer(roles.consumer.address, startingBalance);
                const args = test_helpers_1.oracle.encodeOracleRequest(specId, roles.consumer.address, fHash, 1, '0x0');
                const tx = await link
                    .connect(roles.consumer)
                    .transferAndCall(oc.address, requestAmount, args);
                receipt = await tx.wait();
                chai_1.assert.equal(3, (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a.length);
                request = test_helpers_1.oracle.decodeRunRequest((_b = receipt.logs) === null || _b === void 0 ? void 0 : _b[2]);
            });
            it('has correct initial balances', async () => {
                const oracleBalance = await link.balanceOf(oc.address);
                test_helpers_1.matchers.bigNum(request.payment, oracleBalance);
                const consumerAmount = await link.balanceOf(roles.consumer.address);
                chai_1.assert.equal(startingBalance - Number(request.payment), consumerAmount.toNumber());
            });
            describe('from a stranger', () => {
                it('fails', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await oc
                            .connect(roles.consumer)
                            .cancelOracleRequest(...test_helpers_1.oracle.convertCancelParams(request));
                    });
                });
            });
            describe('from the requester', () => {
                it('refunds the correct amount', async () => {
                    await test_helpers_1.helpers.increaseTime5Minutes(provider);
                    await oc
                        .connect(roles.consumer)
                        .cancelOracleRequest(...test_helpers_1.oracle.convertCancelParams(request));
                    const balance = await link.balanceOf(roles.consumer.address);
                    chai_1.assert.equal(startingBalance, balance.toNumber()); // 100
                });
                it('triggers a cancellation event', async () => {
                    var _a, _b;
                    await test_helpers_1.helpers.increaseTime5Minutes(provider);
                    const tx = await oc
                        .connect(roles.consumer)
                        .cancelOracleRequest(...test_helpers_1.oracle.convertCancelParams(request));
                    const receipt = await tx.wait();
                    chai_1.assert.equal((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a.length, 2);
                    chai_1.assert.equal(request.requestId, (_b = receipt.logs) === null || _b === void 0 ? void 0 : _b[0].topics[1]);
                });
                it('fails when called twice', async () => {
                    await test_helpers_1.helpers.increaseTime5Minutes(provider);
                    await oc
                        .connect(roles.consumer)
                        .cancelOracleRequest(...test_helpers_1.oracle.convertCancelParams(request));
                    await test_helpers_1.matchers.evmRevert(oc
                        .connect(roles.consumer)
                        .cancelOracleRequest(...test_helpers_1.oracle.convertCancelParams(request)));
                });
            });
        });
    });
});
//# sourceMappingURL=Oracle.test.js.map