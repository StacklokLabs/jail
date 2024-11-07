"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wirePreview = void 0;
const path_1 = __importDefault(require("path"));
const ws_1 = __importDefault(require("ws"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chokidar_1 = __importDefault(require("chokidar"));
const ignore_1 = __importDefault(require("ignore"));
const schemas_1 = require("@dcl/schemas");
const errors_1 = require("../utils/errors");
const bff_1 = require("./controllers/bff");
const http_server_1 = require("@well-known-components/http-server");
const legacy_comms_v1_1 = require("./controllers/legacy-comms-v1");
const debugger_1 = require("./controllers/debugger");
const ecs6_endpoints_1 = require("./controllers/ecs6-endpoints");
const ws_2 = require("@well-known-components/http-server/dist/ws");
async function wirePreview(components, watch) {
    const npmModulesPath = path_1.default.resolve(components.dcl.getWorkingDir(), 'node_modules');
    // TODO: dcl.project.needsDependencies() should do this
    if (!fs_extra_1.default.pathExistsSync(npmModulesPath)) {
        (0, errors_1.fail)(errors_1.ErrorType.PREVIEW_ERROR, `Couldn\'t find ${npmModulesPath}, please run: npm install`);
    }
    const proxySetupPathEcs6 = path_1.default.resolve(components.dcl.getWorkingDir(), 'node_modules', 'decentraland-ecs', 'src', 'setupProxyV2.js');
    const proxySetupPathEcs7 = path_1.default.resolve(components.dcl.getWorkingDir(), 'node_modules', '@dcl', 'sdk', 'src', 'setupProxyV2.js');
    // this should come BEFORE the custom proxy
    const proxySetupPath = fs_extra_1.default.existsSync(proxySetupPathEcs7) ? proxySetupPathEcs7 : proxySetupPathEcs6;
    const router = new http_server_1.Router();
    const sceneUpdateClients = new Set();
    // handle old comms
    router.get('/', async (ctx, next) => {
        if (ctx.request.headers.get('upgrade') === 'websocket') {
            const userId = ctx.url.searchParams.get('identity');
            if (userId) {
                return (0, ws_2.upgradeWebSocketResponse)((ws) => {
                    adoptWebSocket(ws, userId);
                });
            }
            else {
                return (0, ws_2.upgradeWebSocketResponse)((ws) => {
                    if (ws.readyState === ws.OPEN) {
                        sceneUpdateClients.add(ws);
                    }
                    else {
                        ws.on('open', () => sceneUpdateClients.add(ws));
                    }
                    ws.on('close', () => sceneUpdateClients.delete(ws));
                });
            }
        }
        return next();
    });
    await (0, bff_1.setupBffAndComms)(components, router);
    const { adoptWebSocket } = (0, legacy_comms_v1_1.setupCommsV1)(components, router);
    await (0, debugger_1.setupDebuggingAdapter)(components, router);
    await (0, ecs6_endpoints_1.setupEcs6Endpoints)(components, router);
    if (watch) {
        await bindWatch(components, router, sceneUpdateClients);
    }
    components.server.setContext(components);
    components.server.use(router.allowedMethods());
    components.server.use(router.middleware());
    if (fs_extra_1.default.existsSync(proxySetupPath)) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const setupProxy = require(proxySetupPath);
            setupProxy(router, components);
        }
        catch (err) {
            console.log(`${proxySetupPath} found but it couldn't be loaded properly`, err);
        }
    }
}
exports.wirePreview = wirePreview;
function debounce(callback, delay) {
    let debounceTimer;
    return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => callback(...args), delay);
    };
}
async function bindWatch(components, router, sceneUpdateClients) {
    for (const project of components.dcl.workspace.getAllProjects()) {
        const ig = (0, ignore_1.default)().add((await project.getDCLIgnore()));
        const { sceneId, sceneType } = project.getInfo();
        const sceneFile = await project.getSceneFile();
        chokidar_1.default.watch(project.getProjectWorkingDir()).on('all', debounce((_, pathWatch) => {
            // if the updated file is the scene.json#main then skip all drop tests
            if (path_1.default.resolve(pathWatch) !== path_1.default.resolve(project.getProjectWorkingDir(), sceneFile.main)) {
                if (ig.ignores(pathWatch)) {
                    return;
                }
                // ignore source files
                if (pathWatch.endsWith('.ts') || pathWatch.endsWith('.tsx')) {
                    return;
                }
            }
            sceneUpdateClients.forEach((ws) => {
                if (ws.readyState === ws_1.default.OPEN) {
                    const message = {
                        type: schemas_1.sdk.SCENE_UPDATE,
                        payload: { sceneId, sceneType }
                    };
                    ws.send(schemas_1.sdk.UPDATE);
                    ws.send(JSON.stringify(message));
                }
            });
        }, 500));
    }
}
//# sourceMappingURL=Preview.js.map