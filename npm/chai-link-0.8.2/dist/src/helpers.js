"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const wallet_1 = require("./wallet");
const chai_1 = require("chai");
const chainlinkv0_5_1 = require("chainlinkv0.5");
const debug_1 = require("./debug");
const cbor_1 = __importDefault(require("cbor"));
const OracleFactory_1 = require("./generated/OracleFactory");
const debug = debug_1.makeDebug('helpers');
// duplicated in evm/v0.5/test/support/helpers.ts
const SERVICE_AGREEMENT_TYPES = [
    'uint256',
    'uint256',
    'uint256',
    'address[]',
    'bytes32',
    'address',
    'bytes4',
    'bytes4',
];
// duplicated in evm/v0.5/test/support/helpers.ts
const ORACLE_SIGNATURES_TYPES = ['uint8[]', 'bytes32[]', 'bytes32[]'];
/**
 * This helper function allows us to make use of ganache snapshots,
 * which allows us to snapshot one state instance and revert back to it.
 *
 * This is used to memoize expensive setup calls typically found in beforeEach hooks when we
 * need to setup our state with contract deployments before running assertions.
 *
 * @param provider The provider that's used within the tests
 * @param cb The callback to execute that generates the state we want to snapshot
 */
function useSnapshot(provider, cb) {
    const d = debug.extend('memoizeDeploy');
    let hasDeployed = false;
    let snapshotId = '';
    return async () => {
        if (!hasDeployed) {
            d('executing deployment..');
            await cb();
            d('snapshotting...');
            /* eslint-disable-next-line require-atomic-updates */
            snapshotId = await provider.send('evm_snapshot', undefined);
            d('snapshot id:%s', snapshotId);
            /* eslint-disable-next-line require-atomic-updates */
            hasDeployed = true;
        }
        else {
            d('reverting to snapshot: %s', snapshotId);
            await provider.send('evm_revert', snapshotId);
            d('re-creating snapshot..');
            /* eslint-disable-next-line require-atomic-updates */
            snapshotId = await provider.send('evm_snapshot', undefined);
            d('recreated snapshot id:%s', snapshotId);
        }
    };
}
exports.useSnapshot = useSnapshot;
/**
 * A wrapper function to make generated contracts compatible with truffle test suites.
 *
 * Note that the returned contract is an instance of ethers.Contract, not a @truffle/contract, so there are slight
 * api differences, though largely the same.
 *
 * @see https://docs.ethers.io/ethers.js/html/api-contract.html
 * @param contractFactory The ethers based contract factory to interop with
 * @param address The address to supply as the signer
 */
function create(contractFactory, address) {
    const web3Instance = global.web3;
    const provider = new ethers_1.ethers.providers.Web3Provider(web3Instance.currentProvider);
    const signer = provider.getSigner(address);
    const factory = new contractFactory(signer);
    return factory;
}
exports.create = create;
/**
 * Generate roles and personas for tests along with their corrolated account addresses
 */
async function initializeRolesAndPersonas(provider) {
    const accounts = await Promise.all(Array(6)
        .fill(null)
        .map(async (_, i) => wallet_1.createFundedWallet(provider, i).then(w => w.wallet)));
    const personas = {
        Default: accounts[0],
        Neil: accounts[1],
        Ned: accounts[2],
        Nelly: accounts[3],
        Carol: accounts[4],
        Eddy: accounts[5],
    };
    const roles = {
        defaultAccount: accounts[0],
        oracleNode: accounts[1],
        oracleNode1: accounts[1],
        oracleNode2: accounts[2],
        oracleNode3: accounts[3],
        stranger: accounts[4],
        consumer: accounts[5],
    };
    return { personas, roles };
}
exports.initializeRolesAndPersonas = initializeRolesAndPersonas;
async function assertActionThrows(action) {
    let e = undefined;
    try {
        await action();
    }
    catch (error) {
        e = error;
    }
    if (!e) {
        chai_1.assert.exists(e, 'Expected an error to be raised');
        return;
    }
    chai_1.assert(e.message, 'Expected an error to contain a message');
    const ERROR_MESSAGES = ['invalid opcode', 'revert'];
    const hasErrored = ERROR_MESSAGES.some(msg => { var _a, _b; return (_b = (_a = e) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.includes(msg); });
    chai_1.assert(hasErrored, `expected following error message to include ${ERROR_MESSAGES.join(' or ')}. Got: "${e.message}"`);
}
exports.assertActionThrows = assertActionThrows;
function checkPublicABI(contract, expectedPublic) {
    const actualPublic = [];
    for (const method of contract.interface.abi) {
        if (method.type === 'function') {
            actualPublic.push(method.name);
        }
    }
    for (const method of actualPublic) {
        const index = expectedPublic.indexOf(method);
        chai_1.assert.isAtLeast(index, 0, `#${method} is NOT expected to be public`);
    }
    for (const method of expectedPublic) {
        const index = actualPublic.indexOf(method);
        chai_1.assert.isAtLeast(index, 0, `#${method} is expected to be public`);
    }
}
exports.checkPublicABI = checkPublicABI;
exports.utils = ethers_1.ethers.utils;
/**
 * Convert a value to a hex string
 * @param args Value to convert to a hex string
 */
function toHex(...args) {
    return exports.utils.hexlify(...args);
}
exports.toHex = toHex;
/**
 * Convert an Ether value to a wei amount
 * @param args Ether value to convert to an Ether amount
 */
function toWei(...args) {
    return exports.utils.parseEther(...args);
}
exports.toWei = toWei;
function decodeRunRequest(log) {
    if (!log) {
        throw Error('No logs found to decode');
    }
    const types = [
        'address',
        'bytes32',
        'uint256',
        'address',
        'bytes4',
        'uint256',
        'uint256',
        'bytes',
    ];
    const [requester, requestId, payment, callbackAddress, callbackFunc, expiration, version, data,] = ethers_1.ethers.utils.defaultAbiCoder.decode(types, log.data);
    return {
        callbackAddr: callbackAddress,
        callbackFunc: toHex(callbackFunc),
        data: addCBORMapDelimiters(Buffer.from(stripHexPrefix(data), 'hex')),
        dataVersion: version.toNumber(),
        expiration: toHex(expiration),
        id: toHex(requestId),
        jobId: log.topics[1],
        payment: toHex(payment),
        requester,
        topic: log.topics[0],
    };
}
exports.decodeRunRequest = decodeRunRequest;
/**
 * Decode a log into a run
 * @param log The log to decode
 * @todo Do we really need this?
 */
function decodeRunABI(log) {
    const d = debug.extend('decodeRunABI');
    d('params %o', log);
    const types = ['bytes32', 'address', 'bytes4', 'bytes'];
    const decodedValue = ethers_1.ethers.utils.defaultAbiCoder.decode(types, log.data);
    d('decoded value %o', decodedValue);
    return decodedValue;
}
exports.decodeRunABI = decodeRunABI;
/**
 * Decodes a CBOR hex string, and adds opening and closing brackets to the CBOR if they are not present.
 *
 * @param hexstr The hex string to decode
 */
function decodeDietCBOR(hexstr) {
    const buf = hexToBuf(hexstr);
    return cbor_1.default.decodeFirstSync(addCBORMapDelimiters(buf));
}
exports.decodeDietCBOR = decodeDietCBOR;
/**
 * Add a starting and closing map characters to a CBOR encoding if they are not already present.
 */
function addCBORMapDelimiters(buffer) {
    if (buffer[0] >> 5 === 5) {
        return buffer;
    }
    /**
     * This is the opening character of a CBOR map.
     * @see https://en.wikipedia.org/wiki/CBOR#CBOR_data_item_header
     */
    const startIndefiniteLengthMap = Buffer.from([0xbf]);
    /**
     * This is the closing character in a CBOR map.
     * @see https://en.wikipedia.org/wiki/CBOR#CBOR_data_item_header
     */
    const endIndefiniteLengthMap = Buffer.from([0xff]);
    return Buffer.concat([startIndefiniteLengthMap, buffer, endIndefiniteLengthMap], buffer.length + 2);
}
/**
 * Add a hex prefix to a hex string
 * @param hex The hex string to prepend the hex prefix to
 */
function addHexPrefix(hex) {
    return hex.startsWith('0x') ? hex : `0x${hex}`;
}
exports.addHexPrefix = addHexPrefix;
function stripHexPrefix(hex) {
    if (!ethers_1.ethers.utils.isHexString(hex)) {
        throw Error(`Expected valid hex string, got: "${hex}"`);
    }
    return hex.replace('0x', '');
}
exports.stripHexPrefix = stripHexPrefix;
/**
 * Convert a number value to bytes32 format
 *
 * @param num The number value to convert to bytes32 format
 */
function numToBytes32(num) {
    const hexNum = ethers_1.ethers.utils.hexlify(num);
    const strippedNum = stripHexPrefix(hexNum);
    if (strippedNum.length > 32 * 2) {
        throw Error('Cannot convert number to bytes32 format, value is greater than maximum bytes32 value');
    }
    return addHexPrefix(strippedNum.padStart(32 * 2, '0'));
}
exports.numToBytes32 = numToBytes32;
function toUtf8(...args) {
    return ethers_1.ethers.utils.toUtf8Bytes(...args);
}
exports.toUtf8 = toUtf8;
/**
 * Compute the keccak256 cryptographic hash of a value, returned as a hex string.
 * (Note: often Ethereum documentation refers to this, incorrectly, as SHA3)
 * @param args The data to compute the keccak256 hash of
 */
function keccak(...args) {
    return exports.utils.keccak256(...args);
}
exports.keccak = keccak;
async function fulfillOracleRequest(oracleContract, runRequest, response, options = {
    gasLimit: 1000000,
}) {
    const d = debug.extend('fulfillOracleRequest');
    d('Response param: %s', response);
    const bytes32Len = 32 * 2 + 2;
    const convertedResponse = response.length < bytes32Len
        ? ethers_1.ethers.utils.formatBytes32String(response)
        : response;
    d('Converted Response param: %s', convertedResponse);
    return oracleContract.fulfillOracleRequest(runRequest.id, runRequest.payment, runRequest.callbackAddr, runRequest.callbackFunc, runRequest.expiration, convertedResponse, options);
}
exports.fulfillOracleRequest = fulfillOracleRequest;
async function cancelOracleRequest(oracleContract, request, options = {}) {
    return oracleContract.cancelOracleRequest(request.id, request.payment, request.callbackFunc, request.expiration, options);
}
exports.cancelOracleRequest = cancelOracleRequest;
function requestDataBytes(specId, to, fHash, nonce, dataBytes) {
    const ocFactory = new OracleFactory_1.OracleFactory();
    return ocFactory.interface.functions.oracleRequest.encode([
        ethers_1.ethers.constants.AddressZero,
        0,
        specId,
        to,
        fHash,
        nonce,
        1,
        dataBytes,
    ]);
}
exports.requestDataBytes = requestDataBytes;
// link param must be from linkContract(), if amount is a BN
function requestDataFrom(oc, link, amount, args, options = {}) {
    if (!options) {
        options = { value: 0 };
    }
    return link.transferAndCall(oc.address, amount, args, options);
}
exports.requestDataFrom = requestDataFrom;
async function increaseTime5Minutes(provider) {
    await provider.send('evm_increaseTime', [300]);
}
exports.increaseTime5Minutes = increaseTime5Minutes;
/**
 * Convert a buffer to a hex string
 * @param hexstr The hex string to convert to a buffer
 */
function hexToBuf(hexstr) {
    return Buffer.from(stripHexPrefix(hexstr), 'hex');
}
exports.hexToBuf = hexToBuf;
const { CoordinatorFactory } = chainlinkv0_5_1.generated;
const serviceAgreementValues = (sa) => {
    return [
        sa.payment,
        sa.expiration,
        sa.endAt,
        sa.oracles,
        sa.requestDigest,
        sa.aggregator,
        sa.aggInitiateJobSelector,
        sa.aggFulfillSelector,
    ];
};
function encodeServiceAgreement(sa) {
    return ethers_1.ethers.utils.defaultAbiCoder.encode(SERVICE_AGREEMENT_TYPES, serviceAgreementValues(sa));
}
exports.encodeServiceAgreement = encodeServiceAgreement;
function encodeOracleSignatures(os) {
    const osValues = [os.vs, os.rs, os.ss];
    return ethers_1.ethers.utils.defaultAbiCoder.encode(ORACLE_SIGNATURES_TYPES, osValues);
}
exports.encodeOracleSignatures = encodeOracleSignatures;
/**
 * Digest of the ServiceAgreement.
 */
function generateSAID(sa) {
    const [saParam] = new CoordinatorFactory().interface.functions.getId.inputs;
    if (saParam.name !== '_agreementData' || saParam.type !== 'bytes') {
        throw Error(`extracted wrong params: ${saParam} from coordinatorFactory.interface.functions.getId`);
    }
    return ethers_1.ethers.utils.solidityKeccak256(SERVICE_AGREEMENT_TYPES, serviceAgreementValues(sa));
}
exports.generateSAID = generateSAID;
//# sourceMappingURL=helpers.js.map