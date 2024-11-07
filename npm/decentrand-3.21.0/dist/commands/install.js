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
const arg_1 = __importDefault(require("arg"));
const chalk_1 = __importDefault(require("chalk"));
const updateBundleDependenciesField_1 = __importDefault(require("../project/updateBundleDependenciesField"));
const child_process_1 = require("child_process");
const moduleHelpers_1 = require("./../utils/moduleHelpers");
const spinner = __importStar(require("../utils/spinner"));
const Workspace_1 = require("../lib/Workspace");
const assert_1 = require("assert");
const help = () => `
  Usage: ${chalk_1.default.bold('dcl install [package]')}

    ${chalk_1.default.dim('Options:')}

      -h, --help               Displays complete help

    ${chalk_1.default.dim('Examples:')}

    - Install a new package

      ${chalk_1.default.green('$ dcl install package-example')}

    - Check the Decentraland libraries used are in bundleDependencies

      ${chalk_1.default.green('$ dcl install')}
`;
exports.help = help;
const spawnNpmInstall = (args) => {
    return new Promise((resolve, reject) => {
        spinner.create(`npm ${args.join(' ')}\n`);
        const child = (0, child_process_1.spawn)(moduleHelpers_1.npm, args, {
            shell: true,
            cwd: process.cwd(),
            env: Object.assign(Object.assign({}, process.env), { NODE_ENV: '' })
        });
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
        child.on('close', (code) => {
            if (code !== 0) {
                spinner.fail();
                reject(new Error(`${chalk_1.default.bold(`npm ${args.join(' ')}`)} exited with code ${code}. Please try running the command manually`));
            }
            else {
                spinner.succeed();
                resolve();
            }
        });
    });
};
async function main() {
    const args = (0, arg_1.default)({
        '--help': Boolean,
        '-h': '--help'
    });
    const workingDir = process.cwd();
    const workspace = (0, Workspace_1.createWorkspace)({ workingDir });
    if (!workspace.isSingleProject()) {
        (0, assert_1.fail)("You should't use `dcl install` in a workspace folder.");
    }
    await spawnNpmInstall(args._);
    await (0, updateBundleDependenciesField_1.default)({ workDir: workingDir });
}
exports.main = main;
//# sourceMappingURL=install.js.map