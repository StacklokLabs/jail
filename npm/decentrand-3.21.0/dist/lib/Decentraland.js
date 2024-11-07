"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decentraland = void 0;
const events_1 = require("events");
const chalk_1 = __importDefault(require("chalk"));
const wildcards_1 = __importDefault(require("wildcards"));
const ContentService_1 = require("./content/ContentService");
const land_1 = require("../utils/land");
const errors_1 = require("../utils/errors");
const config_1 = require("../config");
const logging_1 = require("../utils/logging");
const Ethereum_1 = require("./Ethereum");
const LinkerAPI_1 = require("./LinkerAPI");
const Preview_1 = require("./Preview");
const portfinder_1 = __importDefault(require("portfinder"));
const API_1 = require("./API");
const Workspace_1 = require("./Workspace");
const crypto_1 = require("@dcl/crypto/dist/crypto");
const crypto_2 = __importDefault(require("crypto"));
const eth_connect_1 = require("eth-connect");
const interfaces_1 = require("@well-known-components/interfaces");
const rooms_1 = require("@dcl/mini-comms/dist/adapters/rooms");
const env_config_provider_1 = require("@well-known-components/env-config-provider");
const http_server_1 = require("@well-known-components/http-server");
const logger_1 = require("@well-known-components/logger");
const metrics_1 = require("@well-known-components/metrics");
const ws_1 = require("./adapters/ws");
const fp_future_1 = __importDefault(require("fp-future"));
class Decentraland extends events_1.EventEmitter {
    constructor(args = {
        workingDir: process.cwd()
    }) {
        super();
        this.stop = async () => void 0;
        this.options = args;
        this.options.config = this.options.config || (0, config_1.getConfig)();
        console.assert(this.options.workingDir, 'Working directory is missing');
        (0, logging_1.debug)(`Working directory: ${chalk_1.default.bold(this.options.workingDir)}`);
        this.workspace = (0, Workspace_1.createWorkspace)({ workingDir: this.options.workingDir });
        this.ethereum = new Ethereum_1.Ethereum();
        this.provider = this.options.blockchain ? this.ethereum : new API_1.API();
        this.contentService = new ContentService_1.ContentService(this.options.config.catalystUrl);
        if (process.env.DCL_PRIVATE_KEY) {
            this.createWallet(process.env.DCL_PRIVATE_KEY);
        }
        // Pipe all events
        (0, wildcards_1.default)(this.ethereum, 'ethereum:*', this.pipeEvents.bind(this));
        (0, wildcards_1.default)(this.contentService, 'upload:*', this.pipeEvents.bind(this));
    }
    getWorkingDir() {
        return this.options.workingDir;
    }
    getProjectHash() {
        return crypto_2.default.createHash('sha256').update(this.options.workingDir).digest('hex');
    }
    async link(rootCID) {
        const project = this.workspace.getSingleProject();
        if (!project) {
            throw new Error('Cannot link a workspace. Please set you current directory in the project folder.');
        }
        await project.validateExistingProject();
        await project.validateSceneOptions();
        return new Promise(async (resolve, reject) => {
            const linker = new LinkerAPI_1.LinkerAPI(project);
            (0, wildcards_1.default)(linker, '*', this.pipeEvents.bind(this));
            linker.on('link:success', async (message) => {
                resolve(message);
            });
            try {
                await linker.link(this.options.linkerPort, !!this.options.isHttps, rootCID, !!this.options.skipValidations);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    async preview() {
        for (const project of this.workspace.getAllProjects()) {
            await project.validateExistingProject();
            await project.validateSceneOptions();
        }
        // eslint-disable-next-line
        const dcl = this;
        const port = await previewPort(dcl);
        const startedFuture = (0, fp_future_1.default)();
        setTimeout(() => startedFuture.reject(new Error('Timed out starting the server')), 3000);
        void interfaces_1.Lifecycle.run({
            async initComponents() {
                const metrics = (0, metrics_1.createTestMetricsComponent)(rooms_1.roomsMetrics);
                const config = (0, env_config_provider_1.createRecordConfigComponent)(Object.assign({ HTTP_SERVER_PORT: port, HTTP_SERVER_HOST: '0.0.0.0' }, process.env));
                const logs = await (0, logger_1.createConsoleLogComponent)({});
                const ws = await (0, ws_1.createWsComponent)({ logs });
                const server = await (0, http_server_1.createServerComponent)({ config, logs, ws: ws.ws }, { cors: {} });
                const rooms = await (0, rooms_1.createRoomsComponent)({
                    metrics,
                    logs,
                    config
                });
                return {
                    logs,
                    ethereumProvider: Ethereum_1.providerInstance,
                    rooms,
                    config,
                    dcl,
                    metrics,
                    server,
                    ws
                };
            },
            async main({ components, startComponents, stop }) {
                try {
                    await (0, Preview_1.wirePreview)(components, dcl.getWatch());
                    await startComponents();
                    dcl.emit('preview:ready', await components.config.requireNumber('HTTP_SERVER_PORT'));
                    dcl.stop = stop;
                    startedFuture.resolve();
                }
                catch (err) {
                    startedFuture.reject(err);
                }
            }
        });
        return;
    }
    async getAddressInfo(address) {
        const [coords, estateIds] = await Promise.all([
            this.provider.getLandOf(address),
            this.provider.getEstatesOf(address)
        ]);
        const pRequests = Promise.all(coords.map((coord) => this.provider.getLandData(coord)));
        const eRequests = Promise.all(estateIds.map((estateId) => this.provider.getEstateData(estateId)));
        const [pData, eData] = await Promise.all([pRequests, eRequests]);
        const parcels = pData.map((data, i) => (Object.assign({ x: coords[i].x, y: coords[i].y }, (0, land_1.filterAndFillEmpty)(data, '')))) || [];
        const estates = eData.map((data, i) => (Object.assign({ id: parseInt(estateIds[i].toString(), 10) }, (0, land_1.filterAndFillEmpty)(data, '')))) || [];
        return { parcels, estates };
    }
    getWatch() {
        return !!this.options.watch;
    }
    async getParcelInfo(coords) {
        const [scene, land, blockchainOwner, operator, updateOperator] = await Promise.all([
            this.contentService.getSceneData(coords),
            this.provider.getLandData(coords),
            this.provider.getLandOwner(coords),
            this.provider.getLandOperator(coords),
            this.provider.getLandUpdateOperator(coords)
        ]);
        const { EstateRegistry } = (0, config_1.getConfig)();
        if (blockchainOwner !== EstateRegistry) {
            return {
                scene,
                land: Object.assign(Object.assign({}, land), { owner: blockchainOwner, operator, updateOperator })
            };
        }
        const estateId = await this.provider.getEstateIdOfLand(coords);
        const owner = await this.provider.getEstateOwner(estateId);
        return { scene, land: Object.assign(Object.assign({}, land), { owner, operator, updateOperator }) };
    }
    async getEstateInfo(estateId) {
        const estate = await this.provider.getEstateData(estateId);
        if (!estate) {
            return undefined;
        }
        const owner = await this.provider.getEstateOwner(estateId);
        const operator = await this.provider.getEstateOperator(estateId);
        const updateOperator = await this.provider.getEstateUpdateOperator(estateId);
        const parcels = await this.provider.getLandOfEstate(estateId);
        return Object.assign(Object.assign({}, estate), { owner, operator, updateOperator, parcels });
    }
    async getEstateOfParcel(coords) {
        const estateId = await this.provider.getEstateIdOfLand(coords);
        if (!estateId || estateId < 1) {
            return undefined;
        }
        return this.getEstateInfo(estateId);
    }
    getParcelStatus(x, y) {
        return this.contentService.getParcelStatus({ x, y });
    }
    async getAddressAndSignature(messageToSign) {
        if (this.environmentIdentity) {
            return {
                signature: (0, crypto_1.ethSign)((0, eth_connect_1.hexToBytes)(this.environmentIdentity.privateKey), messageToSign),
                address: this.environmentIdentity.address
            };
        }
        return this.link(messageToSign);
    }
    pipeEvents(event, ...args) {
        this.emit(event, ...args);
    }
    createWallet(privateKey) {
        let length = 64;
        if (privateKey.startsWith('0x')) {
            length = 66;
        }
        if (privateKey.length !== length) {
            (0, errors_1.fail)(errors_1.ErrorType.DEPLOY_ERROR, 'Addresses should be 64 characters length.');
        }
        const pk = (0, eth_connect_1.hexToBytes)(privateKey);
        const msg = Math.random().toString();
        const signature = (0, crypto_1.ethSign)(pk, msg);
        const address = (0, crypto_1.recoverAddressFromEthSignature)(signature, msg);
        this.environmentIdentity = {
            address,
            privateKey,
            publicKey: '0x'
        };
    }
}
exports.Decentraland = Decentraland;
async function previewPort(dcl) {
    let resolvedPort = dcl.options.previewPort || 0;
    if (!resolvedPort) {
        try {
            resolvedPort = await portfinder_1.default.getPortPromise();
        }
        catch (e) {
            resolvedPort = 2044;
        }
    }
    return resolvedPort.toString();
}
//# sourceMappingURL=Decentraland.js.map