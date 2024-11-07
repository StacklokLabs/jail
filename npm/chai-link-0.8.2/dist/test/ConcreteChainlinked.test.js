"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@chainlink/test-helpers");
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const generated_1 = require("../src/generated");
const concreteChainlinkedFactory = new generated_1.ConcreteChainlinkedFactory();
const emptyOracleFactory = new generated_1.EmptyOracleFactory();
const getterSetterFactory = new generated_1.GetterSetterFactory();
const oracleFactory = new generated_1.OracleFactory();
const linkTokenFactory = new test_helpers_1.contract.LinkTokenFactory();
const provider = test_helpers_1.setup.provider();
let roles;
beforeAll(async () => {
    const users = await test_helpers_1.setup.users(provider);
    roles = users.roles;
});
describe('ConcreteChainlinked', () => {
    const specId = '0x4c7b7ffb66b344fbaa64995af81e355a00000000000000000000000000000000';
    let cc;
    let gs;
    let oc;
    let newoc;
    let link;
    const deployment = test_helpers_1.setup.snapshot(provider, async () => {
        link = await linkTokenFactory.connect(roles.defaultAccount).deploy();
        oc = await oracleFactory.connect(roles.defaultAccount).deploy(link.address);
        newoc = await oracleFactory
            .connect(roles.defaultAccount)
            .deploy(link.address);
        gs = await getterSetterFactory.connect(roles.defaultAccount).deploy();
        cc = await concreteChainlinkedFactory
            .connect(roles.defaultAccount)
            .deploy(link.address, oc.address);
    });
    beforeEach(async () => {
        await deployment();
    });
    describe('#newRequest', () => {
        it('forwards the information to the oracle contract through the link token', async () => {
            var _a;
            const tx = await cc.publicNewRequest(specId, gs.address, ethers_1.ethers.utils.toUtf8Bytes('requestedBytes32(bytes32,bytes32)'));
            const receipt = await tx.wait();
            chai_1.assert.equal(1, (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a.length);
            const [jId, cbAddr, cbFId, cborData] = receipt.logs
                ? test_helpers_1.oracle.decodeCCRequest(receipt.logs[0])
                : [];
            const params = test_helpers_1.helpers.decodeDietCBOR((cborData !== null && cborData !== void 0 ? cborData : ''));
            chai_1.assert.equal(specId, jId);
            chai_1.assert.equal(gs.address, cbAddr);
            chai_1.assert.equal('0xed53e511', cbFId);
            chai_1.assert.deepEqual({}, params);
        });
    });
    describe('#chainlinkRequest(Request)', () => {
        it('emits an event from the contract showing the run ID', async () => {
            var _a, _b, _c;
            const tx = await cc.publicRequest(specId, cc.address, ethers_1.ethers.utils.toUtf8Bytes('fulfillRequest(bytes32,bytes32)'), 0);
            const { events, logs } = await tx.wait();
            chai_1.assert.equal(4, (_a = events) === null || _a === void 0 ? void 0 : _a.length);
            chai_1.assert.equal((_b = logs) === null || _b === void 0 ? void 0 : _b[0].address, cc.address);
            chai_1.assert.equal((_c = events) === null || _c === void 0 ? void 0 : _c[0].event, 'ChainlinkRequested');
        });
    });
    describe('#chainlinkRequestTo(Request)', () => {
        it('emits an event from the contract showing the run ID', async () => {
            var _a, _b;
            const tx = await cc.publicRequestRunTo(newoc.address, specId, cc.address, ethers_1.ethers.utils.toUtf8Bytes('fulfillRequest(bytes32,bytes32)'), 0);
            const { events } = await tx.wait();
            chai_1.assert.equal(4, (_a = events) === null || _a === void 0 ? void 0 : _a.length);
            chai_1.assert.equal((_b = events) === null || _b === void 0 ? void 0 : _b[0].event, 'ChainlinkRequested');
        });
        it('emits an event on the target oracle contract', async () => {
            var _a, _b;
            const tx = await cc.publicRequestRunTo(newoc.address, specId, cc.address, ethers_1.ethers.utils.toUtf8Bytes('fulfillRequest(bytes32,bytes32)'), 0);
            const { logs } = await tx.wait();
            const event = logs && newoc.interface.parseLog(logs[3]);
            chai_1.assert.equal(4, (_a = logs) === null || _a === void 0 ? void 0 : _a.length);
            chai_1.assert.equal((_b = event) === null || _b === void 0 ? void 0 : _b.name, 'OracleRequest');
        });
        it('does not modify the stored oracle address', async () => {
            await cc.publicRequestRunTo(newoc.address, specId, cc.address, ethers_1.ethers.utils.toUtf8Bytes('fulfillRequest(bytes32,bytes32)'), 0);
            const actualOracleAddress = await cc.publicOracleAddress();
            chai_1.assert.equal(oc.address, actualOracleAddress);
        });
    });
    describe('#cancelChainlinkRequest', () => {
        let requestId;
        // a concrete chainlink attached to an empty oracle
        let ecc;
        beforeEach(async () => {
            var _a, _b;
            const emptyOracle = await emptyOracleFactory
                .connect(roles.defaultAccount)
                .deploy();
            ecc = await concreteChainlinkedFactory
                .connect(roles.defaultAccount)
                .deploy(link.address, emptyOracle.address);
            const tx = await ecc.publicRequest(specId, ecc.address, ethers_1.ethers.utils.toUtf8Bytes('fulfillRequest(bytes32,bytes32)'), 0);
            const { events } = await tx.wait();
            requestId = ((_b = (_a = events) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.args).id;
        });
        it('emits an event from the contract showing the run was cancelled', async () => {
            var _a, _b, _c;
            const tx = await ecc.publicCancelRequest(requestId, 0, ethers_1.ethers.utils.hexZeroPad('0x', 4), 0);
            const { events } = await tx.wait();
            chai_1.assert.equal(1, (_a = events) === null || _a === void 0 ? void 0 : _a.length);
            chai_1.assert.equal((_b = events) === null || _b === void 0 ? void 0 : _b[0].event, 'ChainlinkCancelled');
            chai_1.assert.equal(requestId, ((_c = events) === null || _c === void 0 ? void 0 : _c[0].args).id);
        });
        it('throws if given a bogus event ID', async () => {
            await test_helpers_1.matchers.evmRevert(async () => {
                await ecc.publicCancelRequest(ethers_1.ethers.utils.formatBytes32String('bogusId'), 0, ethers_1.ethers.utils.hexZeroPad('0x', 4), 0);
            });
        });
    });
    describe('#recordChainlinkFulfillment(modifier)', () => {
        let request;
        beforeEach(async () => {
            var _a;
            const tx = await cc.publicRequest(specId, cc.address, ethers_1.ethers.utils.toUtf8Bytes('fulfillRequest(bytes32,bytes32)'), 0);
            const { logs } = await tx.wait();
            request = test_helpers_1.oracle.decodeRunRequest((_a = logs) === null || _a === void 0 ? void 0 : _a[3]);
        });
        it('emits an event marking the request fulfilled', async () => {
            var _a, _b, _c;
            const tx = await oc.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, ethers_1.ethers.utils.formatBytes32String('hi mom!')));
            const { logs } = await tx.wait();
            const event = logs && cc.interface.parseLog(logs[0]);
            chai_1.assert.equal(1, (_a = logs) === null || _a === void 0 ? void 0 : _a.length);
            chai_1.assert.equal((_b = event) === null || _b === void 0 ? void 0 : _b.name, 'ChainlinkFulfilled');
            chai_1.assert.equal(request.requestId, (_c = event) === null || _c === void 0 ? void 0 : _c.values.id);
        });
    });
    describe('#fulfillChainlinkRequest(function)', () => {
        let request;
        beforeEach(async () => {
            var _a;
            const tx = await cc.publicRequest(specId, cc.address, ethers_1.ethers.utils.toUtf8Bytes('publicFulfillChainlinkRequest(bytes32,bytes32)'), 0);
            const { logs } = await tx.wait();
            request = test_helpers_1.oracle.decodeRunRequest((_a = logs) === null || _a === void 0 ? void 0 : _a[3]);
        });
        it('emits an event marking the request fulfilled', async () => {
            var _a, _b, _c, _d;
            const tx = await oc.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, ethers_1.ethers.utils.formatBytes32String('hi mom!')));
            const { logs } = await tx.wait();
            const event = logs && cc.interface.parseLog(logs[0]);
            chai_1.assert.equal(1, (_a = logs) === null || _a === void 0 ? void 0 : _a.length);
            chai_1.assert.equal((_b = event) === null || _b === void 0 ? void 0 : _b.name, 'ChainlinkFulfilled');
            chai_1.assert.equal(request.requestId, (_d = (_c = event) === null || _c === void 0 ? void 0 : _c.values) === null || _d === void 0 ? void 0 : _d.id);
        });
    });
    describe('#chainlinkToken', () => {
        it('returns the Link Token address', async () => {
            const addr = await cc.publicChainlinkToken();
            chai_1.assert.equal(addr, link.address);
        });
    });
    describe('#addExternalRequest', () => {
        let mock;
        let request;
        beforeEach(async () => {
            var _a;
            mock = await concreteChainlinkedFactory
                .connect(roles.defaultAccount)
                .deploy(link.address, oc.address);
            const tx = await cc.publicRequest(specId, mock.address, ethers_1.ethers.utils.toUtf8Bytes('fulfillRequest(bytes32,bytes32)'), 0);
            const receipt = await tx.wait();
            request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
            await mock.publicAddExternalRequest(oc.address, request.requestId);
        });
        it('allows the external request to be fulfilled', async () => {
            await oc.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, ethers_1.ethers.utils.formatBytes32String('hi mom!')));
        });
        it('does not allow the same requestId to be used', async () => {
            await test_helpers_1.matchers.evmRevert(async () => {
                await cc.publicAddExternalRequest(newoc.address, request.requestId);
            });
        });
    });
});
//# sourceMappingURL=ConcreteChainlinked.test.js.map