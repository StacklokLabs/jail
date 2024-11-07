"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.help = void 0;
const arg_1 = __importDefault(require("arg"));
const chalk_1 = __importDefault(require("chalk"));
const assert_1 = require("assert");
const Decentraland_1 = require("../lib/Decentraland");
const installDependencies_1 = __importDefault(require("../project/installDependencies"));
const updateBundleDependenciesField_1 = __importDefault(require("../project/updateBundleDependenciesField"));
const analytics_1 = require("../utils/analytics");
const moduleHelpers_1 = require("../utils/moduleHelpers");
const help = () => `
  Usage: ${chalk_1.default.bold('dcl build [options]')}

    ${chalk_1.default.dim('Options:')}

      -h, --help                Displays complete help
      -w, --watch               Watch for file changes and build on change
      -p, --production          Build without sourcemaps
      --skip-version-checks     Skip the ECS and CLI version checks, avoid the warning message and launch anyway
      --skip-install            Skip installing dependencies
      
    ${chalk_1.default.dim('Example:')}

    - Build your scene:

    ${chalk_1.default.green('$ dcl build')}
`;
exports.help = help;
async function main() {
    const args = (0, arg_1.default)({
        '--help': Boolean,
        '-h': '--help',
        '--watch': Boolean,
        '-w': '--watch',
        '--skip-version-checks': Boolean,
        '--production': Boolean,
        '-p': '--production',
        '--skip-install': Boolean
    });
    const dcl = new Decentraland_1.Decentraland({
        watch: args['--watch'] || args['-w'] || false,
        workingDir: process.cwd()
    });
    const skipVersionCheck = args['--skip-version-checks'];
    const skipInstall = args['--skip-install'];
    const online = await (0, moduleHelpers_1.isOnline)();
    const errors = [];
    for (const project of dcl.workspace.getAllProjects()) {
        const needDependencies = await project.needsDependencies();
        if (needDependencies && !skipInstall) {
            if (online) {
                await (0, installDependencies_1.default)(project.getProjectWorkingDir(), false /* silent */);
            }
            else {
                (0, assert_1.fail)('This project can not start as you are offline and dependencies need to be installed.');
            }
        }
        if (!skipVersionCheck) {
            await project.checkCLIandECSCompatibility();
        }
        try {
            await (0, updateBundleDependenciesField_1.default)({
                workDir: project.getProjectWorkingDir()
            });
        }
        catch (err) {
            console.warn(`Unable to update bundle dependencies field.`, err);
        }
        if (await project.isTypescriptProject()) {
            try {
                await (0, moduleHelpers_1.buildTypescript)({
                    workingDir: project.getProjectWorkingDir(),
                    watch: !!args['--watch'],
                    production: !!args['--production']
                });
            }
            catch (err) {
                errors.push({ project, err });
            }
        }
    }
    if (errors.length) {
        const projectList = errors.map((item) => item.project.getProjectWorkingDir()).join('\n\t');
        throw new Error(`Error compiling (see logs above) the scenes: \n\t${projectList}`);
    }
    if (dcl.workspace.isSingleProject()) {
        const baseCoords = await dcl.workspace.getBaseCoords();
        analytics_1.Analytics.buildScene({
            projectHash: dcl.getProjectHash(),
            ecs: await dcl.workspace.getSingleProject().getEcsPackageVersion(),
            coords: baseCoords,
            isWorkspace: false
        });
    }
    else {
        analytics_1.Analytics.buildScene({
            projectHash: dcl.getProjectHash(),
            isWorkspace: true
        });
    }
    return 0;
}
exports.main = main;
//# sourceMappingURL=build.js.map