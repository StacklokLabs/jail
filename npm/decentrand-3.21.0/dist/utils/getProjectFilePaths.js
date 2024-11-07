"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const ignore_1 = __importDefault(require("ignore"));
async function getProjectFilePaths(dir, ignoreFileContent) {
    const fileNames = ignore_1.default()
        .add(ignoreFileContent)
        .filter(await fs_extra_1.default.readdir(dir));
    const filePaths = fileNames.map((fileName) => path_1.default.resolve(dir, fileName));
    const stats = await Promise.all(filePaths.map((filePath) => fs_extra_1.default.stat(filePath)));
    const files = [];
    const pendingPromises = [];
    stats.forEach(async (stat, i) => {
        if (stat.isDirectory()) {
            const promise = new Promise((resolve, reject) => {
                getProjectFilePaths(filePaths[i], ignoreFileContent)
                    .then((resolvedFilePaths) => {
                    const finals = resolvedFilePaths.map((f) => path_1.default.join(fileNames[i], f));
                    resolve(finals);
                })
                    .catch(reject);
            });
            pendingPromises.push(promise);
        }
        else {
            files.push(fileNames[i]);
        }
    });
    const pResults = (await Promise.all(pendingPromises)).reduce((acc, r) => {
        acc.push(...r);
        return acc;
    }, []);
    return [...files, ...pResults];
}
exports.default = getProjectFilePaths;
//# sourceMappingURL=getProjectFilePaths.js.map