"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const address_js_1 = require("../utils/address.js");
const validations_js_1 = require("../utils/validations.js");
class Validator {
    invalid(param) {
        return param.msg || `Invalid ${param.name}${param.type === 'address' ? ' address' : ''} provided`;
    }
    notPositive(param) {
        return `${param.name} must be a positive integer`;
    }
    notEqual(param) {
        return param.msg || `${param.names?.[0]} can not be equal to ${param.names?.[1]}`;
    }
    notValid(params) {
        const normalized = {};
        let no = false;
        for (const param of params) {
            const { name, names, value, type, gt, lt, gte, lte, optional } = param;
            if (optional && (!(0, validations_js_1.isNotNullOrUndefined)(value) || (type !== 'boolean' && value === false)))
                continue;
            normalized[name] = param.value;
            switch (type) {
                case 'address':
                    if (!(0, address_js_1.isAddress)(value)) {
                        no = true;
                    }
                    else {
                        normalized[name] = (0, address_js_1.toHex)(value);
                    }
                    break;
                case 'integer':
                    if (!(0, validations_js_1.isInteger)(value) ||
                        (typeof gt === 'number' && value <= gt) ||
                        (typeof lt === 'number' && value >= lt) ||
                        (typeof gte === 'number' && value < gte) ||
                        (typeof lte === 'number' && value > lte)) {
                        no = true;
                    }
                    break;
                case 'positive-integer':
                    if (!(0, validations_js_1.isInteger)(value) || value <= 0) {
                        throw new Error(this.notPositive(param));
                    }
                    break;
                case 'tokenId':
                    if (!(0, validations_js_1.isString)(value) || !value.length) {
                        no = true;
                    }
                    break;
                case 'notEmptyObject':
                    if (!(0, validations_js_1.isObject)(value) || !Object.keys(value).length) {
                        no = true;
                    }
                    break;
                case 'notEqual':
                    if (names && normalized[names[0]] === normalized[names[1]]) {
                        throw new Error(this.notEqual(param));
                    }
                    break;
                case 'resource':
                    if (!['BANDWIDTH', 'ENERGY'].includes(value)) {
                        no = true;
                    }
                    break;
                case 'url':
                    if (!(0, validations_js_1.isValidURL)(value)) {
                        no = true;
                    }
                    break;
                case 'hex':
                    if (!(0, validations_js_1.isHex)(value)) {
                        no = true;
                    }
                    break;
                case 'array':
                    if (!Array.isArray(value)) {
                        no = true;
                    }
                    break;
                case 'not-empty-string':
                    if (!(0, validations_js_1.isString)(value) || !value.length) {
                        no = true;
                    }
                    break;
                case 'boolean':
                    if (!(0, validations_js_1.isBoolean)(value)) {
                        no = true;
                    }
                    break;
                case 'string':
                    if (!(0, validations_js_1.isString)(value) ||
                        (typeof gt === 'number' && value.length <= gt) ||
                        (typeof lt === 'number' && value.length >= lt) ||
                        (typeof gte === 'number' && value.length < gte) ||
                        (typeof lte === 'number' && value.length > lte)) {
                        no = true;
                    }
                    break;
            }
            if (no) {
                throw new Error(this.invalid(param));
            }
        }
        return false;
    }
}
exports.Validator = Validator;
//# sourceMappingURL=index.js.map