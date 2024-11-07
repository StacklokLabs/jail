"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOutdatedMessage = exports.formatList = exports.formatDictionary = exports.isEmpty = exports.tabulate = exports.warning = exports.error = exports.debug = void 0;
const chalk_1 = __importDefault(require("chalk"));
const env_1 = require("./env");
const _1 = require(".");
function debug(...messages) {
    if ((0, env_1.isDebug)()) {
        console.log(...messages);
    }
}
exports.debug = debug;
function error(message) {
    return `${chalk_1.default.red('Error:')} ${message}`;
}
exports.error = error;
function warning(message) {
    return `${chalk_1.default.yellow('Warning: ')}${message}`;
}
exports.warning = warning;
function tabulate(spaces = 0) {
    return spaces > 0 ? ' '.repeat(spaces) : '';
}
exports.tabulate = tabulate;
function isEmpty(obj) {
    if (!obj)
        return true;
    const keys = Object.keys(obj);
    if (!keys.length) {
        return true;
    }
    return keys.every(($) => obj[$] === undefined || obj[$] === [] || obj[$] === {} || obj[$] === '');
}
exports.isEmpty = isEmpty;
function formatDictionary(obj, options, level = 1, context) {
    let buf = '';
    const keys = obj ? Object.keys(obj) : [];
    keys.forEach((key, i) => {
        const item = obj[key];
        const separator = context === 'array' && i === 0 ? '' : tabulate(options.spacing * level + options.padding);
        if (Array.isArray(item)) {
            buf = buf.concat(separator, `${chalk_1.default.bold(key)}: `, formatList(item, options, level + 1, 'object'), '\n');
        }
        else if ((0, _1.isRecord)(item)) {
            const isHidden = isEmpty(item);
            const content = isHidden
                ? `: ${chalk_1.default.italic('No information available')}\n`
                : `:\n${formatDictionary(item, options, level + 1, 'object')}`;
            buf = buf.concat(separator, `${chalk_1.default.bold(key)}`, content);
        }
        else if (item) {
            buf = buf.concat(separator, `${chalk_1.default.bold(key)}: `, JSON.stringify(item), '\n');
        }
    });
    return buf;
}
exports.formatDictionary = formatDictionary;
function formatList(list, options, level = 1, _context) {
    let buf = '';
    const separator = '\n' + tabulate(options.spacing * level + options.padding) + '- ';
    if (list.length) {
        buf = list.reduce((buf, item, _i) => {
            if (Array.isArray(item)) {
                return buf.concat(separator, formatList(list, options, level + 1, 'array'));
            }
            else if (typeof item === 'object') {
                return buf.concat(separator, formatDictionary(item, options, level + 1, 'array'));
            }
            else if (item !== undefined) {
                return buf.concat(separator, JSON.stringify(item));
            }
            else {
                return buf;
            }
        }, '');
    }
    else {
        buf = chalk_1.default.italic('No information available');
    }
    return buf;
}
exports.formatList = formatList;
function formatOutdatedMessage(arg) {
    return [
        `A package is outdated:`,
        `  ${arg.package}:`,
        `    installed: ${arg.installedVersion}`,
        `    latest: ${arg.latestVersion}`,
        `    to upgrade to the latest version run the command:`,
        `      npm install ${arg.package}@latest`
    ].join('\n');
}
exports.formatOutdatedMessage = formatOutdatedMessage;
//# sourceMappingURL=logging.js.map