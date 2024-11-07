export interface IBounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
export declare type Coords = {
    x: number;
    y: number;
};
/**
 * Returns metaverse coordinates bounds.
 */
export declare function getBounds(): IBounds;
/**
 * Parses a string-based set of coordinates.
 * - All spaces are removed
 * - Leading zeroes are removed
 * - `-0` is converted to `0`
 * @param coordinates An string containing coordinates in the `x,y; x,y; ...` format
 */
export declare function parse(coordinates: string): string[];
/**
 * Returns a promise that resolves `true` if the given set of coordinates is valid.
 * For invalid coordinates, the promise will reject with an error message.
 * *This is meant to be used as an inquirer validator.*
 *
 * Empty inputs will resolve `true`
 * @param answers An string containing coordinates in the `x,y; x,y; ...` format
 */
export declare function validate(answers: string): Promise<boolean>;
/**
 * Returns true if the given coordinate's format is valid
 *
 * ```
 * isValid('0,0') // returns true
 * isValid(', 0') // returns false
 * ```
 * @param val The coodinate string
 */
export declare function isValid(val: string): boolean;
/**
 * Converts a string-based set of coordinates to an object
 * @param coords A string containing a set of coordinates
 */
export declare function getObject(coords: string): Coords;
/**
 * Converts a array-based set of coordinates to an object
 * @param coords An array containing a set of coordinates
 */
export declare function getObject(coords: number[]): Coords;
/**
 * Converts a Coords object to a string-based set of coordinates
 */
export declare function getString({ x, y }: Coords): string;
/**
 * Returns true if the given coordinates are in metaverse bounds
 */
export declare function inBounds(x: number, y: number): boolean;
/**
 * Returns true if the given parcels array are connected
 */
export declare function areConnected(parcels: Coords[]): boolean;
export declare function isEqual(p1: Coords, p2: Coords): boolean;
//# sourceMappingURL=coordinateHelpers.d.ts.map