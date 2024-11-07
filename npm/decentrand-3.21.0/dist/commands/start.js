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
const os_1 = __importDefault(require("os"));
const arg_1 = __importDefault(require("arg"));
const chalk_1 = __importDefault(require("chalk"));
const opn_1 = __importDefault(require("opn"));
const Decentraland_1 = require("../lib/Decentraland");
const moduleHelpers_1 = require("../utils/moduleHelpers");
const analytics_1 = require("../utils/analytics");
const logging_1 = require("../utils/logging");
const env_1 = require("../utils/env");
const spinner = __importStar(require("../utils/spinner"));
const installDependencies_1 = __importDefault(require("../project/installDependencies"));
const lintSceneFile_1 = require("../sceneJson/lintSceneFile");
const updateBundleDependenciesField_1 = __importDefault(require("../project/updateBundleDependenciesField"));
const help = () => `
  Usage: ${chalk_1.default.bold('dcl start [options]')}

    ${chalk_1.default.dim('Options:')}

      -h, --help                Displays complete help
      -p, --port        [port]  Select a custom port for the development server
      -d, --no-debug            Disable debugging panel
      -b, --no-browser          Do not open a new browser window
      -w, --no-watch            Do not open watch for filesystem changes
      -c, --ci                  Run the parcel previewer on a remote unix server
      --web3                    Connects preview to browser wallet to use the associated avatar and account
      --skip-version-checks     Skip the ECS and CLI version checks, avoid the warning message and launch anyway
      --skip-build              Skip build and only serve the files in preview mode
      --skip-install            Skip installing dependencies
      --desktop-client          Show URL to launch preview in the desktop client (BETA)

    ${chalk_1.default.dim('Examples:')}

    - Start a local development server for a Decentraland Scene at port 3500

      ${chalk_1.default.green('$ dcl start -p 3500')}

    - Start a local development server for a Decentraland Scene at a docker container

      ${chalk_1.default.green('$ dcl start --ci')}
`;
exports.help = help;
async function main() {
    const args = (0, arg_1.default)({
        '--help': Boolean,
        '--port': String,
        '--no-debug': Boolean,
        '--no-browser': Boolean,
        '--no-watch': Boolean,
        '--ci': Boolean,
        '--skip-version-checks': Boolean,
        '--skip-install': Boolean,
        '--web3': Boolean,
        '-h': '--help',
        '-p': '--port',
        '-d': '--no-debug',
        '-b': '--no-browser',
        '-w': '--no-watch',
        '-c': '--ci',
        '--skip-build': Boolean,
        '--desktop-client': Boolean,
        // temp and hidden property to add `&explorer-branch=dev`
        '--sdk7-next': Boolean
    });
    const isCi = args['--ci'] || (0, env_1.isEnvCi)();
    const debug = !args['--no-debug'] && !isCi;
    const openBrowser = !args['--no-browser'] && !isCi;
    const skipBuild = args['--skip-build'];
    const watch = !args['--no-watch'] && !isCi && !skipBuild;
    const workingDir = process.cwd();
    const skipVersionCheck = args['--skip-version-checks'];
    const skipInstall = args['--skip-install'];
    const dcl = new Decentraland_1.Decentraland({
        previewPort: parseInt(args['--port'], 10),
        watch,
        workingDir
    });
    const enableWeb3 = args['--web3'];
    const baseCoords = await dcl.workspace.getBaseCoords();
    const hasPortableExperience = dcl.workspace.hasPortableExperience();
    const online = await (0, moduleHelpers_1.isOnline)();
    const ecsVersions = new Set();
    for (const project of dcl.workspace.getAllProjects()) {
        if (!skipBuild) {
            spinner.create(`Checking if SDK is installed in project`);
            const needDependencies = await project.needsDependencies();
            if (needDependencies && !skipInstall) {
                if (online) {
                    await (0, installDependencies_1.default)(project.getProjectWorkingDir(), false /* silent */);
                }
                else {
                    spinner.fail('This project can not start as you are offline and dependencies need to be installed.');
                }
            }
            const ecsVersion = project.getEcsVersion();
            if (ecsVersion === 'unknown') {
                // This should only happen when we are offline and we don't have the SDK installed.
                spinner.fail('SDK not found. This project can not start.');
            }
            ecsVersions.add(ecsVersion);
            const sdkOutdated = await (0, moduleHelpers_1.getOutdatedEcs)(project.getProjectWorkingDir());
            if (sdkOutdated) {
                spinner.warn(`SDK is outdated, to upgrade to the latest version run the command:
          ${chalk_1.default.bold('npm install decentraland-ecs@latest')}
          In the folder ${project.getProjectWorkingDir()}
        `);
                console.log(chalk_1.default.bold((0, logging_1.error)((0, logging_1.formatOutdatedMessage)(sdkOutdated))));
            }
            else {
                spinner.succeed('Latest SDK installation found.');
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
                await (0, moduleHelpers_1.buildTypescript)({
                    workingDir: project.getProjectWorkingDir(),
                    watch: true,
                    production: false
                });
            }
        }
        await (0, lintSceneFile_1.lintSceneFile)(project.getProjectWorkingDir());
    }
    if (dcl.workspace.isSingleProject()) {
        analytics_1.Analytics.startPreview({
            projectHash: dcl.getProjectHash(),
            ecs: await dcl.workspace.getSingleProject().getEcsPackageVersion(),
            coords: baseCoords,
            isWorkspace: false
        });
    }
    else {
        analytics_1.Analytics.startPreview({
            projectHash: dcl.getProjectHash(),
            isWorkspace: true
        });
    }
    if ((enableWeb3 || hasPortableExperience) && (await (0, moduleHelpers_1.isECSVersionLower)(workingDir, '6.10.0')) && !skipVersionCheck) {
        throw new Error('Web3 is not currently working with `decentraland-ecs` version lower than 6.10.0. You can update it with running `npm i decentraland-ecs@latest`.');
    }
    dcl.on('preview:ready', (port) => {
        const ifaces = os_1.default.networkInterfaces();
        const availableURLs = [];
        console.log(''); // line break
        console.log(`Preview server is now running`);
        console.log(chalk_1.default.bold('\n  Available on:\n'));
        Object.keys(ifaces).forEach((dev) => {
            ;
            (ifaces[dev] || []).forEach((details) => {
                const oldBackpack = 'DISABLE_backpack_editor_v2=&ENABLE_backpack_editor_v1';
                if (details.family === 'IPv4') {
                    let addr = `http://${details.address}:${port}?position=${baseCoords.x}%2C${baseCoords.y}&${oldBackpack}`;
                    if (debug) {
                        addr = `${addr}&SCENE_DEBUG_PANEL`;
                    }
                    if (enableWeb3 || hasPortableExperience) {
                        addr = `${addr}&ENABLE_WEB3`;
                    }
                    if (ecsVersions.has('ecs7')) {
                        if (!!args['--sdk7-next']) {
                            addr = `${addr}&ENABLE_ECS7&explorer-branch=dev`;
                        }
                        else {
                            addr = `${addr}&ENABLE_ECS7`;
                        }
                    }
                    availableURLs.push(addr);
                }
            });
        });
        // Push localhost and 127.0.0.1 at top
        const sortedURLs = availableURLs.sort((a, _b) => {
            return a.toLowerCase().includes('localhost') || a.includes('127.0.0.1') || a.includes('0.0.0.0') ? -1 : 1;
        });
        for (const addr of sortedURLs) {
            console.log(`    ${addr}`);
        }
        if (args['--desktop-client']) {
            console.log(chalk_1.default.bold('\n  Desktop client:\n'));
            for (const addr of sortedURLs) {
                const searchParams = new URLSearchParams();
                searchParams.append('PREVIEW-MODE', addr);
                console.log(`    dcl://${searchParams.toString()}&`);
            }
        }
        console.log(chalk_1.default.bold('\n  Details:\n'));
        console.log(chalk_1.default.grey('\nPress CTRL+C to exit\n'));
        // Open preferably localhost/127.0.0.1
        if (openBrowser && sortedURLs.length && !args['--desktop-client']) {
            (0, opn_1.default)(sortedURLs[0]).catch(() => {
                console.log('Unable to open browser automatically.');
            });
        }
    });
    await dcl.preview();
}
exports.main = main;
//# sourceMappingURL=start.js.map