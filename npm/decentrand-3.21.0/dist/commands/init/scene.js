"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sceneOptions = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const repositories_1 = __importDefault(require("./repositories"));
const errors_1 = require("../../utils/errors");
async function sceneOptions() {
    const sceneChoices = [
        ...repositories_1.default.scenes.map((repo, index) => ({
            name: `(${index + 1}) ${repo.title}`,
            value: repo.url
        })),
        {
            name: 'Paste a repository URL',
            value: 'write-repository'
        }
    ];
    const projectTypeList = [
        {
            type: 'list',
            name: 'scene',
            message: 'Choose a scene',
            choices: sceneChoices
        }
    ];
    const answers = await inquirer_1.default.prompt(projectTypeList);
    if (answers.scene === 'write-repository') {
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'url',
                message: 'Write the repository URL:'
            }
        ]);
        return {
            type: 'scene',
            value: answers.url
        };
    }
    else if (answers.scene) {
        const choice = sceneChoices.find((item) => item.value === answers.scene);
        if (choice) {
            return {
                type: 'scene',
                value: answers.scene
            };
        }
    }
    (0, errors_1.fail)(errors_1.ErrorType.INIT_ERROR, `Couldn't get a valid scene-level choice. Try to select a valid one.`);
    return {};
}
exports.sceneOptions = sceneOptions;
//# sourceMappingURL=scene.js.map