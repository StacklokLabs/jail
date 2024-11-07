"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomConfig = exports.getConfig = exports.getDCLInfo = exports.loadConfig = exports.writeDCLInfo = exports.createDCLInfo = void 0;
const path_1 = __importDefault(require("path"));
const filesystem_1 = require("./utils/filesystem");
const utils_1 = require("./utils");
const moduleHelpers_1 = require("./utils/moduleHelpers");
const env_1 = require("./utils/env");
let networkFlag = 'mainnet';
let config;
/**
 * Returns the path to the `.dclinfo` file located in the local HOME folder
 */
function getDCLInfoPath() {
    return path_1.default.resolve((0, filesystem_1.getUserHome)(), '.dclinfo');
}
/**
 * Reads the contents of the `.dclinfo` file
 */
async function readDCLInfo() {
    const filePath = getDCLInfoPath();
    try {
        const file = await (0, filesystem_1.readJSON)(filePath);
        return file;
    }
    catch (e) {
        return null;
    }
}
/**
 * Creates the `.dclinfo` file in the HOME directory
 */
function createDCLInfo(dclInfo) {
    config = dclInfo;
    return (0, filesystem_1.writeJSON)(getDCLInfoPath(), dclInfo);
}
exports.createDCLInfo = createDCLInfo;
/**
 * Add new configuration to `.dclinfo` file
 */
async function writeDCLInfo(newInfo) {
    return (0, filesystem_1.writeJSON)(getDCLInfoPath(), Object.assign(Object.assign({}, config), { newInfo }));
}
exports.writeDCLInfo = writeDCLInfo;
/**
 * Reads `.dclinfo` file and loads it in-memory to be sync-obtained with `getDCLInfo()` function
 */
async function loadConfig(network) {
    networkFlag = network;
    config = (await readDCLInfo());
    return config;
}
exports.loadConfig = loadConfig;
/**
 * Returns the contents of the `.dclinfo` file. It needs to be loaded first with `loadConfig()` function
 */
function getDCLInfo() {
    return config;
}
exports.getDCLInfo = getDCLInfo;
function getConfig(network = networkFlag) {
    const envConfig = getEnvConfig();
    const dclInfoConfig = getDclInfoConfig();
    const defaultConfig = getDefaultConfig(network);
    const config = Object.assign(Object.assign(Object.assign({}, defaultConfig), dclInfoConfig), envConfig);
    return config;
}
exports.getConfig = getConfig;
function getCustomConfig() {
    const envConfig = getEnvConfig();
    const dclInfoConfig = getDclInfoConfig();
    return Object.assign(Object.assign({}, dclInfoConfig), envConfig);
}
exports.getCustomConfig = getCustomConfig;
function getDefaultConfig(network) {
    const isMainnet = network === 'mainnet';
    return {
        userId: '',
        trackStats: false,
        provider: (0, env_1.isDevelopment)() ? 'https://sepolia.infura.io/' : 'https://mainnet.infura.io/',
        MANAToken: isMainnet ? '0x0f5d2fb29fb7d3cfee444a200298f468908cc942' : '0xfa04d2e2ba9aec166c93dfeeba7427b2303befa9',
        LANDRegistry: isMainnet
            ? '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d'
            : '0x42f4ba48791e2de32f5fbf553441c2672864bb33',
        EstateRegistry: isMainnet
            ? '0x959e104e1a4db6317fa58f8295f586e1a978c297'
            : '0x369a7fbe718c870c79f99fb423882e8dd8b20486',
        catalystUrl: isMainnet ? 'https://peer.decentraland.org' : 'https://peer-ue-2.decentraland.zone',
        dclApiUrl: isMainnet
            ? 'https://subgraph.decentraland.org/land-manager'
            : 'https://api.studio.thegraph.com/query/49472/land-manager-sepolia/version/latest',
        segmentKey: (0, moduleHelpers_1.isStableVersion)() && !(0, env_1.isDevelopment)() ? 'sFdziRVDJo0taOnGzTZwafEL9nLIANZ3' : 'mjCV5Dc4VAKXLJAH5g7LyHyW1jrIR3to'
    };
}
function getDclInfoConfig() {
    const dclInfo = getDCLInfo();
    const fileExists = !!dclInfo;
    if (!fileExists) {
        return { fileExists };
    }
    const dclInfoConfig = {
        fileExists,
        userId: dclInfo.userId,
        trackStats: !!dclInfo.trackStats,
        MANAToken: dclInfo.MANAToken,
        LANDRegistry: dclInfo.LANDRegistry,
        EstateRegistry: dclInfo.EstateRegistry,
        catalystUrl: dclInfo.catalystUrl,
        segmentKey: dclInfo.segmentKey
    };
    return (0, utils_1.removeEmptyKeys)(dclInfoConfig);
}
function getEnvConfig() {
    const { RPC_URL, MANA_TOKEN, LAND_REGISTRY, ESTATE_REGISTRY, CONTENT_URL, SEGMENT_KEY } = process.env;
    const envConfig = {
        provider: RPC_URL,
        MANAToken: MANA_TOKEN,
        LANDRegistry: LAND_REGISTRY,
        EstateRegistry: ESTATE_REGISTRY,
        contentUrl: CONTENT_URL,
        segmentKey: SEGMENT_KEY
    };
    return (0, utils_1.removeEmptyKeys)(envConfig);
}
//# sourceMappingURL=config.js.map