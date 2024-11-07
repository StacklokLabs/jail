"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["INIT_ERROR"] = "InitError";
    ErrorType["LINKER_ERROR"] = "LinkerError";
    ErrorType["ETHEREUM_ERROR"] = "EthereumError";
    ErrorType["PROJECT_ERROR"] = "ProjectError";
    ErrorType["PREVIEW_ERROR"] = "PreviewError";
    ErrorType["UPGRADE_ERROR"] = "UpgradeError";
    ErrorType["INFO_ERROR"] = "InfoError";
    ErrorType["STATUS_ERROR"] = "StatusError";
    ErrorType["DEPLOY_ERROR"] = "DeployError";
    ErrorType["API_ERROR"] = "APIError";
    ErrorType["UPLOAD_ERROR"] = "UploadError";
    ErrorType["CONTENT_SERVER_ERROR"] = "ContentServerError";
    ErrorType["WORLD_CONTENT_SERVER_ERROR"] = "WorldContentServerError";
    ErrorType["WORKSPACE_ERROR"] = "WorkspaceError";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
function fail(type, message) {
    const e = new Error(message);
    e.name = type;
    throw e;
}
exports.fail = fail;
//# sourceMappingURL=errors.js.map