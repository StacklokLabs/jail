"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypescriptProject = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
async function isTypescriptProject(projectPath) {
    const tsconfigPath = path_1.default.resolve(projectPath, 'tsconfig.json');
    return fs_extra_1.default.pathExists(tsconfigPath);
}
exports.isTypescriptProject = isTypescriptProject;
//# sourceMappingURL=isTypescriptProject.js.map