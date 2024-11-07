"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@chainlink/test-helpers");
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const ConcreteChainlinkFactory_1 = require("../src/generated/ConcreteChainlinkFactory");
const provider = test_helpers_1.setup.provider();
const concreteChainlinkFactory = new ConcreteChainlinkFactory_1.ConcreteChainlinkFactory();
const debug = test_helpers_1.debug.makeDebug('ConcreteChainlink');
describe('ConcreteChainlink', () => {
    let ccl;
    let defaultAccount;
    const deployment = test_helpers_1.setup.snapshot(provider, async () => {
        defaultAccount = await test_helpers_1.setup
            .users(provider)
            .then(r => r.roles.defaultAccount);
        ccl = await concreteChainlinkFactory.connect(defaultAccount).deploy();
    });
    beforeEach(async () => {
        await deployment();
    });
    it('has a limited public interface', () => {
        test_helpers_1.matchers.publicAbi(concreteChainlinkFactory, [
            'add',
            'addBytes',
            'addInt',
            'addStringArray',
            'addUint',
            'closeEvent',
            'setBuffer',
        ]);
    });
    async function parseCCLEvent(tx) {
        var _a;
        const receipt = await tx.wait();
        const data = (_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[0].data;
        const d = debug.extend('parseCCLEvent');
        d('data %s', data);
        return ethers_1.ethers.utils.defaultAbiCoder.decode(['bytes'], (data !== null && data !== void 0 ? data : ''));
    }
    describe('#close', () => {
        it('handles empty payloads', async () => {
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            chai_1.assert.deepEqual(decoded, {});
        });
    });
    describe('#setBuffer', () => {
        it('emits the buffer', async () => {
            await ccl.setBuffer('0xA161616162');
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            chai_1.assert.deepEqual(decoded, { a: 'b' });
        });
    });
    describe('#add', () => {
        it('stores and logs keys and values', async () => {
            await ccl.add('first', 'word!!');
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            chai_1.assert.deepEqual(decoded, { first: 'word!!' });
        });
        it('handles two entries', async () => {
            await ccl.add('first', 'uno');
            await ccl.add('second', 'dos');
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            chai_1.assert.deepEqual(decoded, {
                first: 'uno',
                second: 'dos',
            });
        });
    });
    describe('#addBytes', () => {
        it('stores and logs keys and values', async () => {
            await ccl.addBytes('first', '0xaabbccddeeff');
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            const expected = test_helpers_1.helpers.hexToBuf('0xaabbccddeeff');
            chai_1.assert.deepEqual(decoded, { first: expected });
        });
        it('handles two entries', async () => {
            await ccl.addBytes('first', '0x756E6F');
            await ccl.addBytes('second', '0x646F73');
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            const expectedFirst = test_helpers_1.helpers.hexToBuf('0x756E6F');
            const expectedSecond = test_helpers_1.helpers.hexToBuf('0x646F73');
            chai_1.assert.deepEqual(decoded, {
                first: expectedFirst,
                second: expectedSecond,
            });
        });
        it('handles strings', async () => {
            await ccl.addBytes('first', ethers_1.ethers.utils.toUtf8Bytes('apple'));
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            const expected = ethers_1.ethers.utils.toUtf8Bytes('apple');
            chai_1.assert.deepEqual(decoded, { first: expected });
        });
    });
    describe('#addInt', () => {
        it('stores and logs keys and values', async () => {
            await ccl.addInt('first', 1);
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            chai_1.assert.deepEqual(decoded, { first: 1 });
        });
        it('handles two entries', async () => {
            await ccl.addInt('first', 1);
            await ccl.addInt('second', 2);
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            chai_1.assert.deepEqual(decoded, {
                first: 1,
                second: 2,
            });
        });
    });
    describe('#addUint', () => {
        it('stores and logs keys and values', async () => {
            await ccl.addUint('first', 1);
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            chai_1.assert.deepEqual(decoded, { first: 1 });
        });
        it('handles two entries', async () => {
            await ccl.addUint('first', 1);
            await ccl.addUint('second', 2);
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            chai_1.assert.deepEqual(decoded, {
                first: 1,
                second: 2,
            });
        });
    });
    describe('#addStringArray', () => {
        it('stores and logs keys and values', async () => {
            await ccl.addStringArray('word', [
                ethers_1.ethers.utils.formatBytes32String('seinfeld'),
                ethers_1.ethers.utils.formatBytes32String('"4"'),
                ethers_1.ethers.utils.formatBytes32String('LIFE'),
            ]);
            const tx = await ccl.closeEvent();
            const [payload] = await parseCCLEvent(tx);
            const decoded = await test_helpers_1.helpers.decodeDietCBOR(payload);
            chai_1.assert.deepEqual(decoded, { word: ['seinfeld', '"4"', 'LIFE'] });
        });
    });
});
//# sourceMappingURL=ConcreteChainlink.test.js.map