/**
 * Checks if a folder exists and creates it if necessary.
 * @param path One or multiple paths to be checked.
 */
export declare function ensureFolder(path: string | Array<string>): Promise<void>;
/**
 * Merges the provided content with a json file
 * @param path The path to the subject json file
 * @param content The content to be applied (as a plain object)
 */
export declare function writeJSON(path: string, content: any): Promise<void>;
/**
 * Reads a file and parses it's JSON content
 * @param path The path to the subject json file
 */
export declare function readJSON<T>(path: string): Promise<T>;
/**
 * Reads a file and parses it's JSON content
 * @param path The path to the subject json file
 */
export declare function readJSONSync<T>(path: string): T;
/**
 * Returns true if the directory is empty
 */
export declare function isEmptyDirectory(dir?: string): Promise<boolean>;
/**
 * Returns th name of the Home directory in a platform-independent way.
 * @returns `USERPROFILE` or `HOME`
 */
export declare function getUserHome(): string;
export declare type PackageJson<T = Record<string, unknown>> = {
    name: string;
    version: string;
    main?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    bundledDependencies?: string[];
    bundleDependencies?: string[];
} & T;
//# sourceMappingURL=filesystem.d.ts.map