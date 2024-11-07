"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPointers = exports.fetchEntityByPointer = exports.daoCatalysts = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function daoCatalysts(network = 'mainnet') {
    const tld = network === 'mainnet' ? 'org' : 'zone';
    const resp = await (await (0, node_fetch_1.default)(`https://peer.decentraland.${tld}/lambdas/contracts/servers`)).json();
    return resp;
}
exports.daoCatalysts = daoCatalysts;
async function fetchEntityByPointer(baseUrl, pointers) {
    if (pointers.length === 0)
        return {
            baseUrl,
            deployments: []
        };
    const activeEntities = baseUrl + '/content/entities/active';
    const response = await (0, node_fetch_1.default)(activeEntities, {
        method: 'post',
        headers: { 'content-type': 'application/json', connection: 'close' },
        body: JSON.stringify({ pointers })
    });
    const deployments = response.ok ? (await response.json()) : [];
    return {
        baseUrl,
        deployments
    };
}
exports.fetchEntityByPointer = fetchEntityByPointer;
async function getPointers(pointer, network = 'mainnet') {
    var _a, _b;
    const catalysts = await daoCatalysts(network);
    const catalystInfo = [];
    for (const { baseUrl } of catalysts) {
        try {
            const result = await fetchEntityByPointer(baseUrl, [pointer]);
            const timestamp = (_a = result.deployments[0]) === null || _a === void 0 ? void 0 : _a.timestamp;
            const entityId = ((_b = result.deployments[0]) === null || _b === void 0 ? void 0 : _b.id) || '';
            catalystInfo.push({ timestamp, entityId, url: baseUrl });
        }
        catch (err) {
            console.log('Error fetching catalyst pointers', err);
        }
    }
    return catalystInfo;
}
exports.getPointers = getPointers;
//# sourceMappingURL=catalystPointers.js.map