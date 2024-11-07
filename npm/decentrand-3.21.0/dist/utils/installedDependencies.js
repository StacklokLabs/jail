"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecentralandDependencies = exports.getDependencies = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const filesystem_1 = require("./filesystem");
const parseBundled = (dependencies) => {
    if (dependencies instanceof Array) {
        return dependencies;
    }
    return [];
};
function getDependencies(packageJSON) {
    const { bundleDependencies = [], bundledDependencies = [], dependencies = {}, devDependencies = {}, peerDependencies = {} } = packageJSON;
    const bundled = [...parseBundled(bundleDependencies), ...parseBundled(bundledDependencies)].filter((b) => typeof b === 'string');
    return {
        dependencies,
        devDependencies,
        peerDependencies,
        bundledDependencies: bundled
    };
}
exports.getDependencies = getDependencies;
function getPath(workDir, name) {
    return path_1.default.resolve(workDir, 'node_modules', name, 'package.json');
}
async function getDecentralandDependencies(dependencies, workDir) {
    const dependenciesName = [];
    for (const dependency of Object.keys(dependencies)) {
        const modulePath = getPath(workDir, dependency);
        if (fs_extra_1.default.pathExistsSync(modulePath)) {
            const pkgJson = await (0, filesystem_1.readJSON)(modulePath);
            if (pkgJson.decentralandLibrary && pkgJson.name && pkgJson.version) {
                dependenciesName.push(dependency);
            }
        }
    }
    return dependenciesName;
}
exports.getDecentralandDependencies = getDecentralandDependencies;
//# sourceMappingURL=installedDependencies.js.map