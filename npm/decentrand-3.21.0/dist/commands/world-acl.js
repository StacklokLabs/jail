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
exports.getAuthHeaders = exports.AUTH_METADATA_HEADER = exports.AUTH_TIMESTAMP_HEADER = exports.AUTH_CHAIN_HEADER_PREFIX = exports.WorldPermissionType = exports.main = exports.help = void 0;
const chalk_1 = __importDefault(require("chalk"));
const errors_1 = require("../utils/errors");
const spinner = __importStar(require("../utils/spinner"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const arg_1 = __importDefault(require("arg"));
const opn_1 = __importDefault(require("opn"));
const crypto_1 = require("@dcl/crypto");
const WorldsContentServer_1 = require("../lib/WorldsContentServer");
const analytics_1 = require("../utils/analytics");
const spec = {
    '--help': Boolean,
    '-h': '--help',
    '--https': Boolean,
    '--target-content': String,
    '-t': '--target-content',
    '--port': String,
    '-p': '--port'
};
function help() {
    return `
  Usage: ${chalk_1.default.bold('dcl world-acl [world-name] SUBCOMMAND [options]')}
  
    ${chalk_1.default.dim('Sub commands:')}
      show                          List all addresses allowed to deploy a scene to a specified world.
      grant  addr                 Grant permission to new address to deploy a scene to a specified world.
      revoke addr                 Remove permission for given address to deploy a scene to a specified world.
  

    ${chalk_1.default.dim('Options:')}

      -h, --help                  Displays complete help
      -p, --port [port]           Select a custom port for the linker app (for signing with browser wallet)
      -t, --target-content [url]  Specifies the base URL for the target Worlds Content Server. Example: 'https://worlds-content-server.decentraland.org'.

    ${chalk_1.default.dim('Examples:')}
      - Show which addresses were given permission to deploy name.dcl.eth
      ${chalk_1.default.green('$ dcl world-acl name.dcl.eth show')}

      - Grant address 0x1 permission to deploy name.dcl.eth
      ${chalk_1.default.green('$ dcl world-acl name.dcl.eth grant 0x1')}

      - Revoke address 0x1 permission to deploy name.dcl.eth
      ${chalk_1.default.green('$ dcl world-acl name.dcl.eth revoke 0x1')}
`;
}
exports.help = help;
async function main() {
    if (process.argv.length <= 4) {
        (0, errors_1.fail)(errors_1.ErrorType.WORLD_CONTENT_SERVER_ERROR, `The subcommand is not recognized`);
    }
    const args = (0, arg_1.default)(spec);
    if (!args['--target-content']) {
        args['--target-content'] = 'https://worlds-content-server.decentraland.org';
    }
    analytics_1.Analytics.worldAcl({
        action: args._[2].toLowerCase()
    });
    const subcommandList = {
        show: showAcl,
        grant: grantAcl,
        revoke: revokeAcl,
        help: async () => console.log(help())
    };
    const subcommand = args._[2].toLowerCase();
    if (subcommand in subcommandList) {
        await subcommandList[subcommand](args);
    }
    else {
        (0, errors_1.fail)(errors_1.ErrorType.WORLD_CONTENT_SERVER_ERROR, `The subcommand ${subcommand} is not recognized`);
    }
}
exports.main = main;
class HTTPResponseError extends Error {
    constructor(response) {
        super(`HTTP Error Response: ${response.status} ${response.statusText} for URL ${response.url}`);
        this.response = response;
    }
}
const checkStatus = (response) => {
    if (response.ok) {
        // response.status >= 200 && response.status < 300
        return response;
    }
    throw new HTTPResponseError(response);
};
var WorldPermissionType;
(function (WorldPermissionType) {
    WorldPermissionType["Unrestricted"] = "unrestricted";
    WorldPermissionType["AllowList"] = "allow-list";
})(WorldPermissionType = exports.WorldPermissionType || (exports.WorldPermissionType = {}));
async function fetchAcl(worldName, targetContent) {
    spinner.create(`Fetching acl for world ${worldName}`);
    try {
        const data = await (0, node_fetch_1.default)(`${targetContent}/world/${worldName}/permissions`)
            .then(checkStatus)
            .then((res) => res.json());
        spinner.succeed();
        return data.permissions.deployment;
    }
    catch (error) {
        spinner.fail(await error.response.text());
        throw error;
    }
}
async function storeAcl(worldName, headers, targetContent, path, method) {
    spinner.create(`Storing acl for world ${worldName}`);
    try {
        await (0, node_fetch_1.default)(`${targetContent}${path}`, {
            method: method,
            headers: Object.assign(Object.assign({}, headers), { 'Content-Type': 'application/json' })
        }).then(checkStatus);
        spinner.succeed(`Stored acl for world ${worldName}`);
        return true;
    }
    catch (error) {
        const message = error.response.headers.get('content-type') === 'application/json'
            ? (await error.response.json()).message
            : await error.response.text();
        spinner.fail(message);
        throw Error(message);
    }
}
function displayPermissionToConsole(data, worldName) {
    if (data.wallets.length === 0) {
        console.log(`${chalk_1.default.dim('Only the owner of')} ${chalk_1.default.bold(worldName)} ${chalk_1.default.dim('can deploy scenes under that name.')}`);
    }
    else {
        console.log(`${chalk_1.default.dim('The following addresses are authorized to deploy scenes under')} ${chalk_1.default.bold(worldName)}${chalk_1.default.dim(':')}`);
        data.wallets.forEach((address) => {
            console.log(`  ${chalk_1.default.bold(address)}`);
        });
    }
}
async function showAcl(args) {
    const worldName = args._[1];
    const targetContent = args['--target-content'];
    try {
        const data = await fetchAcl(worldName, targetContent);
        displayPermissionToConsole(data, worldName);
    }
    catch (_) {
        process.exit(1);
    }
}
async function grantAcl(args) {
    const worldName = args._[1];
    const addresses = args._.slice(3);
    try {
        if (addresses.length > 1) {
            (0, errors_1.fail)(errors_1.ErrorType.WORLD_CONTENT_SERVER_ERROR, `Only one address can be granted at a time.`);
        }
        await signAndStoreAcl(args, { resource: worldName, allowed: addresses[0], method: 'put' });
    }
    catch (error) {
        spinner.fail(error.message);
        throw Error(error.message);
    }
}
async function revokeAcl(args) {
    const worldName = args._[1];
    const addresses = args._.slice(3);
    try {
        if (addresses.length > 1) {
            (0, errors_1.fail)(errors_1.ErrorType.WORLD_CONTENT_SERVER_ERROR, `Only one address can be revoke at a time.`);
        }
        await signAndStoreAcl(args, { resource: worldName, allowed: addresses[0], method: 'delete' });
    }
    catch (error) {
        spinner.fail(error.message);
        throw Error(error.message);
    }
}
async function signAndStoreAcl(args, acl) {
    const path = `/world/${acl.resource}/permissions/deployment/${acl.allowed}`;
    const timestamp = Date.now().toString();
    const payload = [acl.method, path, timestamp, '{}'].join(':').toLowerCase();
    const port = args['--port'];
    const parsedPort = port ? parseInt(port, 10) : void 0;
    const linkerPort = parsedPort && Number.isInteger(parsedPort) ? parsedPort : void 0;
    const targetContent = args['--target-content'];
    const worldsContentServer = new WorldsContentServer_1.WorldsContentServer({
        worldName: acl.resource,
        allowed: [acl.allowed],
        oldAllowed: [],
        isHttps: !!args['--https'],
        targetContent,
        linkerPort,
        method: acl.method
    });
    worldsContentServer.on('link:ready', ({ url }) => {
        console.log(chalk_1.default.bold('You need to sign the acl:'));
        spinner.create(`Signing app ready at ${url}`);
        setTimeout(async () => {
            try {
                await (0, opn_1.default)(`${url}/acl`);
            }
            catch (e) {
                console.log(`Unable to open browser automatically`);
            }
        }, 5000);
        worldsContentServer.on('link:success', ({ address, signature }) => {
            spinner.succeed(`ACL successfully signed.`);
            console.log(`${chalk_1.default.bold('Address:')} ${address}`);
            console.log(`${chalk_1.default.bold('Signature:')} ${signature}`);
        });
    });
    const { signature, address } = await worldsContentServer.getAddressAndSignature(payload);
    const authChain = crypto_1.Authenticator.createSimpleAuthChain(payload, address, signature);
    const headers = getAuthHeaders(authChain, timestamp);
    try {
        await storeAcl(acl.resource, headers, targetContent, path, acl.method);
        const data = await fetchAcl(acl.resource, targetContent);
        displayPermissionToConsole(data, acl.resource);
    }
    catch (error) {
        process.exit(1);
    }
    process.exit();
}
exports.AUTH_CHAIN_HEADER_PREFIX = 'x-identity-auth-chain-';
exports.AUTH_TIMESTAMP_HEADER = 'x-identity-timestamp';
exports.AUTH_METADATA_HEADER = 'x-identity-metadata';
function getAuthHeaders(authChain, timestamp) {
    const headers = {};
    authChain.forEach((link, index) => {
        headers[`${exports.AUTH_CHAIN_HEADER_PREFIX}${index}`] = JSON.stringify(link);
    });
    headers[exports.AUTH_TIMESTAMP_HEADER] = timestamp;
    headers[exports.AUTH_METADATA_HEADER] = JSON.stringify({});
    return headers;
}
exports.getAuthHeaders = getAuthHeaders;
//# sourceMappingURL=world-acl.js.map