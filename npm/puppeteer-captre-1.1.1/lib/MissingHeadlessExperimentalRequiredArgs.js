"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingHeadlessExperimentalRequiredArgs = void 0;
const PuppeteerCaptureViaHeadlessExperimental_1 = require("./PuppeteerCaptureViaHeadlessExperimental");
class MissingHeadlessExperimentalRequiredArgs extends Error {
    constructor() {
        super('Missing one or more of required arguments: ' + PuppeteerCaptureViaHeadlessExperimental_1.PuppeteerCaptureViaHeadlessExperimental.REQUIRED_ARGS.join(', '));
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.MissingHeadlessExperimentalRequiredArgs = MissingHeadlessExperimentalRequiredArgs;
