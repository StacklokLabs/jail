"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isECSVersionLower = exports.isOnline = exports.isCLIOutdated = exports.isStableVersion = exports.getInstalledCLIVersion = exports.getCLIPackageJson = exports.getOutdatedEcs = exports.getInstalledVersion = exports.getLatestVersion = exports.buildTypescript = exports.setVersion = exports.npm = void 0;
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const semver_1 = __importDefault(require("semver"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const package_json_1 = __importDefault(require("package-json"));
const spinner = __importStar(require("../utils/spinner"));
const filesystem_1 = require("../utils/filesystem");
const project_1 = require("../utils/project");
exports.npm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
let version = null;
function setVersion(v) {
    version = v;
}
exports.setVersion = setVersion;
function buildTypescript({ workingDir, watch, production, silence = false }) {
    const command = watch ? 'watch' : 'build';
    const NODE_ENV = production ? 'production' : '';
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)(exports.npm, ['run', command], {
            shell: true,
            cwd: workingDir,
            env: Object.assign(Object.assign({}, process.env), { NODE_ENV })
        });
        if (!silence) {
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
        }
        child.stdout.on('data', (data) => {
            if (data.toString().indexOf('The compiler is watching file changes...') !== -1) {
                if (!silence)
                    spinner.succeed('Project built.');
                return resolve();
            }
        });
        child.on('close', (code) => {
            if (code !== 0) {
                const msg = 'Error while building the project';
                if (!silence)
                    spinner.fail(msg);
                reject(new Error(msg));
            }
            else {
                if (!silence)
                    spinner.succeed('Project built.');
                return resolve();
            }
        });
    });
}
exports.buildTypescript = buildTypescript;
async function getLatestVersion(name) {
    if (!(await isOnline())) {
        return '';
    }
    try {
        // NOTE: this packageJson function should receive the workingDir
        const pkg = await (0, package_json_1.default)(name.toLowerCase());
        return pkg.version;
    }
    catch (e) {
        return '';
    }
}
exports.getLatestVersion = getLatestVersion;
async function getInstalledVersion(workingDir, name) {
    let decentralandApiPkg;
    try {
        decentralandApiPkg = await (0, filesystem_1.readJSON)(path_1.default.resolve((0, project_1.getNodeModulesPath)(workingDir), name, 'package.json'));
    }
    catch (e) {
        return '';
    }
    return decentralandApiPkg.version;
}
exports.getInstalledVersion = getInstalledVersion;
async function getOutdatedEcs(workingDir) {
    const decentralandEcs6Version = await getInstalledVersion(workingDir, 'decentraland-ecs');
    if (decentralandEcs6Version) {
        const latestVersion = await getLatestVersion('decentraland-ecs');
        if (latestVersion && semver_1.default.lt(decentralandEcs6Version, latestVersion)) {
            return {
                package: 'decentraland-ecs',
                installedVersion: decentralandEcs6Version,
                latestVersion
            };
        }
    }
    return undefined;
}
exports.getOutdatedEcs = getOutdatedEcs;
async function getCLIPackageJson() {
    return (0, filesystem_1.readJSON)(path_1.default.resolve(__dirname, '..', '..', 'package.json'));
}
exports.getCLIPackageJson = getCLIPackageJson;
function getInstalledCLIVersion() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return version || require('../../package.json').version;
}
exports.getInstalledCLIVersion = getInstalledCLIVersion;
function isStableVersion() {
    return !getInstalledCLIVersion().includes('commit');
}
exports.isStableVersion = isStableVersion;
async function isCLIOutdated() {
    const cliVersion = getInstalledCLIVersion();
    const cliVersionLatest = await getLatestVersion('decentraland');
    if (cliVersionLatest && cliVersion && semver_1.default.lt(cliVersion, cliVersionLatest)) {
        return true;
    }
    else {
        return false;
    }
}
exports.isCLIOutdated = isCLIOutdated;
function isOnline() {
    return new Promise((resolve) => {
        (0, node_fetch_1.default)('https://decentraland.org/ping')
            .then(() => resolve(true))
            .catch(() => resolve(false));
        setTimeout(() => {
            resolve(false);
        }, 4000);
    });
}
exports.isOnline = isOnline;
async function isECSVersionLower(workingDir, version) {
    const ecsPackageJson = await (0, filesystem_1.readJSON)(path_1.default.resolve((0, project_1.getNodeModulesPath)(workingDir), 'decentraland-ecs', 'package.json'));
    if (semver_1.default.lt(ecsPackageJson.version, version)) {
        return true;
    }
    return false;
}
exports.isECSVersionLower = isECSVersionLower;
//# sourceMappingURL=moduleHelpers.js.map