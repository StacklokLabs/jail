export declare const SCENE_FILE = "scene.json";
export declare const PACKAGE_FILE = "package.json";
export declare const GITIGNORE_FILE = "gitignore";
export declare const NPMRC_FILE = "npmrc";
export declare const ESTLINTRC_FILE = "eslintrc.json";
export declare const ASSET_JSON_FILE = "asset.json";
export declare const WEARABLE_JSON_FILE = "wearable.json";
export declare const DCLIGNORE_FILE = ".dclignore";
/**
 * Composes the path to the `scene.json` file based on the provided path.
 * @param dir The path to the directory containing the scene file.
 */
export declare function getSceneFilePath(dir: string): string;
/**
 * Composes the path to the `package.json` file based on the provided path.
 * @param dir The path to the directory containing the package.json file.
 */
export declare function getPackageFilePath(dir: string): string;
/**
 * Composes the path to the `.dclignore` file based on the provided path.
 * @param dir The path to the directory containing the .dclignore file.
 */
export declare function getIgnoreFilePath(dir: string): string;
/**
 * Returns the path to the node_modules directory.
 * @param dir The path to the directory containing the node_modules directory.
 */
export declare function getNodeModulesPath(dir: string): string;
//# sourceMappingURL=project.d.ts.map