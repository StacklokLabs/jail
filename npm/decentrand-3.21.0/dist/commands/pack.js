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
exports.main = exports.help = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const schemas_1 = require("@dcl/schemas");
const spinner = __importStar(require("../utils/spinner"));
const packProject_1 = require("../lib/smartItems/packProject");
const buildSmartItem_1 = require("../lib/smartItems/buildSmartItem");
const getProjectFilePaths_1 = __importDefault(require("../utils/getProjectFilePaths"));
const moduleHelpers_1 = require("../utils/moduleHelpers");
const assert_1 = require("assert");
const Workspace_1 = require("../lib/Workspace");
const help = () => `
  Usage: ${chalk_1.default.bold('dcl pack [options]')}

    ${chalk_1.default.dim('There are no available options yet (experimental feature)')}

    ${chalk_1.default.dim('Example:')}

    - Pack your project into a .zip file:

      ${chalk_1.default.green('$ dcl pack')}
`;
exports.help = help;
async function main() {
    const workingDir = process.cwd();
    const workspace = (0, Workspace_1.createWorkspace)({ workingDir });
    const project = workspace.getSingleProject();
    if (project === null) {
        (0, assert_1.fail)("You should't use `dcl pack` in a workspace folder.");
    }
    const projectInfo = project.getInfo();
    const zipFileName = projectInfo.sceneType === schemas_1.sdk.ProjectType.PORTABLE_EXPERIENCE ? 'portable-experience.zip' : 'item.zip';
    try {
        if (projectInfo.sceneType === schemas_1.sdk.ProjectType.SMART_ITEM) {
            await (0, buildSmartItem_1.buildSmartItem)(workingDir);
        }
        else if (projectInfo.sceneType === schemas_1.sdk.ProjectType.PORTABLE_EXPERIENCE) {
            await (0, moduleHelpers_1.buildTypescript)({
                workingDir,
                watch: false,
                production: true
            });
        }
    }
    catch (error) {
        console.error('Could not build the project properly, please check errors.', error);
    }
    spinner.create('Packing project');
    const ignoreFileContent = await fs_extra_1.default.readFile(path_1.default.resolve(workingDir, '.dclignore'), 'utf-8');
    const filePaths = await (0, getProjectFilePaths_1.default)(workingDir, ignoreFileContent);
    let totalSize = 0;
    for (const filePath of filePaths) {
        const stat = fs_extra_1.default.statSync(filePath);
        if (stat.isFile()) {
            totalSize += stat.size;
        }
    }
    if (projectInfo.sceneType === schemas_1.sdk.ProjectType.PORTABLE_EXPERIENCE) {
        const MAX_WEARABLE_SIZE = 2097152;
        const MAX_WEARABLE_SIZE_MB = Math.round(MAX_WEARABLE_SIZE / 1024 / 1024);
        if (totalSize > MAX_WEARABLE_SIZE) {
            console.error(`The sumatory of all packed files exceed the limit of wearable size (${MAX_WEARABLE_SIZE_MB}MB - ${MAX_WEARABLE_SIZE} bytes).
Please try to remove unneccessary files and/or reduce the files size, you can ignore file adding in .dclignore.`);
        }
    }
    const packDir = path_1.default.resolve(workingDir, zipFileName);
    await fs_extra_1.default.remove(packDir);
    await (0, packProject_1.packProject)(filePaths, packDir);
    spinner.succeed(`Pack successful. Total size: ${Math.round((totalSize * 100) / 1024 / 1024) / 100}MB - ${totalSize} bytes`);
    return 0;
}
exports.main = main;
//# sourceMappingURL=pack.js.map