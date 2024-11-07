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
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
const spinner = __importStar(require("../utils/spinner"));
const moduleHelpers_1 = require("../utils/moduleHelpers");
function installDependencies(workingDir, silent) {
    spinner.create('Installing dependencies');
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)(moduleHelpers_1.npm, ['install'], {
            shell: true,
            cwd: workingDir,
            env: Object.assign(Object.assign({}, process.env), { NODE_ENV: '' })
        });
        if (!silent) {
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
        }
        child.on('close', (code) => {
            if (code !== 0) {
                spinner.fail();
                reject(new Error(`${chalk_1.default.bold(`npm install`)} exited with code ${code}. Please try running the command manually`));
                return;
            }
            spinner.succeed('Dependencies installed.');
            resolve();
        });
    });
}
exports.default = installDependencies;
//# sourceMappingURL=installDependencies.js.map