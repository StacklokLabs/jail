"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.launch = void 0;
const PuppeteerCaptureViaHeadlessExperimental_1 = require("./PuppeteerCaptureViaHeadlessExperimental");
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const puppeteer = require(`puppeteer${(_a = process.env.PUPPETEER_CAPTURE__PUPPETEER_VERSION) !== null && _a !== void 0 ? _a : ''}`);
function launch(options) {
    return __awaiter(this, void 0, void 0, function* () {
        options = Object.assign(Object.assign({}, (options != null ? options : {})), { args: [
                ...((options === null || options === void 0 ? void 0 : options.args) != null ? options === null || options === void 0 ? void 0 : options.args : []),
                ...PuppeteerCaptureViaHeadlessExperimental_1.PuppeteerCaptureViaHeadlessExperimental.REQUIRED_ARGS
            ] });
        return yield puppeteer.launch(options);
    });
}
exports.launch = launch;
