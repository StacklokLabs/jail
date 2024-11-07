"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@chainlink/test-helpers");
const chai_1 = require("chai");
const PointerFactory_1 = require("../src/generated/PointerFactory");
const pointerFactory = new PointerFactory_1.PointerFactory();
const linkTokenFactory = new test_helpers_1.contract.LinkTokenFactory();
const provider = test_helpers_1.setup.provider();
let roles;
beforeAll(async () => {
    const users = await test_helpers_1.setup.users(provider);
    roles = users.roles;
});
describe('Pointer', () => {
    let pointer;
    let link;
    const deployment = test_helpers_1.setup.snapshot(provider, async () => {
        link = await linkTokenFactory.connect(roles.defaultAccount).deploy();
        pointer = await pointerFactory
            .connect(roles.defaultAccount)
            .deploy(link.address);
    });
    beforeEach(async () => {
        await deployment();
    });
    it('has a limited public interface', () => {
        test_helpers_1.matchers.publicAbi(pointer, ['getAddress']);
    });
    describe('#getAddress', () => {
        it('returns the LINK token address', async () => {
            chai_1.assert.equal(await pointer.getAddress(), link.address);
        });
    });
});
//# sourceMappingURL=Pointer.test.js.map