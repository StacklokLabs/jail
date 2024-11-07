"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
function pathsExistOnDir(dir, filepaths) {
    return Promise.all(filepaths.map((f) => fs_extra_1.default.pathExists(path_1.default.resolve(dir, f))));
}
exports.default = pathsExistOnDir;
//# sourceMappingURL=pathsExistOnDir.js.map