"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@chainlink/test-helpers");
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const GetterSetterFactory_1 = require("../src/generated/GetterSetterFactory");
const GetterSetterContract = new GetterSetterFactory_1.GetterSetterFactory();
const provider = test_helpers_1.setup.provider();
let roles;
beforeAll(async () => {
    const users = await test_helpers_1.setup.users(provider);
    roles = users.roles;
});
describe('GetterSetter', () => {
    const requestId = '0x3bd198932d9cc01e2950ffc518fd38a303812200000000000000000000000000';
    const bytes32 = ethers_1.ethers.utils.formatBytes32String('Hi Mom!');
    const uint256 = ethers_1.ethers.utils.bigNumberify(645746535432);
    let gs;
    const deployment = test_helpers_1.setup.snapshot(provider, async () => {
        gs = await GetterSetterContract.connect(roles.defaultAccount).deploy();
    });
    beforeEach(async () => {
        await deployment();
    });
    describe('#setBytes32Val', () => {
        it('updates the bytes32 value', async () => {
            await gs.connect(roles.stranger).setBytes32(bytes32);
            const currentBytes32 = await gs.getBytes32();
            chai_1.assert.equal(ethers_1.ethers.utils.toUtf8String(currentBytes32), ethers_1.ethers.utils.toUtf8String(bytes32));
        });
        it('logs an event', async () => {
            var _a, _b;
            const tx = await gs.connect(roles.stranger).setBytes32(bytes32);
            const receipt = await tx.wait();
            const args = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a[0].args;
            chai_1.assert.equal(1, (_b = receipt.events) === null || _b === void 0 ? void 0 : _b.length);
            chai_1.assert.equal(roles.stranger.address.toLowerCase(), args.from.toLowerCase());
            chai_1.assert.equal(ethers_1.ethers.utils.toUtf8String(bytes32), ethers_1.ethers.utils.toUtf8String(args.value));
        });
    });
    describe('#requestedBytes32', () => {
        it('updates the request ID and value', async () => {
            await gs.connect(roles.stranger).requestedBytes32(requestId, bytes32);
            const currentRequestId = await gs.requestId();
            chai_1.assert.equal(currentRequestId, requestId);
            const currentBytes32 = await gs.getBytes32();
            chai_1.assert.equal(ethers_1.ethers.utils.toUtf8String(currentBytes32), ethers_1.ethers.utils.toUtf8String(bytes32));
        });
    });
    describe('#setUint256', () => {
        it('updates uint256 value', async () => {
            await gs.connect(roles.stranger).setUint256(uint256);
            const currentUint256 = await gs.getUint256();
            chai_1.assert.isTrue(currentUint256.eq(uint256));
        });
        it('logs an event', async () => {
            var _a, _b;
            const tx = await gs.connect(roles.stranger).setUint256(uint256);
            const receipt = await tx.wait();
            const args = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a[0].args;
            chai_1.assert.equal(1, (_b = receipt.events) === null || _b === void 0 ? void 0 : _b.length);
            chai_1.assert.equal(roles.stranger.address.toLowerCase(), args.from.toLowerCase());
            chai_1.assert.isTrue(uint256.eq(args.value));
        });
    });
    describe('#requestedUint256', () => {
        it('updates the request ID and value', async () => {
            await gs.connect(roles.stranger).requestedUint256(requestId, uint256);
            const currentRequestId = await gs.requestId();
            chai_1.assert.equal(currentRequestId, requestId);
            const currentUint256 = await gs.getUint256();
            chai_1.assert.isTrue(currentUint256.eq(uint256));
        });
    });
});
//# sourceMappingURL=GetterSetter.test.js.map