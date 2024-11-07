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
const Decentraland_1 = require("../lib/Decentraland");
const logging_1 = require("../utils/logging");
const analytics_1 = require("../utils/analytics");
const coordinateHelpers_1 = require("../utils/coordinateHelpers");
const errors_1 = require("../utils/errors");
const land_1 = require("../utils/land");
const spinner = __importStar(require("../utils/spinner"));
const help = () => `
  Usage: ${chalk_1.default.bold('dcl info [target] [options]')}

    ${chalk_1.default.dim('Options:')}

      -h, --help                Displays complete help
      -b, --blockchain          Retrieve information directly from the blockchain instead of Decentraland remote API
      -n, --network             Choose between ${chalk_1.default.bold('mainnet')} and ${chalk_1.default.bold('sepolia')} (default 'mainnet')


    ${chalk_1.default.dim('Examples:')}

    - Get information from the ${chalk_1.default.bold('LAND')} located at "${chalk_1.default.bold('-12, 40')}"

      ${chalk_1.default.green('$ dcl info -12,40')}

    - Get information from the ${chalk_1.default.bold('estate')} with ID "${chalk_1.default.bold('5')}" directly from blockchain provider

      ${chalk_1.default.green('$ dcl info 5 --blockchain')}

    - Get information from the ${chalk_1.default.bold('address 0x8bed95d830475691c10281f1fea2c0a0fe51304b')}"

      ${chalk_1.default.green('$ dcl info 0x8bed95d830475691c10281f1fea2c0a0fe51304b')}
`;
exports.help = help;
function getTargetType(value) {
    if ((0, coordinateHelpers_1.isValid)(value)) {
        return 'parcel';
    }
    const id = parseInt(value, 10);
    if (Number.isInteger(id) && id > 0) {
        return 'estate';
    }
    if (value.startsWith('0x')) {
        return 'address';
    }
    return '';
}
async function main() {
    const args = (0, arg_1.default)({
        '--help': Boolean,
        '--blockchain': Boolean,
        '--network': String,
        '-h': '--help',
        '-b': '--blockchain',
        '-n': '--network'
    }, { permissive: true });
    if (!args._[1]) {
        (0, errors_1.fail)(errors_1.ErrorType.INFO_ERROR, 'Please provide a target to retrieve data');
    }
    const target = (0, land_1.parseTarget)(args._);
    (0, logging_1.debug)(`Parsed target: ${target}`);
    const type = getTargetType(target);
    if (!type) {
        (0, errors_1.fail)(errors_1.ErrorType.INFO_ERROR, `Invalid target "${chalk_1.default.bold(target)}"`);
    }
    const dcl = new Decentraland_1.Decentraland({
        blockchain: args['--blockchain'],
        workingDir: process.cwd()
    });
    if (type === 'parcel') {
        spinner.create(chalk_1.default.dim(`Fetching information for LAND ${target}`));
        const coords = (0, coordinateHelpers_1.getObject)(target);
        analytics_1.Analytics.infoCmd({ type: 'coordinates', target: coords });
        const [estate, data] = await Promise.all([dcl.getEstateOfParcel(coords), dcl.getParcelInfo(coords)]);
        const output = estate ? Object.assign(Object.assign({}, data), { estate }) : data;
        spinner.succeed(`Fetched data for LAND ${chalk_1.default.bold(target)}`);
        logParcel(output);
        return;
    }
    if (type === 'estate') {
        spinner.create(chalk_1.default.dim(`Fetching information for Estate ${target}`));
        const estateId = parseInt(target, 10);
        analytics_1.Analytics.infoCmd({ type: 'estate', target: estateId });
        const estate = await dcl.getEstateInfo(estateId);
        spinner.succeed(`Fetched data for Estate ${chalk_1.default.bold(target)}`);
        logEstate(estate, estateId);
        return;
    }
    spinner.create(chalk_1.default.dim(`Fetching information for address ${target}`));
    analytics_1.Analytics.infoCmd({ type: 'address', target: target });
    const { parcels, estates } = await dcl.getAddressInfo(target);
    const formattedParcels = parcels.reduce((acc, parcel) => {
        return Object.assign(Object.assign({}, acc), { [`${parcel.x},${parcel.y}`]: {
                name: parcel.name,
                description: parcel.description
            } });
    }, {});
    const formattedEstates = estates.reduce((acc, estate) => {
        return Object.assign(Object.assign({}, acc), { [`ID ${estate.id.toString()}`]: {
                name: estate.name,
                description: estate.description
            } });
    }, {});
    spinner.succeed(`Fetched data for address ${chalk_1.default.bold(target)}`);
    if (parcels.length === 0 && estates.length === 0) {
        return console.log(chalk_1.default.italic('\n  No information available\n'));
    }
    if (parcels.length !== 0) {
        console.log(`\n  LAND owned by ${target}:\n`);
        console.log((0, logging_1.formatDictionary)(formattedParcels, { spacing: 2, padding: 2 }));
    }
    if (estates.length !== 0) {
        console.log(`\n  Estates owned by ${target}:\n`);
        console.log((0, logging_1.formatDictionary)(formattedEstates, { spacing: 2, padding: 2 }));
    }
}
exports.main = main;
function logParcel(output) {
    console.log('\n  Scene Metadata:\n');
    if (output.scene) {
        console.log((0, logging_1.formatDictionary)(output.scene, { spacing: 2, padding: 2 }));
    }
    else {
        console.log(chalk_1.default.italic('    No information available\n'));
    }
    console.log('  LAND Metadata:\n');
    if (output.land) {
        console.log((0, logging_1.formatDictionary)(output.land, { spacing: 2, padding: 2 }));
    }
    else {
        console.log(chalk_1.default.italic('    No information available\n'));
    }
    if (output.estate) {
        logEstate(output.estate);
    }
}
function logEstate(estate, id) {
    if (!estate) {
        console.log(chalk_1.default.italic(`\n  Estate with ID ${id} doesn't exist\n`));
        return;
    }
    if (estate.parcels.length === 0) {
        console.log(chalk_1.default.bold(`\n  Estate with ID ${id} has been dissolved\n`));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: TODO
        delete estate.parcels;
    }
    console.log('  Estate Metadata:\n');
    if (estate) {
        const estateInfo = Object.assign(Object.assign({}, estate), { parcels: singleLineParcels(estate.parcels) });
        console.log((0, logging_1.formatDictionary)(estateInfo, { spacing: 2, padding: 2 }));
    }
}
function singleLineParcels(parcels) {
    return parcels.map(coordinateHelpers_1.getString).join('; ');
}
//# sourceMappingURL=info.js.map