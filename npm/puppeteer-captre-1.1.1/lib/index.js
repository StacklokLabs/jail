"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerCaptureViaHeadlessExperimental = exports.PuppeteerCaptureFormat = exports.PuppeteerCaptureBase = exports.MissingRequiredArgs = exports.launch = exports.capture = void 0;
var capture_1 = require("./capture");
Object.defineProperty(exports, "capture", { enumerable: true, get: function () { return capture_1.capture; } });
var launch_1 = require("./launch");
Object.defineProperty(exports, "launch", { enumerable: true, get: function () { return launch_1.launch; } });
var MissingHeadlessExperimentalRequiredArgs_1 = require("./MissingHeadlessExperimentalRequiredArgs");
Object.defineProperty(exports, "MissingRequiredArgs", { enumerable: true, get: function () { return MissingHeadlessExperimentalRequiredArgs_1.MissingHeadlessExperimentalRequiredArgs; } });
var PuppeteerCaptureBase_1 = require("./PuppeteerCaptureBase");
Object.defineProperty(exports, "PuppeteerCaptureBase", { enumerable: true, get: function () { return PuppeteerCaptureBase_1.PuppeteerCaptureBase; } });
exports.PuppeteerCaptureFormat = __importStar(require("./PuppeteerCaptureFormat"));
var PuppeteerCaptureViaHeadlessExperimental_1 = require("./PuppeteerCaptureViaHeadlessExperimental");
Object.defineProperty(exports, "PuppeteerCaptureViaHeadlessExperimental", { enumerable: true, get: function () { return PuppeteerCaptureViaHeadlessExperimental_1.PuppeteerCaptureViaHeadlessExperimental; } });
