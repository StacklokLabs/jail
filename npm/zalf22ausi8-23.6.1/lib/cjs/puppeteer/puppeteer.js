"use strict";
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimCache = exports.launch = exports.executablePath = exports.defaultArgs = exports.connect = void 0;
__exportStar(require("puppeteer-core/internal/puppeteer-core.js"), exports);
const PuppeteerCore = __importStar(require("puppeteer-core/internal/puppeteer-core.js"));
const getConfiguration_js_1 = require("./getConfiguration.js");
const configuration = (0, getConfiguration_js_1.getConfiguration)();
/**
 * @public
 */
const puppeteer = new PuppeteerCore.PuppeteerNode({
    isPuppeteerCore: false,
    configuration,
});
/**
 * @public
 */
exports.connect = puppeteer.connect, 
/**
 * @public
 */
exports.defaultArgs = puppeteer.defaultArgs, 
/**
 * @public
 */
exports.executablePath = puppeteer.executablePath, 
/**
 * @public
 */
exports.launch = puppeteer.launch, 
/**
 * @public
 */
exports.trimCache = puppeteer.trimCache;
exports.default = puppeteer;
//# sourceMappingURL=puppeteer.js.map