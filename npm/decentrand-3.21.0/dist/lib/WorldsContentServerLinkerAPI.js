"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldsContentServerLinkerAPI = void 0;
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const events_1 = require("events");
const fs_extra_1 = __importDefault(require("fs-extra"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const portfinder_1 = __importDefault(require("portfinder"));
/**
 * Events emitted by this class:
 *
 * link:ready   - The server is up and running
 * link:success - Signature success
 * link:error   - The transaction failed and the server was closed
 */
class WorldsContentServerLinkerAPI extends events_1.EventEmitter {
    constructor(data) {
        super();
        this.data = data;
        this.app = (0, express_1.default)();
    }
    link(port, isHttps) {
        return new Promise(async (_, reject) => {
            let resolvedPort = port;
            if (!resolvedPort) {
                try {
                    resolvedPort = await portfinder_1.default.getPortPromise();
                }
                catch (e) {
                    resolvedPort = 4044;
                }
            }
            const protocol = isHttps ? 'https' : 'http';
            const url = `${protocol}://localhost:${resolvedPort}`;
            this.setRoutes();
            this.on('link:error', (err) => {
                reject(err);
            });
            const serverHandler = () => this.emit('link:ready', { url });
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
    setRoutes() {
        const linkerDapp = path_1.default.dirname(require.resolve('@dcl/linker-dapp/package.json'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.static(linkerDapp));
        this.app.use('/acl', express_1.default.static(linkerDapp));
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
        this.app.asyncGet('/api/acl', async () => {
            return await this.data;
        });
        this.app.asyncPost('/api/acl', (req) => {
            const value = req.body;
            if (!value.address || !value.signature) {
                throw new Error(`Invalid payload: ${Object.keys(value).join(' - ')}`);
            }
            this.emit('link:success', value);
        });
    }
}
exports.WorldsContentServerLinkerAPI = WorldsContentServerLinkerAPI;
//# sourceMappingURL=WorldsContentServerLinkerAPI.js.map