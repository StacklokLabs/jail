"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.help = void 0;
const chalk_1 = __importDefault(require("chalk"));
const arg_1 = __importDefault(require("arg"));
const Decentraland_1 = require("../lib/Decentraland");
const logging_1 = require("../utils/logging");
const analytics_1 = require("../utils/analytics");
const coordinateHelpers_1 = require("../utils/coordinateHelpers");
const errors_1 = require("../utils/errors");
const land_1 = require("../utils/land");
const help = () => `
  Usage: ${chalk_1.default.bold('dcl status [target] [options]')}

    ${chalk_1.default.dim('Options:')}

      -h, --help                Displays complete help
      -n, --network             Choose between ${chalk_1.default.bold('mainnet')} and ${chalk_1.default.bold('sepolia')} (default 'mainnet')


    ${chalk_1.default.dim('Examples:')}

    - Get Decentraland Scene information of the current project"

      ${chalk_1.default.green('$ dcl status')}

    - Get Decentraland Scene information of the parcel ${chalk_1.default.bold('-12, 40')}"

      ${chalk_1.default.green('$ dcl status -12,40')}
`;
exports.help = help;
async function main() {
    const args = (0, arg_1.default)({
        '--help': Boolean,
        '--network': String,
        '-h': '--help',
        '-n': '--network'
    }, { permissive: true });
    const dcl = new Decentraland_1.Decentraland({ workingDir: process.cwd() });
    const target = (0, land_1.parseTarget)(args._);
    let coords;
    if (target) {
        if (!(0, coordinateHelpers_1.isValid)(target)) {
            (0, errors_1.fail)(errors_1.ErrorType.STATUS_ERROR, `Invalid target "${chalk_1.default.bold(target)}"`);
        }
        coords = (0, coordinateHelpers_1.getObject)(target);
    }
    const project = dcl.workspace.getSingleProject();
    if (!coords && project) {
        await project.validateExistingProject();
        coords = await project.getParcelCoordinates();
    }
    if (!coords) {
        (0, errors_1.fail)(errors_1.ErrorType.STATUS_ERROR, `Cannot get the coords`);
        return;
    }
    else {
        const { cid, files } = await dcl.getParcelStatus(coords.x, coords.y);
        analytics_1.Analytics.statusCmd({ type: 'coordinates', target: coords });
        logStatus(files, cid, `${coords.x},${coords.y}`);
    }
}
exports.main = main;
function logStatus(files, cid, coords) {
    const serializedList = (0, logging_1.formatList)(files, { spacing: 2, padding: 2 });
    if (files.length === 0) {
        console.log(chalk_1.default.italic('\n  No information available'));
    }
    else {
        console.log(`\n  Deployment status for ${coords}:`);
        if (cid) {
            console.log(`\n    Project CID: ${cid}`);
        }
        console.log(serializedList);
    }
}
//# sourceMappingURL=status.js.map