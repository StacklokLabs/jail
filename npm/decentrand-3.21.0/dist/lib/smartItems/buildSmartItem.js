"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSmartItem = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const buildProject_1 = __importDefault(require("../../utils/buildProject"));
async function buildSmartItem(workingDir) {
    const gamePath = path_1.default.resolve(workingDir, 'src', 'game.ts');
    const gameFile = await fs_extra_1.default.readFile(gamePath, 'utf-8');
    await fs_extra_1.default.writeFile(gamePath, gameFile.replace(/\n/g, '\n//'), 'utf-8');
    await (0, buildProject_1.default)(workingDir);
    return fs_extra_1.default.writeFile(gamePath, gameFile, 'utf-8');
}
exports.buildSmartItem = buildSmartItem;
//# sourceMappingURL=buildSmartItem.js.map