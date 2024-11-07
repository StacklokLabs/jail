"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.help = void 0;
const chalk_1 = __importDefault(require("chalk"));
const analytics_1 = require("../utils/analytics");
const help = () => `
${chalk_1.default.bold('dcl export')} was deprecated in 3.10.0 version of the Decentraland CLI.
`;
exports.help = help;
async function main() {
    const link = 'https://docs.decentraland.org/development-guide/deploy-to-now/';
    console.warn(`\`dcl export\` is not being supported in this CLI version. Please visit ${link} to more information`);
    analytics_1.Analytics.tryToUseDeprecated({ command: 'export' });
    return 1;
}
exports.main = main;
//# sourceMappingURL=export.js.map