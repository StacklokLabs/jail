#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const main_1 = require("./main");
fs_1.default.readFile(path_1.default.resolve(__dirname, '../package.json'), 'utf8', (err, data) => {
    if (err) {
        console.error('There was an unexpected error.', err);
        process.exit(1);
    }
    const { version } = JSON.parse(data);
    (0, main_1.main)(version).catch((err) => {
        console.error(err);
        process.exit(1);
    });
});
//# sourceMappingURL=index.js.map