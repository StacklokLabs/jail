export declare enum ErrorType {
    INIT_ERROR = "InitError",
    LINKER_ERROR = "LinkerError",
    ETHEREUM_ERROR = "EthereumError",
    PROJECT_ERROR = "ProjectError",
    PREVIEW_ERROR = "PreviewError",
    UPGRADE_ERROR = "UpgradeError",
    INFO_ERROR = "InfoError",
    STATUS_ERROR = "StatusError",
    DEPLOY_ERROR = "DeployError",
    API_ERROR = "APIError",
    UPLOAD_ERROR = "UploadError",
    CONTENT_SERVER_ERROR = "ContentServerError",
    WORLD_CONTENT_SERVER_ERROR = "WorldContentServerError",
    WORKSPACE_ERROR = "WorkspaceError"
}
export declare function fail(type: ErrorType, message: string): void;
//# sourceMappingURL=errors.d.ts.map