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
exports.validateScene = void 0;
const chalk_1 = __importDefault(require("chalk"));
const schemas_1 = require("@dcl/schemas");
const spinner = __importStar(require("../utils/spinner"));
function checkMissingOrDefault(obj, defaults) {
    const missingKeys = Object.entries(defaults).reduce((acc, [key, value]) => {
        return obj[key] && obj[key] !== value ? acc : acc.concat(key);
    }, []);
    return missingKeys;
}
function validateScene(sceneJson, log = false) {
    log && spinner.create('Validating scene.json');
    const validScene = schemas_1.Scene.validate(sceneJson);
    if (!validScene) {
        const error = (schemas_1.Scene.validate.errors || []).map((a) => `${a.data} ${a.message}`).join('');
        log && spinner.fail(`Invalid scene.json: ${error}`);
        return false;
    }
    const defaults = {
        title: 'DCL Scene',
        description: 'My new Decentraland project',
        navmapThumbnail: 'images/scene-thumbnail.png'
    };
    const sceneDisplay = sceneJson.display || {};
    const missingKeys = checkMissingOrDefault(sceneDisplay, defaults);
    if (log) {
        if (missingKeys.length) {
            spinner.warn(`Don't forget to update your scene.json metadata: [${missingKeys.join(', ')}]
        ${chalk_1.default.underline.bold('https://docs.decentraland.org/development-guide/scene-metadata/')}`);
        }
        else {
            spinner.succeed();
        }
    }
    return !missingKeys.length;
}
exports.validateScene = validateScene;
//# sourceMappingURL=utils.js.map