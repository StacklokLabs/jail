"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.args = void 0;
const arg_1 = __importDefault(require("arg"));
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("./utils");
exports.args = (0, arg_1.default)({
    '--help': Boolean,
    '--project': String,
    '--template': String,
    '--skip-install': Boolean,
    '-h': '--help',
    '-p': '--project',
    '-t': '--template'
});
const help = () => `
  Usage: ${chalk_1.default.bold('dcl init [options]')}

    ${chalk_1.default.dim('Options:')}

    -h, --help               Displays complete help
    -p, --project [type] Choose a projectType (default is scene). It could be any of ${chalk_1.default.bold((0, utils_1.getProjectTypes)())}
      
      ${chalk_1.default.dim('Examples:')}
      
      - Generate a new Decentraland Scene project in my-project folder
      
      ${chalk_1.default.green('$ dcl init my-project')}
      
      - Generate a new scene project
      
      ${chalk_1.default.green('$ dcl init --project scene')}

    --skip-install       Skip installing dependencies
    --template           The URL to a template. It must be under the decentraland or decentraland-scenes GitHub organization.
`;
exports.help = help;
//# sourceMappingURL=help.js.map