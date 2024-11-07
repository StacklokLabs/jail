"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@chainlink/test-helpers");
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const ENSRegistryFactory_1 = require("../src/generated/ENSRegistryFactory");
const OracleFactory_1 = require("../src/generated/OracleFactory");
const PublicResolverFactory_1 = require("../src/generated/PublicResolverFactory");
const UpdatableConsumerFactory_1 = require("../src/generated/UpdatableConsumerFactory");
const linkTokenFactory = new test_helpers_1.contract.LinkTokenFactory();
const ensRegistryFactory = new ENSRegistryFactory_1.ENSRegistryFactory();
const oracleFactory = new OracleFactory_1.OracleFactory();
const publicResolverFacotory = new PublicResolverFactory_1.PublicResolverFactory();
const updatableConsumerFactory = new UpdatableConsumerFactory_1.UpdatableConsumerFactory();
const provider = test_helpers_1.setup.provider();
let roles;
beforeAll(async () => {
    const users = await test_helpers_1.setup.users(provider);
    roles = users.roles;
});
describe('UpdatableConsumer', () => {
    // https://github.com/ethers-io/ethers-ens/blob/master/src.ts/index.ts#L631
    const ensRoot = ethers_1.ethers.utils.namehash('');
    const tld = 'cltest';
    const tldSubnode = ethers_1.ethers.utils.namehash(tld);
    const domain = 'chainlink';
    const domainNode = ethers_1.ethers.utils.namehash(`${domain}.${tld}`);
    const tokenSubdomain = 'link';
    const tokenSubnode = ethers_1.ethers.utils.namehash(`${tokenSubdomain}.${domain}.${tld}`);
    const oracleSubdomain = 'oracle';
    const oracleSubnode = ethers_1.ethers.utils.namehash(`${oracleSubdomain}.${domain}.${tld}`);
    const specId = ethers_1.ethers.utils.formatBytes32String('someSpecID');
    const newOracleAddress = '0xf000000000000000000000000000000000000ba7';
    let ens;
    let ensResolver;
    let link;
    let oc;
    let uc;
    const deployment = test_helpers_1.setup.snapshot(provider, async () => {
        link = await linkTokenFactory.connect(roles.defaultAccount).deploy();
        oc = await oracleFactory.connect(roles.oracleNode).deploy(link.address);
        ens = await ensRegistryFactory.connect(roles.defaultAccount).deploy();
        ensResolver = await publicResolverFacotory
            .connect(roles.defaultAccount)
            .deploy(ens.address);
        const ensOracleNode = ens.connect(roles.oracleNode);
        const ensResolverOracleNode = ensResolver.connect(roles.oracleNode);
        // register tld
        await ens.setSubnodeOwner(ensRoot, test_helpers_1.helpers.keccak(ethers_1.ethers.utils.toUtf8Bytes(tld)), roles.defaultAccount.address);
        // register domain
        await ens.setSubnodeOwner(tldSubnode, test_helpers_1.helpers.keccak(ethers_1.ethers.utils.toUtf8Bytes(domain)), roles.oracleNode.address);
        await ensOracleNode.setResolver(domainNode, ensResolver.address);
        // register token subdomain to point to token contract
        await ensOracleNode.setSubnodeOwner(domainNode, test_helpers_1.helpers.keccak(ethers_1.ethers.utils.toUtf8Bytes(tokenSubdomain)), roles.oracleNode.address);
        await ensOracleNode.setResolver(tokenSubnode, ensResolver.address);
        await ensResolverOracleNode.setAddr(tokenSubnode, link.address);
        // register oracle subdomain to point to oracle contract
        await ensOracleNode.setSubnodeOwner(domainNode, test_helpers_1.helpers.keccak(ethers_1.ethers.utils.toUtf8Bytes(oracleSubdomain)), roles.oracleNode.address);
        await ensOracleNode.setResolver(oracleSubnode, ensResolver.address);
        await ensResolverOracleNode.setAddr(oracleSubnode, oc.address);
        // deploy updatable consumer contract
        uc = await updatableConsumerFactory
            .connect(roles.defaultAccount)
            .deploy(specId, ens.address, domainNode);
    });
    beforeEach(async () => {
        await deployment();
    });
    describe('constructor', () => {
        it('pulls the token contract address from the resolver', async () => {
            chai_1.assert.equal(link.address, await uc.getChainlinkToken());
        });
        it('pulls the oracle contract address from the resolver', async () => {
            chai_1.assert.equal(oc.address, await uc.getOracle());
        });
    });
    describe('#updateOracle', () => {
        describe('when the ENS resolver has been updated', () => {
            beforeEach(async () => {
                await ensResolver
                    .connect(roles.oracleNode)
                    .setAddr(oracleSubnode, newOracleAddress);
            });
            it("updates the contract's oracle address", async () => {
                await uc.updateOracle();
                chai_1.assert.equal(newOracleAddress.toLowerCase(), (await uc.getOracle()).toLowerCase());
            });
        });
        describe('when the ENS resolver has not been updated', () => {
            it('keeps the same oracle address', async () => {
                await uc.updateOracle();
                chai_1.assert.equal(oc.address, await uc.getOracle());
            });
        });
    });
    describe('#fulfillOracleRequest', () => {
        const response = ethers_1.ethers.utils.formatBytes32String('1,000,000.00');
        const currency = 'USD';
        const paymentAmount = test_helpers_1.helpers.toWei('1');
        let request;
        beforeEach(async () => {
            var _a;
            await link.transfer(uc.address, paymentAmount);
            const tx = await uc.requestEthereumPrice(test_helpers_1.helpers.toHex(ethers_1.ethers.utils.toUtf8Bytes(currency)));
            const receipt = await tx.wait();
            request = test_helpers_1.oracle.decodeRunRequest((_a = receipt.logs) === null || _a === void 0 ? void 0 : _a[3]);
        });
        it('records the data given to it by the oracle', async () => {
            await oc.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
            const currentPrice = await uc.currentPrice();
            chai_1.assert.equal(currentPrice, response);
        });
        describe('when the oracle address is updated before a request is fulfilled', () => {
            beforeEach(async () => {
                await ensResolver
                    .connect(roles.oracleNode)
                    .setAddr(oracleSubnode, newOracleAddress);
                await uc.updateOracle();
                chai_1.assert.equal(newOracleAddress.toLowerCase(), (await uc.getOracle()).toLowerCase());
            });
            it('records the data given to it by the old oracle contract', async () => {
                await oc.fulfillOracleRequest(...test_helpers_1.oracle.convertFufillParams(request, response));
                const currentPrice = await uc.currentPrice();
                chai_1.assert.equal(currentPrice, response);
            });
            it('does not accept responses from the new oracle for the old requests', async () => {
                await test_helpers_1.matchers.evmRevert(async () => {
                    await uc
                        .connect(roles.oracleNode)
                        .fulfill(request.requestId, test_helpers_1.helpers.toHex(response));
                });
                const currentPrice = await uc.currentPrice();
                chai_1.assert.equal(ethers_1.ethers.utils.parseBytes32String(currentPrice), '');
            });
            it('still allows funds to be withdrawn from the oracle', async () => {
                await test_helpers_1.helpers.increaseTime5Minutes(provider);
                test_helpers_1.matchers.bigNum(0, await link.balanceOf(uc.address), 'Initial balance should be 0');
                await uc.cancelRequest(request.requestId, request.payment, request.callbackFunc, request.expiration);
                test_helpers_1.matchers.bigNum(paymentAmount, await link.balanceOf(uc.address), 'Oracle should have been repaid on cancellation.');
            });
        });
    });
});
//# sourceMappingURL=UpdatableConsumer.test.js.map