"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSceneFile = exports.getSceneFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
let sceneFile;
async function getSceneFile(workingDir, cache = true) {
    if (cache && sceneFile) {
        return sceneFile;
    }
    sceneFile = await fs_extra_1.default.readJSON(path_1.default.resolve(workingDir, 'scene.json'));
    return sceneFile;
}
exports.getSceneFile = getSceneFile;
async function setSceneFile(sceneFile, workingDir) {
    return fs_extra_1.default.writeJSON(path_1.default.resolve(workingDir, 'scene.json'), sceneFile, {
        spaces: 2
    });
}
exports.setSceneFile = setSceneFile;
//# sourceMappingURL=index.js.map