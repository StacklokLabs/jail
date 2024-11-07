"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@chainlink/test-helpers");
const ethers_1 = require("ethers");
const ConcreteSignedSafeMathFactory_1 = require("../src/generated/ConcreteSignedSafeMathFactory");
const concreteSignedSafeMathFactory = new ConcreteSignedSafeMathFactory_1.ConcreteSignedSafeMathFactory();
const provider = test_helpers_1.setup.provider();
let defaultAccount;
beforeAll(async () => {
    const { wallet } = await test_helpers_1.wallet.createFundedWallet(provider, 0);
    defaultAccount = wallet;
});
describe('SignedSafeMath', () => {
    // a version of the adder contract where we make all ABI exposed functions constant
    // TODO: submit upstream PR to support constant contract type generation
    let adder;
    let response;
    const INT256_MAX = ethers_1.ethers.utils.bigNumberify('57896044618658097711785492504343953926634992332820282019728792003956564819967');
    const INT256_MIN = ethers_1.ethers.utils.bigNumberify('-57896044618658097711785492504343953926634992332820282019728792003956564819968');
    const deployment = test_helpers_1.setup.snapshot(provider, async () => {
        adder = await concreteSignedSafeMathFactory.connect(defaultAccount).deploy();
    });
    beforeEach(async () => {
        await deployment();
    });
    describe('#add', () => {
        describe('given a positive and positive', () => {
            it('works', async () => {
                response = await adder.testAdd(1, 2);
                test_helpers_1.matchers.bigNum(3, response);
            });
            it('works with zero', async () => {
                response = await adder.testAdd(INT256_MAX, 0);
                test_helpers_1.matchers.bigNum(INT256_MAX, response);
            });
            describe('when both are large enough to overflow', () => {
                it('throws', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        response = await adder.testAdd(INT256_MAX, 1);
                    });
                });
            });
        });
        describe('given a negative and negative', () => {
            it('works', async () => {
                response = await adder.testAdd(-1, -2);
                test_helpers_1.matchers.bigNum(-3, response);
            });
            it('works with zero', async () => {
                response = await adder.testAdd(INT256_MIN, 0);
                test_helpers_1.matchers.bigNum(INT256_MIN, response);
            });
            describe('when both are large enough to overflow', () => {
                it('throws', async () => {
                    await test_helpers_1.matchers.evmRevert(async () => {
                        await adder.testAdd(INT256_MIN, -1);
                    });
                });
            });
        });
        describe('given a positive and negative', () => {
            it('works', async () => {
                response = await adder.testAdd(1, -2);
                test_helpers_1.matchers.bigNum(-1, response);
            });
        });
        describe('given a negative and positive', () => {
            it('works', async () => {
                response = await adder.testAdd(-1, 2);
                test_helpers_1.matchers.bigNum(1, response);
            });
        });
    });
});
//# sourceMappingURL=SignedSafeMath.test.js.map