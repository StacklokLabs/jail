"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEqual = exports.areConnected = exports.inBounds = exports.getString = exports.getObject = exports.isValid = exports.validate = exports.parse = exports.getBounds = void 0;
/**
 * Returns metaverse coordinates bounds.
 */
function getBounds() {
    return {
        minX: -150,
        minY: -150,
        maxX: 165,
        maxY: 165
    };
}
exports.getBounds = getBounds;
/**
 * Parses a string-based set of coordinates.
 * - All spaces are removed
 * - Leading zeroes are removed
 * - `-0` is converted to `0`
 * @param coordinates An string containing coordinates in the `x,y; x,y; ...` format
 */
function parse(coordinates) {
    return coordinates.split(';').map((coord) => {
        const [x = 0, y = 0] = coord.split(',').map(($) => {
            return parseInt($, 10)
                .toString() // removes spaces :)
                .replace('-0', '0')
                .replace(/undefined|NaN/g, '0');
        });
        return `${x},${y}`;
    });
}
exports.parse = parse;
/**
 * Returns a promise that resolves `true` if the given set of coordinates is valid.
 * For invalid coordinates, the promise will reject with an error message.
 * *This is meant to be used as an inquirer validator.*
 *
 * Empty inputs will resolve `true`
 * @param answers An string containing coordinates in the `x,y; x,y; ...` format
 */
function validate(answers) {
    return new Promise((resolve, reject) => {
        if (answers.trim().length === 0) {
            resolve(true);
        }
        else {
            answers.split(/;\s/g).forEach((answer) => {
                if (!isValid(answer)) {
                    reject(new Error(`Invalid coordinate ${answer}`));
                }
            });
            resolve(true);
        }
    });
}
exports.validate = validate;
/**
 * Returns true if the given coordinate's format is valid
 *
 * ```
 * isValid('0,0') // returns true
 * isValid(', 0') // returns false
 * ```
 * @param val The coodinate string
 */
function isValid(val) {
    if (!val.match(/^(-?\d)+\,(-?\d)+$/g)) {
        return false;
    }
    return true;
}
exports.isValid = isValid;
function getObject(coords) {
    const [x, y] = typeof coords === 'string' ? parse(coords)[0].split(',') : coords;
    return { x: parseInt(x.toString(), 10), y: parseInt(y.toString(), 10) };
}
exports.getObject = getObject;
/**
 * Converts a Coords object to a string-based set of coordinates
 */
function getString({ x, y }) {
    return `${x},${y}`;
}
exports.getString = getString;
/**
 * Returns true if the given coordinates are in metaverse bounds
 */
function inBounds(x, y) {
    const { minX, minY, maxX, maxY } = getBounds();
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
}
exports.inBounds = inBounds;
/**
 * Returns true if the given parcels array are connected
 */
function areConnected(parcels) {
    if (parcels.length === 0) {
        return false;
    }
    const visited = visitParcel(parcels[0], parcels);
    return visited.length === parcels.length;
}
exports.areConnected = areConnected;
function visitParcel(parcel, allParcels = [parcel], visited = []) {
    const isVisited = visited.some((visitedParcel) => isEqual(visitedParcel, parcel));
    if (!isVisited) {
        visited.push(parcel);
        const neighbours = getNeighbours(parcel.x, parcel.y, allParcels);
        neighbours.forEach((neighbours) => visitParcel(neighbours, allParcels, visited));
    }
    return visited;
}
function getIsNeighbourMatcher(x, y) {
    return (coords) => (coords.x === x && (coords.y + 1 === y || coords.y - 1 === y)) ||
        (coords.y === y && (coords.x + 1 === x || coords.x - 1 === x));
}
function getNeighbours(x, y, parcels) {
    return parcels.filter(getIsNeighbourMatcher(x, y));
}
function isEqual(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}
exports.isEqual = isEqual;
//# sourceMappingURL=coordinateHelpers.js.map