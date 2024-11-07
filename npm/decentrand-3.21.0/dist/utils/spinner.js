"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.succeed = exports.info = exports.warn = exports.fail = exports.create = void 0;
const ora_1 = __importDefault(require("ora"));
let spinner = null;
function create(message) {
    if (!process.stdout.isTTY && process.env.DEBUG) {
        return console.log(message);
    }
    if (spinner) {
        spinner.succeed();
    }
    spinner = (0, ora_1.default)(message).start();
}
exports.create = create;
function fail(message) {
    if (!process.stdout.isTTY && process.env.DEBUG && message) {
        return console.log(message);
    }
    if (spinner) {
        spinner.fail(message);
    }
}
exports.fail = fail;
function warn(message) {
    if (!process.stdout.isTTY && process.env.DEBUG && message) {
        return console.log(message);
    }
    if (spinner) {
        spinner.warn(message);
        spinner = null;
    }
}
exports.warn = warn;
function info(message) {
    if (!process.stdout.isTTY && process.env.DEBUG && message) {
        return console.log(message);
    }
    if (spinner) {
        spinner.info(message);
        spinner = null;
    }
}
exports.info = info;
function succeed(message) {
    if (!process.stdout.isTTY && process.env.DEBUG && message) {
        return console.log(message);
    }
    if (spinner) {
        spinner.succeed(message);
        spinner = null;
    }
}
exports.succeed = succeed;
//# sourceMappingURL=spinner.js.map