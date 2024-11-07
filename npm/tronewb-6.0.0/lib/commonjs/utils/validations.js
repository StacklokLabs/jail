"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidURL = isValidURL;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isJson = isJson;
exports.isBoolean = isBoolean;
exports.isBigNumber = isBigNumber;
exports.isString = isString;
exports.isFunction = isFunction;
exports.isHex = isHex;
exports.isInteger = isInteger;
exports.hasProperty = hasProperty;
exports.hasProperties = hasProperties;
exports.mapEvent = mapEvent;
exports.parseEvent = parseEvent;
exports.padLeft = padLeft;
exports.isNotNullOrUndefined = isNotNullOrUndefined;
exports.sleep = sleep;
const tslib_1 = require("tslib");
const bignumber_js_1 = require("bignumber.js");
const validator_1 = tslib_1.__importDefault(require("validator"));
const address_js_1 = require("./address.js");
function isValidURL(url) {
    if (typeof url !== 'string')
        return false;
    return validator_1.default.isURL(url.toString(), {
        protocols: ['http', 'https'],
        require_tld: false,
    });
}
function isObject(obj) {
    return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
}
function isArray(array) {
    return Array.isArray(array);
}
function isJson(string) {
    try {
        return !!JSON.parse(string);
    }
    catch (ex) {
        return false;
    }
}
function isBoolean(bool) {
    return typeof bool === 'boolean';
}
function isBigNumber(number) {
    return !!number && (number instanceof bignumber_js_1.BigNumber || (number.constructor && number.constructor.name === 'BigNumber'));
}
function isString(string) {
    return typeof string === 'string' || (!!string && string.constructor && string.constructor.name === 'String');
}
function isFunction(obj) {
    return typeof obj === 'function';
}
function isHex(string) {
    return typeof string === 'string' && !isNaN(parseInt(string, 16)) && /^(0x|)[a-fA-F0-9]+$/.test(string);
}
function isInteger(number) {
    if (number === null)
        return false;
    return Number.isInteger(Number(number));
}
function hasProperty(obj, property) {
    return Object.prototype.hasOwnProperty.call(obj, property);
}
function hasProperties(obj, ...properties) {
    return (properties.length &&
        !properties
            .map((property) => {
            return hasProperty(obj, property);
        })
            .includes(false));
}
function mapEvent(event) {
    const data = {
        block: event.block_number,
        timestamp: event.block_timestamp,
        contract: event.contract_address,
        name: event.event_name,
        transaction: event.transaction_id,
        result: event.result,
        resourceNode: event.resource_Node || (event._unconfirmed ? 'fullNode' : 'solidityNode'),
    };
    if (event._unconfirmed) {
        data.unconfirmed = event._unconfirmed;
    }
    if (event._fingerprint) {
        data.fingerprint = event._fingerprint;
    }
    return data;
}
function parseEvent(event, { inputs: abi }) {
    if (!event.result)
        return event;
    if (isObject(event.result)) {
        for (let i = 0; i < abi.length; i++) {
            const obj = abi[i];
            if (obj.type == 'address' && obj.name in event.result)
                event.result[obj.name] = address_js_1.ADDRESS_PREFIX + event.result[obj.name].substr(2).toLowerCase();
        }
    }
    else if (isArray(event.result)) {
        event.result = event.result.reduce((obj, result, index) => {
            const { name, type } = abi[index];
            if (type == 'address')
                result = address_js_1.ADDRESS_PREFIX + result.substr(2).toLowerCase();
            obj[name] = result;
            return obj;
        }, {});
    }
    return event;
}
function padLeft(input, padding, amount) {
    let res = input.toString();
    while (res.length < amount)
        res = padding + res;
    return res;
}
function isNotNullOrUndefined(val) {
    return val !== null && typeof val !== 'undefined';
}
async function sleep(millis = 1000) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}
//# sourceMappingURL=validations.js.map