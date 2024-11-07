"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTemplateUrl = exports.getRepositoryUrl = exports.getInitOption = exports.getProjectTypes = void 0;
const schemas_1 = require("@dcl/schemas");
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const errors_1 = require("../../utils/errors");
const repositories_1 = __importDefault(require("./repositories"));
const scene_1 = require("./scene");
function getProjectTypes() {
    return Object.values(schemas_1.sdk.ProjectType)
        .filter((a) => typeof a === 'string')
        .join(', ');
}
exports.getProjectTypes = getProjectTypes;
async function getInitOption(type) {
    if (type) {
        if (!schemas_1.sdk.ProjectType.validate(type)) {
            (0, errors_1.fail)(errors_1.ErrorType.INIT_ERROR, `Invalid projectType: "${chalk_1.default.bold(type)}". Supported types are ${chalk_1.default.bold(getProjectTypes())}`);
        }
        return {
            type: 'project',
            value: type
        };
    }
    const projectTypeList = [
        {
            type: 'list',
            name: 'project',
            message: 'Choose a project type',
            choices: [
                {
                    name: 'Scene',
                    value: 'scene-option'
                },
                {
                    name: 'Library',
                    value: schemas_1.sdk.ProjectType.LIBRARY
                }
            ]
        }
    ];
    const answers = await inquirer_1.default.prompt(projectTypeList);
    if (answers.project === 'scene-option') {
        return (0, scene_1.sceneOptions)();
    }
    if (schemas_1.sdk.ProjectType.validate(answers.project)) {
        return {
            type: 'project',
            value: answers.project
        };
    }
    (0, errors_1.fail)(errors_1.ErrorType.INIT_ERROR, `Couldn't get a valid first-level choice. Try to select a valid one.`);
    return {};
}
exports.getInitOption = getInitOption;
function getRepositoryUrl(choice) {
    if (choice.value === schemas_1.sdk.ProjectType.SCENE) {
        return repositories_1.default.scenes[0].url;
    }
    if (choice.value === schemas_1.sdk.ProjectType.LIBRARY) {
        return repositories_1.default.library;
    }
    if (choice.type === 'scene') {
        return choice.value;
    }
}
exports.getRepositoryUrl = getRepositoryUrl;
function isValidTemplateUrl(url) {
    return /^https:\/\/github\.com\/decentraland(-scenes)?\/(.)+\.zip/.test(url);
}
exports.isValidTemplateUrl = isValidTemplateUrl;
//# sourceMappingURL=utils.js.map