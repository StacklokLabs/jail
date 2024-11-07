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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const filesystem_1 = require("../utils/filesystem");
const installedDependencies_1 = require("../utils/installedDependencies");
const spinner = __importStar(require("../utils/spinner"));
async function default_1({ workDir }) {
    try {
        spinner.create('Checking decentraland libraries');
        const packageJsonDir = path_1.default.resolve(workDir, 'package.json');
        const packageJSON = await (0, filesystem_1.readJSON)(packageJsonDir);
        const pkgDependencies = (0, installedDependencies_1.getDependencies)(packageJSON);
        const decentralandDependencies = await (0, installedDependencies_1.getDecentralandDependencies)(Object.assign(Object.assign({}, pkgDependencies.dependencies), pkgDependencies.devDependencies), workDir);
        const missingBundled = !!decentralandDependencies.find((name) => !pkgDependencies.bundledDependencies.includes(name));
        if (missingBundled) {
            const allBundledDependencies = new Set([...pkgDependencies.bundledDependencies, ...decentralandDependencies]);
            const { bundledDependencies, bundleDependencies } = packageJSON, packageJsonProps = __rest(packageJSON, ["bundledDependencies", "bundleDependencies"]);
            const newPackage = Object.assign(Object.assign({}, packageJsonProps), { bundledDependencies: Array.from(allBundledDependencies) });
            await fs_extra_1.default.writeFile(packageJsonDir, JSON.stringify(newPackage, null, 2));
        }
        spinner.succeed();
    }
    catch (e) {
        spinner.fail();
        throw e;
    }
}
exports.default = default_1;
//# sourceMappingURL=updateBundleDependenciesField.js.map