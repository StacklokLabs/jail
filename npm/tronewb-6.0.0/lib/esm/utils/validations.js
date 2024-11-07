import { BigNumber } from 'bignumber.js';
import validator from 'validator';
import { ADDRESS_PREFIX } from './address.js';
export function isValidURL(url) {
    if (typeof url !== 'string')
        return false;
    return validator.isURL(url.toString(), {
        protocols: ['http', 'https'],
        require_tld: false,
    });
}
export function isObject(obj) {
    return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
}
export function isArray(array) {
    return Array.isArray(array);
}
export function isJson(string) {
    try {
        return !!JSON.parse(string);
    }
    catch (ex) {
        return false;
    }
}
export function isBoolean(bool) {
    return typeof bool === 'boolean';
}
export function isBigNumber(number) {
    return !!number && (number instanceof BigNumber || (number.constructor && number.constructor.name === 'BigNumber'));
}
export function isString(string) {
    return typeof string === 'string' || (!!string && string.constructor && string.constructor.name === 'String');
}
export function isFunction(obj) {
    return typeof obj === 'function';
}
export function isHex(string) {
    return typeof string === 'string' && !isNaN(parseInt(string, 16)) && /^(0x|)[a-fA-F0-9]+$/.test(string);
}
export function isInteger(number) {
    if (number === null)
        return false;
    return Number.isInteger(Number(number));
}
export function hasProperty(obj, property) {
    return Object.prototype.hasOwnProperty.call(obj, property);
}
export function hasProperties(obj, ...properties) {
    return (properties.length &&
        !properties
            .map((property) => {
            return hasProperty(obj, property);
        })
            .includes(false));
}
export function mapEvent(event) {
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
export function parseEvent(event, { inputs: abi }) {
    if (!event.result)
        return event;
    if (isObject(event.result)) {
        for (let i = 0; i < abi.length; i++) {
            const obj = abi[i];
            if (obj.type == 'address' && obj.name in event.result)
                event.result[obj.name] = ADDRESS_PREFIX + event.result[obj.name].substr(2).toLowerCase();
        }
    }
    else if (isArray(event.result)) {
        event.result = event.result.reduce((obj, result, index) => {
            const { name, type } = abi[index];
            if (type == 'address')
                result = ADDRESS_PREFIX + result.substr(2).toLowerCase();
            obj[name] = result;
            return obj;
        }, {});
    }
    return event;
}
export function padLeft(input, padding, amount) {
    let res = input.toString();
    while (res.length < amount)
        res = padding + res;
    return res;
}
export function isNotNullOrUndefined(val) {
    return val !== null && typeof val !== 'undefined';
}
export async function sleep(millis = 1000) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}
//# sourceMappingURL=validations.js.map