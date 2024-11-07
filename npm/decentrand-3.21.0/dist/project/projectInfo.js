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
exports.getProjectInfo = exports.smartWearableNameToId = void 0;
const schemas_1 = require("@dcl/schemas");
const sdk_1 = require("@dcl/schemas/dist/sdk");
const fs_extra_1 = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const project_1 = require("../utils/project");
function smartWearableNameToId(name) {
    return name.toLocaleLowerCase().replace(/ /g, '-');
}
exports.smartWearableNameToId = smartWearableNameToId;
function getProjectInfo(workDir) {
    const wearableJsonPath = path_1.default.resolve(workDir, project_1.WEARABLE_JSON_FILE);
    if (fs_extra_1.default.existsSync(wearableJsonPath)) {
        try {
            const wearableJson = (0, fs_extra_1.readJsonSync)(wearableJsonPath);
            if (sdk_1.WearableJson.validate(wearableJson)) {
                return {
                    sceneId: smartWearableNameToId(wearableJson.name),
                    sceneType: schemas_1.sdk.ProjectType.PORTABLE_EXPERIENCE
                };
            }
            else {
                const errors = (sdk_1.WearableJson.validate.errors || []).map((a) => `${a.data} ${a.message}`).join('');
                if (errors.length > 0) {
                    console.error(`Unable to validate '${project_1.WEARABLE_JSON_FILE}' properly, please check it: ${errors}`);
                }
                else {
                    console.error(`Unable to validate '${project_1.WEARABLE_JSON_FILE}' properly, please check it.`);
                }
                return null;
            }
        }
        catch (err) {
            console.error(`Unable to load ${project_1.WEARABLE_JSON_FILE} properly, please check it.`, err);
            return null;
        }
    }
    const assetJsonPath = path_1.default.resolve(workDir, project_1.ASSET_JSON_FILE);
    if (fs_extra_1.default.existsSync(assetJsonPath)) {
        // Validate, if is not valid, return null
        const assetJson = (0, fs_extra_1.readJsonSync)(assetJsonPath);
        if (assetJson.assetType) {
            const docUrl = 'https://docs.decentraland.org/development-guide/smart-wearables/';
            console.error(`Field assetType was used to discern smart wearable from smart item, but it's no longer support.
      Please if you're trying to develop a smart wearable read the docs, you probably need to change the 'asset.json' to 'wearable.json'.
      This 'wearable.json' has a different format that previous one.
      More information: ${docUrl}`);
            return null;
        }
        return {
            sceneId: 'b64-' + Buffer.from(workDir).toString('base64'),
            sceneType: schemas_1.sdk.ProjectType.SMART_ITEM
        };
    }
    return {
        sceneId: 'b64-' + Buffer.from(workDir).toString('base64'),
        sceneType: schemas_1.sdk.ProjectType.SCENE
    };
}
exports.getProjectInfo = getProjectInfo;
//# sourceMappingURL=projectInfo.js.map