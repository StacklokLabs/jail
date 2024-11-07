"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packProject = void 0;
const fs_1 = __importDefault(require("fs"));
const archiver_1 = __importDefault(require("archiver"));
async function packProject(files, target) {
    const output = fs_1.default.createWriteStream(target);
    const archive = (0, archiver_1.default)('zip');
    return new Promise((resolve, reject) => {
        output.on('close', () => {
            resolve();
        });
        archive.on('warning', (err) => {
            reject(err);
        });
        archive.on('error', (err) => {
            reject(err);
        });
        archive.pipe(output);
        const targetFiles = files.filter((f) => f !== '');
        targetFiles.forEach((f) => {
            archive.file(f, { name: f });
        });
        return archive.finalize();
    });
}
exports.packProject = packProject;
//# sourceMappingURL=packProject.js.map