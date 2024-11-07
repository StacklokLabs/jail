"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@chainlink/test-helpers");
const ChainlinkedFactory_1 = require("../src/generated/ChainlinkedFactory");
const chainlinkedFactory = new ChainlinkedFactory_1.ChainlinkedFactory();
describe('Chainlinked', () => {
    it('has a limited public interface', async () => {
        test_helpers_1.matchers.publicAbi(chainlinkedFactory, []);
    });
});
//# sourceMappingURL=Chainlinked.test.js.map