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
exports.main = void 0;
const arg_1 = __importDefault(require("arg"));
const chalk_1 = __importDefault(require("chalk"));
const log = __importStar(require("./utils/logging"));
const analytics_1 = require("./utils/analytics");
const moduleHelpers_1 = require("./utils/moduleHelpers");
const config_1 = require("./config");
const commands_1 = __importDefault(require("./commands"));
const nodeAndNpmVersion_1 = require("./utils/nodeAndNpmVersion");
log.debug(`Running with NODE_ENV: ${process.env.NODE_ENV}`);
log.debug(`Provided argv: ${JSON.stringify(process.argv)}`);
process.on('unhandledRejection', (error) => {
    var _a, _b;
    if ((_b = (_a = error === null || error === void 0 ? void 0 : error.config) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.includes('.segment.')) {
        console.log(chalk_1.default.dim('\n⚠️  Analytics api call failed. \n'));
        return;
    }
    throw error;
});
const args = (0, arg_1.default)({
    '--help': Boolean,
    '--version': Boolean,
    '--network': String,
    '-h': '--help',
    '-v': '--version',
    '-n': '--network'
}, {
    permissive: true
});
log.debug(`Parsed args: ${JSON.stringify(args)}`);
const subcommand = args._[0];
log.debug(`Selected command ${chalk_1.default.bold(subcommand)}`);
const help = `
  ${chalk_1.default.bold('Decentraland CLI')}

  Usage: ${chalk_1.default.bold('dcl [command] [options]')}

    ${chalk_1.default.dim('Commands:')}

      init                  Create a new Decentraland Scene project
      build                 Build scene
      start                 Start a local development server for a Decentraland Scene
      install               Sync decentraland libraries in bundleDependencies
      install package       Install a package
      deploy                Upload scene to a particular Decentraland's Content server
      deploy-deprecated     Upload scene to Decentraland's legacy content server (deprecated).
      export                Export scene to static website format (HTML, JS and CSS)
      info      [args]      Displays information about a LAND, an Estate or an address
      status    [args]      Displays the deployment status of the project or a given LAND
      help      [cmd]       Displays complete help for given command
      version               Display current version of dcl
      coords                Set the parcels in your scene
      world-acl [args]      Manage DCL worlds permissions, dcl help world-acl for more information.
      workspace subcommand  Make a workspace level action, dcl help workspace for more information.

    ${chalk_1.default.dim('Options:')}

      -h, --help          Displays complete help for used command or subcommand
      -v, --version       Display current version of dcl

    ${chalk_1.default.dim('Example:')}

    - Show complete help for the subcommand "${chalk_1.default.dim('deploy')}"

      ${chalk_1.default.green('$ dcl help deploy')}
`;
async function main(version) {
    await (0, nodeAndNpmVersion_1.checkNodeAndNpmVersion)();
    (0, moduleHelpers_1.setVersion)(version);
    if (!process.argv.includes('--ci') && !process.argv.includes('--c')) {
        const network = args['--network'];
        if (network && network !== 'mainnet' && network !== 'sepolia') {
            console.error(log.error(`The only available values for ${chalk_1.default.bold(`'--network'`)} are ${chalk_1.default.bold(`'mainnet'`)} or ${chalk_1.default.bold(`'sepolia'`)}`));
            process.exit(1);
        }
        await (0, config_1.loadConfig)(network || 'mainnet');
        await analytics_1.Analytics.requestPermission();
    }
    if (subcommand === 'version' || args['--version']) {
        console.log((0, moduleHelpers_1.getInstalledCLIVersion)());
        return;
    }
    if (!subcommand) {
        console.log(help);
        return;
    }
    if (subcommand === 'help' || args['--help']) {
        const command = subcommand === 'help' ? args._[1] : subcommand;
        if (commands_1.default.has(command) && command !== 'help') {
            try {
                const { help } = await Promise.resolve().then(() => __importStar(require(`./commands/${command}`)));
                console.log(help());
            }
            catch (e) {
                console.error(log.error(e.message));
            }
            return;
        }
        console.log(help);
        return;
    }
    if (!commands_1.default.has(subcommand)) {
        if (subcommand.startsWith('-')) {
            console.error(log.error(`The "${chalk_1.default.bold(subcommand)}" option does not exist, run ${chalk_1.default.bold('"dcl help"')} for more info.`));
            process.exit(1);
        }
        console.error(log.error(`The "${chalk_1.default.bold(subcommand)}" subcommand does not exist, run ${chalk_1.default.bold('"dcl help"')} for more info.`));
        process.exit(1);
    }
    try {
        const command = await Promise.resolve().then(() => __importStar(require(`./commands/${subcommand}`)));
        await command.main();
        await (0, analytics_1.finishPendingTracking)();
    }
    catch (e) {
        console.error(log.error(`\`${chalk_1.default.green(`dcl ${subcommand}`)}\` ${e.message}, run ${chalk_1.default.bold(`"dcl help ${subcommand}"`)} for more info.`));
        await analytics_1.Analytics.reportError('Command error', e.message, e.stack);
        log.debug(e);
        process.exit(1);
    }
}
exports.main = main;
//# sourceMappingURL=main.js.map