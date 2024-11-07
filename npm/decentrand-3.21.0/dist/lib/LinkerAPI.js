"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkerAPI = void 0;
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const events_1 = require("events");
const fs_extra_1 = __importDefault(require("fs-extra"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const portfinder_1 = __importDefault(require("portfinder"));
const schemas_1 = require("@dcl/schemas");
const url_1 = __importDefault(require("url"));
const querystring_1 = __importDefault(require("querystring"));
const catalystPointers_1 = require("../utils/catalystPointers");
const config_1 = require("../config");
const env_1 = require("../utils/env");
class LinkerAPI extends events_1.EventEmitter {
    constructor(project) {
        super();
        this.app = (0, express_1.default)();
        this.project = project;
    }
    link(port, isHttps, rootCID, skipValidations) {
        return new Promise(async (_resolve, reject) => {
            let resolvedPort = port;
            if (!resolvedPort) {
                try {
                    resolvedPort = await portfinder_1.default.getPortPromise();
                }
                catch (e) {
                    resolvedPort = 4044;
                }
            }
            const queryParams = querystring_1.default.stringify(await this.getSceneInfo(rootCID, skipValidations));
            const protocol = isHttps ? 'https' : 'http';
            const url = `${protocol}://localhost:${resolvedPort}`;
            this.setRoutes(rootCID, skipValidations);
            this.on('link:error', (err) => {
                reject(err);
            });
            const serverHandler = () => this.emit('link:ready', { url, params: queryParams });
            const eventHandler = () => (e) => {
                if (e.errno === 'EADDRINUSE') {
                    reject(new Error(`Port ${resolvedPort} is already in use by another process`));
                }
                else {
                    reject(new Error(`Failed to start Linker App: ${e.message}`));
                }
            };
            if (isHttps) {
                const privateKey = await fs_extra_1.default.readFile(path_1.default.resolve(__dirname, '../../certs/localhost.key'), 'utf-8');
                const certificate = await fs_extra_1.default.readFile(path_1.default.resolve(__dirname, '../../certs/localhost.crt'), 'utf-8');
                const credentials = { key: privateKey, cert: certificate };
                const httpsServer = https_1.default.createServer(credentials, this.app);
                httpsServer.listen(resolvedPort, serverHandler).on('error', eventHandler);
            }
            else {
                this.app.listen(resolvedPort, serverHandler).on('error', eventHandler);
            }
        });
    }
    async getSceneInfo(rootCID, skipValidations) {
        const { LANDRegistry, EstateRegistry } = (0, config_1.getCustomConfig)();
        const { scene: { parcels, base }, display } = await this.project.getSceneFile();
        return {
            baseParcel: base,
            parcels,
            rootCID,
            landRegistry: LANDRegistry,
            estateRegistry: EstateRegistry,
            debug: (0, env_1.isDebug)(),
            title: display === null || display === void 0 ? void 0 : display.title,
            description: display === null || display === void 0 ? void 0 : display.description,
            skipValidations
        };
    }
    setRoutes(rootCID, skipValidations) {
        const linkerDapp = path_1.default.dirname(require.resolve('@dcl/linker-dapp/package.json'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.static(linkerDapp));
        this.app.use(body_parser_1.default.json());
        /**
         * Async method to try/catch errors
         */
        const methods = ['Get', 'Post'];
        for (const method of methods) {
            const asyncMethod = `async${method}`;
            this.app[asyncMethod] = async (path, fn) => {
                const originalMethod = method.toLocaleLowerCase();
                this.app[originalMethod](path, async (req, res) => {
                    try {
                        const resp = await fn(req, res);
                        res.send(resp || {});
                    }
                    catch (e) {
                        console.log(e);
                        res.send(e);
                    }
                });
            };
        }
        this.app.asyncGet('/api/info', async () => {
            return await this.getSceneInfo(rootCID, skipValidations);
        });
        this.app.asyncGet('/api/files', async () => {
            const files = (await this.project.getFiles({ cache: true })).map((file) => ({
                name: file.path,
                size: file.size
            }));
            return files;
        });
        this.app.asyncGet('/api/catalyst-pointers', async () => {
            var _a, _b, _c;
            const { x, y } = await this.project.getParcelCoordinates();
            const pointer = `${x},${y}`;
            const chainId = ((_b = (_a = this.project.getDeployInfo()) === null || _a === void 0 ? void 0 : _a.linkerResponse) === null || _b === void 0 ? void 0 : _b.chainId) || 1;
            const network = chainId === schemas_1.ChainId.ETHEREUM_MAINNET ? 'mainnet' : 'sepolia';
            const value = await (0, catalystPointers_1.getPointers)(pointer, network);
            return {
                catalysts: value,
                status: (_c = this.project.getDeployInfo().status) !== null && _c !== void 0 ? _c : ''
            };
        });
        this.app.get('/api/close', (req, res) => {
            res.writeHead(200);
            res.end();
            const { ok, reason } = url_1.default.parse(req.url, true).query;
            if (ok === 'true') {
                const value = JSON.parse((reason === null || reason === void 0 ? void 0 : reason.toString()) || '{}');
                this.project.setDeployInfo({ linkerResponse: value });
                this.emit('link:success', value);
            }
            this.emit('link:error', new Error(`Failed to link: ${reason}`));
        });
        this.app.asyncPost('/api/deploy', (req) => {
            const value = req.body;
            if (!value.address || !value.signature || !value.chainId) {
                throw new Error(`Invalid payload: ${Object.keys(value).join(' - ')}`);
            }
            this.project.setDeployInfo({ linkerResponse: value, status: 'deploying' });
            this.emit('link:success', value);
            // this.emit('link:error', new Error(`Failed to link: ${reason}`))
        });
    }
}
exports.LinkerAPI = LinkerAPI;
//# sourceMappingURL=LinkerAPI.js.map