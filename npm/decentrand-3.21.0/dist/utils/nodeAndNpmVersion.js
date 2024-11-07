"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNodeAndNpmVersion = exports.getNpmVersion = exports.getNodeVersion = exports.npm = void 0;
const moduleHelpers_1 = require("./moduleHelpers");
const semver_1 = __importDefault(require("semver"));
const shellCommands_1 = require("./shellCommands");
exports.npm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
function getNodeVersion() {
    return process.versions.node;
}
exports.getNodeVersion = getNodeVersion;
async function getNpmVersion() {
    let npmVersion = '';
    function onOutData(data) {
        const arrStr = data.toString().split('.');
        if (arrStr.length === 3) {
            npmVersion = data.toString().split('\n')[0];
        }
    }
    await (0, shellCommands_1.runCommand)({
        workingDir: process.cwd(),
        command: exports.npm,
        args: ['-v'],
        fdStandards: shellCommands_1.FileDescriptorStandardOption.SEND_TO_CALLBACK,
        cb: {
            onOutData
        }
    });
    return npmVersion;
}
exports.getNpmVersion = getNpmVersion;
async function checkNodeAndNpmVersion() {
    const requiredVersion = await (0, moduleHelpers_1.getCLIPackageJson)();
    try {
        const nodeVersion = await getNodeVersion();
        const npmVersion = await getNpmVersion();
        if (nodeVersion) {
            if (semver_1.default.lt(nodeVersion, requiredVersion.userEngines.minNodeVersion)) {
                console.error(`Decentraland CLI runs over node version ${requiredVersion.userEngines.minNodeVersion} or greater, current is ${nodeVersion}.`);
                process.exit(1);
            }
        }
        else {
            console.error(`It's not possible to check node version, version ${requiredVersion.userEngines.minNodeVersion} or greater is required to run Decentraland CLI.`);
            process.exit(1);
        }
        if (npmVersion) {
            if (semver_1.default.lt(npmVersion, requiredVersion.userEngines.minNpmVersion)) {
                console.warn(`⚠ Decentraland CLI works correctly installing packages with npm version ${requiredVersion.userEngines.minNpmVersion} or greater, current is ${npmVersion}.`);
            }
        }
        else {
            console.warn(`⚠ It's not possible to check npm version, version ${requiredVersion.userEngines.minNpmVersion} or greater is required to Decentraland CLI works correctly.`);
        }
    }
    catch (err) {
        console.warn(`⚠ It was not possible to check npm version or node.`, err);
    }
}
exports.checkNodeAndNpmVersion = checkNodeAndNpmVersion;
//# sourceMappingURL=nodeAndNpmVersion.js.map