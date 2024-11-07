"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeModulesPath = exports.getIgnoreFilePath = exports.getPackageFilePath = exports.getSceneFilePath = exports.DCLIGNORE_FILE = exports.WEARABLE_JSON_FILE = exports.ASSET_JSON_FILE = exports.ESTLINTRC_FILE = exports.NPMRC_FILE = exports.GITIGNORE_FILE = exports.PACKAGE_FILE = exports.SCENE_FILE = void 0;
const path_1 = __importDefault(require("path"));
exports.SCENE_FILE = 'scene.json';
exports.PACKAGE_FILE = 'package.json';
exports.GITIGNORE_FILE = 'gitignore';
exports.NPMRC_FILE = 'npmrc';
exports.ESTLINTRC_FILE = 'eslintrc.json';
exports.ASSET_JSON_FILE = 'asset.json';
exports.WEARABLE_JSON_FILE = 'wearable.json';
exports.DCLIGNORE_FILE = '.dclignore';
/**
 * Composes the path to the `scene.json` file based on the provided path.
 * @param dir The path to the directory containing the scene file.
 */
function getSceneFilePath(dir) {
    return path_1.default.resolve(dir, exports.SCENE_FILE);
}
exports.getSceneFilePath = getSceneFilePath;
/**
 * Composes the path to the `package.json` file based on the provided path.
 * @param dir The path to the directory containing the package.json file.
 */
function getPackageFilePath(dir) {
    return path_1.default.resolve(dir, exports.PACKAGE_FILE);
}
exports.getPackageFilePath = getPackageFilePath;
/**
 * Composes the path to the `.dclignore` file based on the provided path.
 * @param dir The path to the directory containing the .dclignore file.
 */
function getIgnoreFilePath(dir) {
    return path_1.default.resolve(dir, exports.DCLIGNORE_FILE);
}
exports.getIgnoreFilePath = getIgnoreFilePath;
/**
 * Returns the path to the node_modules directory.
 * @param dir The path to the directory containing the node_modules directory.
 */
function getNodeModulesPath(dir) {
    return path_1.default.resolve(dir, 'node_modules');
}
exports.getNodeModulesPath = getNodeModulesPath;
//# sourceMappingURL=project.js.map