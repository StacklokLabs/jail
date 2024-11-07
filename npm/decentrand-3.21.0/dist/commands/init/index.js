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
const chalk_1 = __importDefault(require("chalk"));
const Decentraland_1 = require("../../lib/Decentraland");
const installDependencies_1 = __importDefault(require("../../project/installDependencies"));
const analytics_1 = require("../../utils/analytics");
const download_1 = require("../../utils/download");
const errors_1 = require("../../utils/errors");
const filesystem_1 = require("../../utils/filesystem");
const spinner = __importStar(require("../../utils/spinner"));
const utils_1 = require("./utils");
const help_1 = require("./help");
var help_2 = require("./help");
Object.defineProperty(exports, "help", { enumerable: true, get: function () { return help_2.help; } });
async function main() {
    const dcl = new Decentraland_1.Decentraland({ workingDir: process.cwd() });
    const project = dcl.workspace.getSingleProject();
    const isEmpty = await (0, filesystem_1.isEmptyDirectory)(process.cwd());
    if (!isEmpty) {
        (0, errors_1.fail)(errors_1.ErrorType.INIT_ERROR, `Project directory isn't empty`);
        return;
    }
    if (!project) {
        (0, errors_1.fail)(errors_1.ErrorType.INIT_ERROR, 'Cannot init a project in workspace directory');
        return;
    }
    const projectArg = help_1.args['--project'];
    const templateArg = help_1.args['--template'];
    let url;
    let choice;
    if (templateArg && (0, utils_1.isValidTemplateUrl)(templateArg)) {
        choice = {
            type: 'scene',
            value: templateArg
        };
        url = templateArg;
    }
    else {
        choice = await (0, utils_1.getInitOption)(projectArg);
        url = (0, utils_1.getRepositoryUrl)(choice);
    }
    if (!url) {
        (0, errors_1.fail)(errors_1.ErrorType.INIT_ERROR, 'Cannot get a choice');
        return;
    }
    const type = choice.type === 'scene' ? 'scene-template' : choice.value;
    try {
        spinner.create('Downloading example...');
        await (0, download_1.downloadRepoZip)(url, project.getProjectWorkingDir());
        spinner.succeed('Example downloaded');
    }
    catch (error) {
        spinner.fail(`Failed fetching the repo ${url}.`);
        (0, errors_1.fail)(errors_1.ErrorType.INIT_ERROR, error.message);
    }
    const skipInstall = help_1.args['--skip-install'];
    if (!skipInstall) {
        try {
            await (0, installDependencies_1.default)(dcl.getWorkingDir(), true);
        }
        catch (error) {
            (0, errors_1.fail)(errors_1.ErrorType.INIT_ERROR, error.message);
        }
    }
    console.log(chalk_1.default.green(`\nSuccess! Run 'dcl start' to see your scene\n`));
    analytics_1.Analytics.sceneCreated({ projectType: type, url });
}
exports.main = main;
//# sourceMappingURL=index.js.map