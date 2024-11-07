import { isAddress, toHex } from '../utils/address.js';
import { isNotNullOrUndefined, isInteger, isString, isObject, isValidURL, isHex, isBoolean } from '../utils/validations.js';
export class Validator {
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
            if (optional && (!isNotNullOrUndefined(value) || (type !== 'boolean' && value === false)))
                continue;
            normalized[name] = param.value;
            switch (type) {
                case 'address':
                    if (!isAddress(value)) {
                        no = true;
                    }
                    else {
                        normalized[name] = toHex(value);
                    }
                    break;
                case 'integer':
                    if (!isInteger(value) ||
                        (typeof gt === 'number' && value <= gt) ||
                        (typeof lt === 'number' && value >= lt) ||
                        (typeof gte === 'number' && value < gte) ||
                        (typeof lte === 'number' && value > lte)) {
                        no = true;
                    }
                    break;
                case 'positive-integer':
                    if (!isInteger(value) || value <= 0) {
                        throw new Error(this.notPositive(param));
                    }
                    break;
                case 'tokenId':
                    if (!isString(value) || !value.length) {
                        no = true;
                    }
                    break;
                case 'notEmptyObject':
                    if (!isObject(value) || !Object.keys(value).length) {
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
                    if (!isValidURL(value)) {
                        no = true;
                    }
                    break;
                case 'hex':
                    if (!isHex(value)) {
                        no = true;
                    }
                    break;
                case 'array':
                    if (!Array.isArray(value)) {
                        no = true;
                    }
                    break;
                case 'not-empty-string':
                    if (!isString(value) || !value.length) {
                        no = true;
                    }
                    break;
                case 'boolean':
                    if (!isBoolean(value)) {
                        no = true;
                    }
                    break;
                case 'string':
                    if (!isString(value) ||
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
//# sourceMappingURL=index.js.map