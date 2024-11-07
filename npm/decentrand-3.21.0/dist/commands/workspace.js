"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.help = void 0;
const chalk_1 = __importDefault(require("chalk"));
const analytics_1 = require("../utils/analytics");
const logging_1 = require("../utils/logging");
const errors_1 = require("../utils/errors");
const Workspace_1 = require("../lib/Workspace");
const help = () => `
  Usage: ${chalk_1.default.bold('dcl workspace SUBCOMMAND [options]')}
  
  ${chalk_1.default.dim('Sub commands:')}
    
    init             Create a workspace looking for subfolder Decentraland projects.
    ls               List all projects in the current workspace
    add              Add a project in the current workspace.

  ${chalk_1.default.dim('Options:')}

    -h, --help               Displays complete help
`;
exports.help = help;
async function init() {
    try {
        await (0, Workspace_1.initializeWorkspace)(process.cwd());
        console.log(chalk_1.default.green(`\nSuccess! Run 'dcl start' to preview your workspace.\n`));
    }
    catch (err) {
        (0, errors_1.fail)(errors_1.ErrorType.WORKSPACE_ERROR, err.message);
    }
    analytics_1.Analytics.sceneCreated({ projectType: 'workspace' });
}
async function listProjects() {
    const workingDir = process.cwd();
    const workspace = (0, Workspace_1.createWorkspace)({ workingDir });
    if (workspace.isSingleProject()) {
        (0, errors_1.fail)(errors_1.ErrorType.WORKSPACE_ERROR, `There is no a workspace in the current directory.`);
    }
    console.log(`\nWorkspace in folder ${workingDir}`);
    for (const [index, project] of workspace.getAllProjects().entries()) {
        const projectPath = project.getProjectWorkingDir().replace(`${workingDir}\\`, '').replace(`${workingDir}/`, '');
        console.log(`> Project ${index + 1} in: ${projectPath}`);
    }
    console.log('');
}
async function addProject() {
    if (process.argv.length <= 4) {
        (0, errors_1.fail)(errors_1.ErrorType.WORKSPACE_ERROR, `Missing folder of new project.`);
    }
    const newProjectPath = process.argv[4];
    const workspace = (0, Workspace_1.createWorkspace)({ workingDir: process.cwd() });
    if (workspace.isSingleProject()) {
        (0, errors_1.fail)(errors_1.ErrorType.WORKSPACE_ERROR, `There is no a workspace in the current directory.`);
    }
    await workspace.addProject(newProjectPath);
    console.log(chalk_1.default.green(`\nSuccess! Run 'dcl start' to preview your workspace and see the new project added.\n`));
}
async function main() {
    if (process.argv.length <= 3) {
        (0, errors_1.fail)(errors_1.ErrorType.WORKSPACE_ERROR, `The subcommand is not recognized`);
    }
    const subcommandList = {
        init,
        ls: listProjects,
        help: async () => console.log((0, exports.help)()),
        add: addProject
    };
    const subcommand = process.argv[3].toLowerCase();
    (0, logging_1.warning)(`(Beta)`);
    if (subcommand in subcommandList) {
        await subcommandList[subcommand]();
    }
    else {
        (0, errors_1.fail)(errors_1.ErrorType.WORKSPACE_ERROR, `The subcommand ${subcommand} is not recognized`);
    }
}
exports.main = main;
//# sourceMappingURL=workspace.js.map