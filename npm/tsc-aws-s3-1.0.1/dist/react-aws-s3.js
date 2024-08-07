"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var short_uuid_1 = __importDefault(require("short-uuid"));
var Date_1 = require("./Date");
var ErrorThrower_1 = require("./ErrorThrower");
var Url_1 = __importDefault(require("./Url"));
var Policy_1 = __importDefault(require("./Policy"));
var Signature_1 = __importDefault(require("./Signature"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var ReactS3Client = /** @class */ (function () {
    function ReactS3Client(config) {
        this.config = config;
    }
    ReactS3Client.prototype.uploadFile = function (file, newFileName) {
        return __awaiter(this, void 0, void 0, function () {
            var fileExtension, fd, fileName, dirName, key, url, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, ErrorThrower_1.throwUploadError)(this.config, file);
                        fileExtension = '';
                        fd = new FormData();
                        if (file.name) {
                            fileExtension = file.name.split('.').pop() || '';
                        }
                        if (!fileExtension && file.type != null) {
                            fileExtension = file.type.split('/').pop() || '';
                        }
                        fileName = "" + (newFileName || short_uuid_1.default.generate()) + (fileExtension && '.' + fileExtension);
                        dirName = (this.config.dirName ? this.config.dirName + '/' : '').replace(/([^:]\/)\/+/g, '$1');
                        key = "" + dirName + fileName;
                        url = (0, Url_1.default)(this.config);
                        fd.append('key', key);
                        fd.append('acl', 'public-read');
                        fd.append('Content-Type', file.type);
                        fd.append('x-amz-meta-uuid', '14365123651274');
                        fd.append('x-amz-server-side-encryption', 'AES256');
                        fd.append('X-Amz-Credential', this.config.accessKeyId + "/" + Date_1.dateYMD + "/" + this.config.region + "/s3/aws4_request");
                        fd.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
                        fd.append('X-Amz-Date', Date_1.xAmzDate);
                        fd.append('x-amz-meta-tag', '');
                        fd.append('Policy', Policy_1.default.getPolicy(this.config));
                        fd.append('X-Amz-Signature', Signature_1.default.getSignature(this.config, Date_1.dateYMD, Policy_1.default.getPolicy(this.config)));
                        fd.append('file', file);
                        return [4 /*yield*/, fetch(url, { method: 'post', body: fd })];
                    case 1:
                        data = _a.sent();
                        if (!data.ok)
                            return [2 /*return*/, Promise.reject(data)];
                        return [2 /*return*/, Promise.resolve({
                                bucket: this.config.bucketName,
                                key: key,
                                location: url + "/" + key,
                                status: data.status,
                            })];
                }
            });
        });
    };
    ReactS3Client.prototype.deleteFile = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var awsConfig, s3;
            return __generator(this, function (_a) {
                awsConfig = (function (_a) {
                    var region = _a.region, accessKeyId = _a.accessKeyId, secretAccessKey = _a.secretAccessKey;
                    return ({ region: region, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey });
                })(this.config);
                aws_sdk_1.default.config.update(awsConfig);
                s3 = new aws_sdk_1.default.S3({
                    apiVersion: '2006-03-01',
                    params: {
                        Bucket: this.config.bucketName,
                    },
                });
                s3.deleteObject({
                    Bucket: this.config.bucketName,
                    Key: key,
                }, function (err, data) {
                    if (err)
                        return Promise.reject(err);
                    return Promise.resolve({
                        message: 'File deleted',
                        key: key,
                        data: data,
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    ReactS3Client.prototype.listFiles = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var awsConfig, s3, url, req, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        awsConfig = (function (_a) {
                            var region = _a.region, accessKeyId = _a.accessKeyId, secretAccessKey = _a.secretAccessKey;
                            return ({ region: region, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey });
                        })(this.config);
                        aws_sdk_1.default.config.update(awsConfig);
                        s3 = new aws_sdk_1.default.S3({
                            apiVersion: '2006-03-01',
                            params: {
                                Bucket: this.config.bucketName,
                            },
                        });
                        url = (0, Url_1.default)(this.config);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, s3
                                .listObjects({
                                Bucket: this.config.bucketName,
                            })
                                .promise()];
                    case 2:
                        req = _b.sent();
                        if (req.$response.error) {
                            return [2 /*return*/, Promise.reject({
                                    err: req.$response.error.name,
                                    errMessage: req.$response.error.message,
                                    data: req.$response.error,
                                })];
                        }
                        if (!req.$response.data) {
                            return [2 /*return*/, Promise.reject({
                                    err: 'Something went wrong!',
                                    errMessage: 'Unknown error occured. Please try again',
                                    data: null,
                                })];
                        }
                        return [2 /*return*/, Promise.resolve({
                                message: 'Objects listed succesfully',
                                data: __assign(__assign({}, req.$response.data), { Contents: (_a = req.$response.data.Contents) === null || _a === void 0 ? void 0 : _a.map(function (e) { return (__assign(__assign({}, e), { publicUrl: url + "/" + e.Key })); }) }),
                            })];
                    case 3:
                        err_1 = _b.sent();
                        return [2 /*return*/, Promise.reject({
                                err: 'Something went wrong!',
                                errMessage: 'Unknown error occured. Please try again',
                                data: err_1,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ReactS3Client;
}());
exports.default = ReactS3Client;
