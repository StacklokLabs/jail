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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.help = void 0;
const schemas_1 = require("@dcl/schemas");
const chalk_1 = __importDefault(require("chalk"));
const errors_1 = require("../utils/errors");
const coordinateHelpers_1 = require("../utils/coordinateHelpers");
const sceneJson_1 = require("../sceneJson");
const spinner = __importStar(require("../utils/spinner"));
const Workspace_1 = require("../lib/Workspace");
function help() {
    return `
  Usage: ${chalk_1.default.bold('dcl coords [parcels]')}

    ${chalk_1.default.dim('Options:')}

      -h, --help               Displays complete help

    ${chalk_1.default.dim('Examples:')}
      - ${chalk_1.default.bold('Single parcel')}
      - Pass a single argument with the scene coords. This coordinate is also set as the base parcel.
      ${chalk_1.default.green('$ dcl coords 0,0')}

      - ${chalk_1.default.bold('Multiple parcels')}
      - Pass two arguments: the South-West and the North-East parcels. The South-West parcel is also set as the base parcel.
      ${chalk_1.default.green('$ dcl coords 0,0 1,1')}

      - ${chalk_1.default.bold('Customize Base Parcel')}
      - Pass three arguments: the South-West and the North-East parcels, and the parcel to use as a base parcel.
      ${chalk_1.default.green('$ dcl coords 0,0 1,1 1,0')}
`;
}
exports.help = help;
async function main() {
    spinner.create('Generating coords');
    const parcels = process.argv.slice(process.argv.findIndex((arg) => arg === 'coords') + 1);
    const workingDir = process.cwd();
    const workspace = (0, Workspace_1.createWorkspace)({ workingDir });
    const project = workspace.getSingleProject();
    if (project === null) {
        (0, errors_1.fail)(errors_1.ErrorType.INFO_ERROR, `Can not change a coords of workspace.`);
    }
    else if (project.getInfo().sceneType !== schemas_1.sdk.ProjectType.SCENE) {
        (0, errors_1.fail)(errors_1.ErrorType.INFO_ERROR, 'Only parcel scenes can be edited the coords property.');
    }
    if (!parcels || !parcels.length) {
        (0, errors_1.fail)(errors_1.ErrorType.INFO_ERROR, 'Please provide a target to retrieve data');
    }
    if (parcels.length > 3) {
        (0, errors_1.fail)(errors_1.ErrorType.INFO_ERROR, 'Invalid number of args');
    }
    const invalidParcel = parcels.find((p) => !(0, coordinateHelpers_1.isValid)(p));
    if (invalidParcel) {
        (0, errors_1.fail)(errors_1.ErrorType.INFO_ERROR, `Invalid target "${chalk_1.default.bold(invalidParcel)}"`);
    }
    const parcelObjects = parcels.map(coordinateHelpers_1.getObject);
    const _a = await (0, sceneJson_1.getSceneFile)(workingDir), { scene } = _a, sceneJson = __rest(_a, ["scene"]);
    const newScene = getSceneObject(parcelObjects);
    const parsedSceneJson = Object.assign(Object.assign({}, sceneJson), { scene: newScene });
    await (0, sceneJson_1.setSceneFile)(parsedSceneJson, workingDir);
    spinner.succeed();
}
exports.main = main;
function getSceneObject([sw, ne, baseParcel = sw]) {
    if (!ne) {
        const coords = (0, coordinateHelpers_1.getString)(sw);
        return { base: coords, parcels: [coords] };
    }
    const getValues = (key) => Array.from({
        length: ne[key] - sw[key] + 1
    }).map((_, value) => value + sw[key]);
    const xValues = getValues('x');
    const yValues = getValues('y');
    const parcels = xValues.reduce((acc, x) => {
        const coord = yValues.map((y) => (0, coordinateHelpers_1.getString)({ x, y }));
        return acc.concat(coord);
    }, []);
    const base = parcels.length ? (0, coordinateHelpers_1.getString)(baseParcel) : '';
    if (!parcels.includes(base)) {
        spinner.fail();
        (0, errors_1.fail)(errors_1.ErrorType.INFO_ERROR, `Invalid base parcel ${chalk_1.default.bold(base)}`);
    }
    return { parcels, base };
}
//# sourceMappingURL=coords.js.map