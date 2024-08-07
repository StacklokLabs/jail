"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Date_1 = require("./Date");
var buffer_1 = require("buffer");
var Policy = /** @class */ (function () {
    function Policy() {
    }
    Policy.getPolicy = function (config) {
        var policy = function () {
            return {
                expiration: Date_1.dateISOString,
                conditions: [
                    { acl: 'public-read' },
                    { bucket: config.bucketName },
                    ['starts-with', '$key', "" + (config.dirName ? config.dirName + '/' : '')],
                    ['starts-with', '$Content-Type', ''],
                    ['starts-with', '$x-amz-meta-tag', ''],
                    { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
                    {
                        'x-amz-credential': config.accessKeyId + "/" + Date_1.dateYMD + "/" + config.region + "/s3/aws4_request",
                    },
                    { 'x-amz-date': Date_1.xAmzDate },
                    { 'x-amz-meta-uuid': '14365123651274' },
                    { 'x-amz-server-side-encryption': 'AES256' },
                ],
            };
        };
        // Returns a base64 policy;
        return buffer_1.Buffer.from(JSON.stringify(policy())).toString('base64').replace(/\n|\r/, '');
    };
    return Policy;
}());
exports.default = Policy;
