"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadRepoZip = exports.downloadFile = void 0;
const extract_zip_1 = __importDefault(require("extract-zip"));
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const downloadFile = async function (url, dest) {
    const data = await (await (0, node_fetch_1.default)(url)).arrayBuffer();
    await (0, fs_extra_1.writeFile)(dest, Buffer.from(data));
};
exports.downloadFile = downloadFile;
const downloadRepoZip = async function (url, dest) {
    const zipFilePath = path_1.default.resolve(dest, 'temp-zip-project.zip');
    await (0, exports.downloadFile)(url, zipFilePath);
    const oldFiles = await (0, fs_extra_1.readdir)(dest);
    try {
        await (0, extract_zip_1.default)(zipFilePath, { dir: dest });
    }
    catch (err) {
        console.log(`Couldn't extract the zip of the repository.`, err);
        throw err;
    }
    const newFiles = await (0, fs_extra_1.readdir)(dest);
    const directoryCreated = newFiles.filter((value) => !oldFiles.includes(value));
    if (directoryCreated.length !== 1) {
        throw new Error('Please, make sure not to modify the directory while the example repository is downloading.');
    }
    const extractedPath = path_1.default.resolve(dest, directoryCreated[0]);
    const filesToMove = await (0, fs_extra_1.readdir)(extractedPath);
    for (const filePath of filesToMove) {
        await (0, fs_extra_1.move)(path_1.default.resolve(extractedPath, filePath), path_1.default.resolve(dest, filePath));
    }
    (0, fs_1.rmdirSync)(extractedPath);
    await (0, fs_extra_1.remove)(zipFilePath);
};
exports.downloadRepoZip = downloadRepoZip;
//# sourceMappingURL=download.js.map