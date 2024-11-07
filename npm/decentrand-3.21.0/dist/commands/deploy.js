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
exports.main = exports.failWithSpinner = exports.help = void 0;
const arg_1 = __importDefault(require("arg"));
const chalk_1 = __importDefault(require("chalk"));
const dcl_catalyst_client_1 = require("dcl-catalyst-client");
const contracts_snapshots_1 = require("dcl-catalyst-client/dist/contracts-snapshots");
const crypto_1 = require("@dcl/crypto");
const schemas_1 = require("@dcl/schemas");
const opn_1 = __importDefault(require("opn"));
const fetch_component_1 = require("@well-known-components/fetch-component");
const isTypescriptProject_1 = require("../project/isTypescriptProject");
const sceneJson_1 = require("../sceneJson");
const Decentraland_1 = require("../lib/Decentraland");
const spinner = __importStar(require("../utils/spinner"));
const logging_1 = require("../utils/logging");
const moduleHelpers_1 = require("../utils/moduleHelpers");
const analytics_1 = require("../utils/analytics");
const utils_1 = require("../sceneJson/utils");
const errors_1 = require("../utils/errors");
const help = () => `
  Usage: ${chalk_1.default.bold('dcl build [options]')}

    ${chalk_1.default.dim('Options:')}

      -h, --help                Displays complete help
      -p, --port        [port]  Select a custom port for the development server
      -t, --target              Specifies the address and port for the target catalyst server. Defaults to peer.decentraland.org
      -t, --target-content      Specifies the address and port for the target content server. Example: 'peer.decentraland.org/content'. Can't be set together with --target
      -b, --no-browser          Do not open a new browser window
      --skip-version-checks     Skip the ECS and CLI version checks, avoid the warning message and launch anyway
      --skip-build              Skip build before deploy
      --skip-validations        Skip permissions verifications on the client side when deploying content
      --skip-file-size-check    Skip check for maximum file size when deploying to a target content server. Must be used with --target-content

    ${chalk_1.default.dim('Example:')}

    - Deploy your scene:

      ${chalk_1.default.green('$ dcl deploy')}

    - Deploy your scene to a specific content server:

    ${chalk_1.default.green('$ dcl deploy --target my-favorite-catalyst-server.org:2323')}
`;
exports.help = help;
function failWithSpinner(message, error) {
    spinner.fail(message);
    (0, errors_1.fail)(errors_1.ErrorType.DEPLOY_ERROR, error);
}
exports.failWithSpinner = failWithSpinner;
async function main() {
    var _a, _b, _c;
    const args = (0, arg_1.default)({
        '--help': Boolean,
        '-h': '--help',
        '--target': String,
        '-t': '--target',
        '--target-content': String,
        '-tc': '--target-content',
        '--skip-validations': Boolean,
        '--skip-version-checks': Boolean,
        '--skip-build': Boolean,
        '--skip-file-size-check': Boolean,
        '--https': Boolean,
        '--force-upload': Boolean,
        '--yes': Boolean,
        '--no-browser': Boolean,
        '-b': '--no-browser',
        '--port': String,
        '-p': '--port'
    });
    analytics_1.Analytics.sceneStartDeploy();
    if (args['--target'] && args['--target-content']) {
        throw new Error(`You can't set both the 'target' and 'target-content' arguments.`);
    }
    const workDir = process.cwd();
    const skipVersionCheck = args['--skip-version-checks'];
    const skipBuild = args['--skip-build'];
    const skipFileSizeCheck = !!args['--skip-file-size-check'] && !!args['--target-content'];
    const noBrowser = args['--no-browser'];
    const port = args['--port'];
    const parsedPort = typeof port === 'string' ? parseInt(port, 10) : void 0;
    const linkerPort = parsedPort && Number.isInteger(parsedPort) ? parsedPort : void 0;
    spinner.create('Creating deployment structure');
    const dcl = new Decentraland_1.Decentraland({
        isHttps: !!args['--https'],
        workingDir: workDir,
        forceDeploy: args['--force-upload'],
        yes: args['--yes'],
        // validations are skipped for custom content servers
        skipValidations: !!args['--skip-validations'] || !!args['--target'] || !!args['--target-content'],
        linkerPort
    });
    const project = dcl.workspace.getSingleProject();
    if (!project) {
        return failWithSpinner('Cannot deploy a workspace, please go to the project directory and run `dcl deploy` again there.');
    }
    if (!skipVersionCheck) {
        await project.checkCLIandECSCompatibility();
    }
    spinner.create('Building scene in production mode');
    if (!(await (0, isTypescriptProject_1.isTypescriptProject)(workDir))) {
        failWithSpinner(`Please make sure that your project has a 'tsconfig.json' file.`);
    }
    if (!skipBuild) {
        try {
            await (0, moduleHelpers_1.buildTypescript)({
                workingDir: workDir,
                watch: false,
                production: true,
                silence: true
            });
            spinner.succeed('Scene built successfully');
        }
        catch (error) {
            const message = 'Build /scene in production mode failed';
            failWithSpinner(message, error);
        }
    }
    else {
        spinner.succeed();
    }
    spinner.create('Creating deployment structure');
    // Obtain list of files to deploy
    const originalFilesToIgnore = (_a = (await project.getDCLIgnore())) !== null && _a !== void 0 ? _a : (await project.writeDclIgnore());
    const filesToIgnorePlusEntityJson = originalFilesToIgnore.concat('\n entity.json');
    const files = await project.getFiles({
        ignoreFiles: filesToIgnorePlusEntityJson,
        skipFileSizeCheck: skipFileSizeCheck
    });
    const contentFiles = new Map(files.map((file) => [file.path, file.content]));
    // Create scene.json
    const sceneJson = await (0, sceneJson_1.getSceneFile)(workDir);
    const { entityId, files: entityFiles } = await dcl_catalyst_client_1.DeploymentBuilder.buildEntity({
        type: schemas_1.EntityType.SCENE,
        pointers: findPointers(sceneJson),
        files: contentFiles,
        metadata: sceneJson
    });
    spinner.succeed('Deployment structure created.');
    //  Validate scene.json
    (0, utils_1.validateScene)(sceneJson, true);
    dcl.on('link:ready', ({ url, params }) => {
        console.log(chalk_1.default.bold('You need to sign the content before the deployment:'));
        spinner.create(`Signing app ready at ${url}`);
        if (!noBrowser) {
            setTimeout(async () => {
                try {
                    await (0, opn_1.default)(`${url}?${params}`);
                }
                catch (e) {
                    console.log(`Unable to open browser automatically`);
                }
            }, 5000);
        }
        dcl.on('link:success', ({ address, signature, chainId }) => {
            spinner.succeed(`Content successfully signed.`);
            console.log(`${chalk_1.default.bold('Address:')} ${address}`);
            console.log(`${chalk_1.default.bold('Signature:')} ${signature}`);
            console.log(`${chalk_1.default.bold('Network:')} ${(0, schemas_1.getChainName)(chainId)}`);
        });
    });
    // Signing message
    const messageToSign = entityId;
    const { signature, address, chainId } = await dcl.getAddressAndSignature(messageToSign);
    const authChain = crypto_1.Authenticator.createSimpleAuthChain(entityId, address, signature);
    // Uploading data
    let catalyst = null;
    let url = '';
    if (args['--target']) {
        let target = args['--target'];
        if (target.endsWith('/')) {
            target = target.slice(0, -1);
        }
        catalyst = await (0, dcl_catalyst_client_1.createCatalystClient)({
            url: target,
            fetcher: (0, fetch_component_1.createFetchComponent)()
        }).getContentClient();
        url = target;
    }
    else if (args['--target-content']) {
        const targetContent = args['--target-content'];
        catalyst = (0, dcl_catalyst_client_1.createContentClient)({
            url: targetContent,
            fetcher: (0, fetch_component_1.createFetchComponent)()
        });
        url = targetContent;
    }
    else if (chainId === schemas_1.ChainId.ETHEREUM_SEPOLIA) {
        catalyst = await (0, dcl_catalyst_client_1.createCatalystClient)({
            url: 'peer.decentraland.zone',
            fetcher: (0, fetch_component_1.createFetchComponent)()
        }).getContentClient();
        url = 'peer.decentraland.zone';
    }
    else {
        const cachedCatalysts = (0, contracts_snapshots_1.getCatalystServersFromCache)('mainnet');
        for (const cachedCatalyst of cachedCatalysts) {
            const client = (0, dcl_catalyst_client_1.createCatalystClient)({
                url: cachedCatalyst.address,
                fetcher: (0, fetch_component_1.createFetchComponent)()
            });
            const { healthy, content: { publicUrl } } = await client.fetchAbout();
            if (healthy) {
                catalyst = await client.getContentClient();
                url = publicUrl;
                break;
            }
        }
    }
    if (!catalyst) {
        failWithSpinner('Could not find a up catalyst');
        return;
    }
    spinner.create(`Uploading data to: ${url}`);
    const deployData = { entityId, files: entityFiles, authChain };
    const position = sceneJson.scene.base;
    const network = chainId === schemas_1.ChainId.ETHEREUM_SEPOLIA ? 'sepolia' : 'mainnet';
    const worldName = (_b = sceneJson.worldConfiguration) === null || _b === void 0 ? void 0 : _b.name;
    const worldNameParam = worldName ? `&realm=${worldName}` : '';
    const sceneUrl = `https://play.decentraland.org/?NETWORK=${network}&position=${position}&${worldNameParam}`;
    try {
        const response = (await catalyst.deploy(deployData, {
            timeout: 600000
        }));
        project.setDeployInfo({ status: 'success' });
        spinner.succeed(`Content uploaded. ${chalk_1.default.underline.bold(sceneUrl)}\n`);
        const baseCoords = await dcl.workspace.getBaseCoords();
        const parcelCount = await dcl.workspace.getParcelCount();
        analytics_1.Analytics.sceneDeploySuccess({
            projectHash: dcl.getProjectHash(),
            ecs: await dcl.workspace.getSingleProject().getEcsPackageVersion(),
            parcelCount: parcelCount,
            coords: baseCoords,
            isWorld: !!sceneJson.worldConfiguration,
            sceneId: entityId,
            targetContentServer: url,
            worldName: (_c = sceneJson.worldConfiguration) === null || _c === void 0 ? void 0 : _c.name
        });
        if (response.message) {
            console.log(response.message);
        }
    }
    catch (error) {
        (0, logging_1.debug)('\n' + error.stack);
        failWithSpinner('Could not upload content', error);
    }
}
exports.main = main;
function findPointers(sceneJson) {
    return sceneJson.scene.parcels;
}
//# sourceMappingURL=deploy.js.map