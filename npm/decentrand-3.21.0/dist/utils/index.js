"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRecord = exports.removeEmptyKeys = exports.createEmptyObj = exports.getOrElse = void 0;
function getOrElse(value, def) {
    return value !== undefined ? value : def;
}
exports.getOrElse = getOrElse;
/**
 * Returns an object with the specified attributes with null as value
 */
function createEmptyObj(attributes, obj = {}) {
    attributes.forEach((attr) => {
        obj[attr] = null;
    });
    return obj;
}
exports.createEmptyObj = createEmptyObj;
/**
 * Filter undefined keys from provided object
 */
function removeEmptyKeys(obj) {
    const result = {};
    Object.keys(obj)
        .filter((k) => !!obj[k])
        .forEach((k) => (result[k] = obj[k]));
    return result;
}
exports.removeEmptyKeys = removeEmptyKeys;
function isRecord(obj) {
    return typeof obj === 'object' && !Array.isArray(obj) && !!obj;
}
exports.isRecord = isRecord;
//# sourceMappingURL=index.js.map