"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishPendingTracking = exports.Analytics = exports.analytics = void 0;
const uuid_1 = require("uuid");
const analytics_node_1 = __importDefault(require("analytics-node"));
const config_1 = require("../config");
const moduleHelpers_1 = require("./moduleHelpers");
const logging_1 = require("./logging");
const chalk_1 = __importDefault(require("chalk"));
// Setup segment.io
const SINGLEUSER = 'cli-user';
const ANONYMOUS_DATA_QUESTION = 'Send Anonymous data';
function isCI() {
    return process.env.CI === 'true' || process.argv.includes('--ci') || process.argv.includes('--c');
}
function isEditor() {
    return process.env.EDITOR === 'true';
}
var Analytics;
(function (Analytics) {
    Analytics.sceneCreated = (properties) => trackAsync('Scene created', properties);
    Analytics.startPreview = (properties) => trackAsync('Preview started', properties);
    Analytics.sceneStartDeploy = (properties) => trackAsync('Scene deploy started', properties);
    Analytics.sceneDeploySuccess = (properties) => trackAsync('Scene deploy success', properties);
    Analytics.worldAcl = (properties) => trackAsync('World ACL', properties);
    Analytics.buildScene = (properties) => trackAsync('Build scene', properties);
    Analytics.infoCmd = (properties) => trackAsync('Info command', properties);
    Analytics.statusCmd = (properties) => trackAsync('Status command', properties);
    Analytics.sendData = (shareData) => trackAsync(ANONYMOUS_DATA_QUESTION, { shareData });
    Analytics.tryToUseDeprecated = (properties) => trackAsync('Try to use depacreated feature', properties);
    async function identify(devId) {
        exports.analytics.identify({
            userId: SINGLEUSER,
            traits: {
                os: process.platform,
                createdAt: new Date().getTime(),
                isCI: isCI(),
                isEditor: isEditor(),
                devId
            }
        });
    }
    Analytics.identify = identify;
    async function reportError(type, message, stackTrace) {
        return track('Error', {
            errorType: type,
            message,
            stackTrace
        });
    }
    Analytics.reportError = reportError;
    async function requestPermission() {
        const { fileExists, segmentKey } = (0, config_1.getConfig)();
        if (!segmentKey)
            return;
        exports.analytics = new analytics_node_1.default(segmentKey);
        if (!fileExists) {
            console.log(chalk_1.default.dim(`Decentraland CLI sends anonymous usage stats to improve their products, if you want to disable it change the configuration at ${chalk_1.default.bold('~/.dclinfo')}\n`));
            const newUserId = (0, uuid_1.v4)();
            await (0, config_1.createDCLInfo)({ userId: newUserId, trackStats: true });
            (0, logging_1.debug)(`${chalk_1.default.bold('.dclinfo')} file created`);
            await identify(newUserId);
            Analytics.sendData(true);
        }
    }
    Analytics.requestPermission = requestPermission;
})(Analytics = exports.Analytics || (exports.Analytics = {}));
/**
 * Tracks an specific event using the Segment API
 * @param eventName The name of the event to be tracked
 * @param properties Any object containing serializable data
 */
async function track(eventName, properties = {}) {
    const { userId, trackStats } = (0, config_1.getConfig)();
    if (!(await (0, moduleHelpers_1.isOnline)())) {
        return null;
    }
    return new Promise(async (resolve) => {
        const newProperties = Object.assign(Object.assign({}, properties), { os: process.platform, nodeVersion: process.version, cliVersion: (0, moduleHelpers_1.getInstalledCLIVersion)(), isCI: isCI(), isEditor: isEditor(), devId: userId });
        const shouldTrack = trackStats || eventName === ANONYMOUS_DATA_QUESTION;
        if (!shouldTrack) {
            resolve();
        }
        const event = {
            userId: SINGLEUSER,
            event: eventName,
            properties: newProperties
        };
        try {
            exports.analytics.track(event, () => {
                resolve();
            });
        }
        catch (e) {
            resolve();
        }
    });
}
const pendingTracking = [];
function trackAsync(eventName, properties = {}) {
    const pTracking = track(eventName, properties).then().catch(logging_1.debug);
    pendingTracking.push(pTracking);
}
async function finishPendingTracking() {
    return Promise.all(pendingTracking);
}
exports.finishPendingTracking = finishPendingTracking;
//# sourceMappingURL=analytics.js.map