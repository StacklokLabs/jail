"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserHome = exports.isEmptyDirectory = exports.readJSONSync = exports.readJSON = exports.writeJSON = exports.ensureFolder = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
/**
 * Checks if a folder exists and creates it if necessary.
 * @param path One or multiple paths to be checked.
 */
async function ensureFolder(path) {
    if (typeof path === 'string') {
        if (await fs_extra_1.default.pathExists(path)) {
            return;
        }
        await fs_extra_1.default.mkdir(path);
    }
    if (Array.isArray(path)) {
        if (path.length === 0) {
            return;
        }
        else if (path.length === 1) {
            return ensureFolder(path[0]);
        }
        else {
            await ensureFolder(path[0]);
            await ensureFolder(path.slice(1));
        }
    }
}
exports.ensureFolder = ensureFolder;
/**
 * Merges the provided content with a json file
 * @param path The path to the subject json file
 * @param content The content to be applied (as a plain object)
 */
async function writeJSON(path, content) {
    let currentFile;
    try {
        currentFile = await readJSON(path);
    }
    catch (e) {
        currentFile = {};
    }
    const strContent = JSON.stringify(Object.assign(Object.assign({}, currentFile), content), null, 2);
    return fs_extra_1.default.outputFile(path, strContent);
}
exports.writeJSON = writeJSON;
/**
 * Reads a file and parses it's JSON content
 * @param path The path to the subject json file
 */
async function readJSON(path) {
    const content = await fs_extra_1.default.readFile(path, 'utf-8');
    return JSON.parse(content);
}
exports.readJSON = readJSON;
/**
 * Reads a file and parses it's JSON content
 * @param path The path to the subject json file
 */
function readJSONSync(path) {
    const content = fs_extra_1.default.readFileSync(path, 'utf-8');
    return JSON.parse(content);
}
exports.readJSONSync = readJSONSync;
/**
 * Returns true if the directory is empty
 */
async function isEmptyDirectory(dir = '.') {
    const files = await fs_extra_1.default.readdir(dir);
    return files.length === 0;
}
exports.isEmptyDirectory = isEmptyDirectory;
/**
 * Returns th name of the Home directory in a platform-independent way.
 * @returns `USERPROFILE` or `HOME`
 */
function getUserHome() {
    return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] || '';
}
exports.getUserHome = getUserHome;
//# sourceMappingURL=filesystem.js.map