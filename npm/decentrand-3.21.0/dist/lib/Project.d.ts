/// <reference types="node" />
import { Scene } from '@dcl/schemas';
import { Coords } from '../utils/coordinateHelpers';
import { ProjectInfo } from '../project/projectInfo';
import { LinkerResponse } from './LinkerAPI';
export interface IFile {
    path: string;
    content: Buffer;
    size: number;
}
declare type DeployInfo = {
    linkerResponse?: LinkerResponse;
    status?: 'deploying' | 'success';
};
export declare type ECSVersion = 'ecs6' | 'ecs7' | 'unknown';
export declare class Project {
    private static MAX_FILE_SIZE_BYTES;
    private projectWorkingDir;
    private sceneFile;
    private projectInfo;
    private files;
    private deployInfo;
    constructor(projectWorkingDir: string);
    getEcsVersion(): ECSVersion;
    getEcsPackageVersion(): Promise<{
        ecsVersion: "unknown";
        packageVersion: string;
    } | {
        ecsVersion: "ecs6" | "ecs7";
        packageVersion: string;
    }>;
    setDeployInfo(value: Partial<DeployInfo>): void;
    getDeployInfo(): DeployInfo;
    getProjectWorkingDir(): string;
    getInfo(): ProjectInfo;
    /**
     * Returns `true` if the provided path contains a scene file
     */
    sceneFileExists(): Promise<boolean>;
    /**
     * Returns `true` if the project working directory is empty of files
     */
    isProjectDirEmpty(): Promise<boolean>;
    /**
     * Returns an object containing the contents of the `scene.json` file.
     */
    getSceneFile(): Promise<Scene>;
    /**
     * Returns true if the project contains a package.json file and an empty node_modules folder
     */
    needsDependencies(): Promise<boolean>;
    /**
     * Returns true if te project root contains a `tsconfig.json` file
     * @param dir
     */
    isTypescriptProject(): Promise<boolean>;
    /**
     * Writes the provided websocket server to the `scene.json` file
     * @param server The url to a websocket server
     */
    scaffoldWebsockets(server: string): Promise<void>;
    /**
     * Creates a new `scene.json` file
     * @param path The path to the directory where the file will be written.
     */
    writeSceneFile(content: Partial<Scene>): Promise<void>;
    /**
     * Copies the contents of a specific sample into the project (for scaffolding purposes).
     * Merges `scene.json` and `package.json` files
     * @param project The name of the sample folder (used as an indentifier).
     * @param destination The path to the project root. By default the current woxsrking directory.
     */
    copySample(project: string): Promise<void>;
    /**
     * Returns a promise of an object containing the base X and Y coordinates for a parcel.
     */
    getParcelCoordinates(): Promise<Coords>;
    /**
     * Returns a promise of an array of the parcels of the scene
     */
    getParcels(): Promise<Coords[]>;
    /**
     * Returns a promise of the owner address
     */
    getOwner(): Promise<string>;
    /**
     * Fails the execution if one of the parcel data is invalid
     */
    validateSceneOptions(): Promise<void>;
    /**
     * Writes the `.dclignore` file to the provided directory path.
     * @param dir The target path where the file will be
     */
    writeDclIgnore(): Promise<string>;
    /**
     * Validates all the conditions required to operate over an existing project.
     * Throws if a project contains an invalid main path or if the `scene.json` file is missing.
     */
    validateExistingProject(): Promise<void>;
    /**
     * Returns a promise of an array containing all the file paths for the given directory.
     * @param dir The given directory where to list the file paths.
     */
    getAllFilePaths({ dir, rootFolder }?: {
        dir: string;
        rootFolder: string;
    }): Promise<string[]>;
    /**
     * Returns a promise of an array of objects containing the path and the content for all the files in the project.
     * All the paths added to the `.dclignore` file will be excluded from the results.
     * Windows directory separators are replaced for POSIX separators.
     * @param ignoreFile The contents of the .dclignore file
     */
    getFiles({ ignoreFiles, cache, skipFileSizeCheck }?: {
        ignoreFiles?: string;
        cache?: boolean;
        skipFileSizeCheck?: boolean;
    }): Promise<IFile[]>;
    /**
     * Returns the the contents of the `.dclignore` file
     */
    getDCLIgnore(): Promise<string | null>;
    /**
     * Returns `true` if the provided path contains a valid main file format.
     * @param path The path to the main file.
     */
    private isValidMainFormat;
    /**
     * Returns true if the given URL is a valid websocket URL.
     * @param url The given URL.
     */
    private isWebSocket;
    /**
     * Returns `true` if the path exists as a valid file or websocket URL.
     * @param filePath The path to a given file.
     */
    private fileExists;
    /**
     * Fails the execution if one of the parcel data is invalid
     * @param sceneFile The JSON parsed file of scene.json
     */
    private validateSceneData;
    getSceneBaseCoords(): Promise<{
        x: number;
        y: number;
    }>;
    getSceneParcelCount(): Promise<number>;
    checkCLIandECSCompatibility(): Promise<void>;
}
export declare function copySample(projectSample: string, destWorkingDir: string): Promise<void>;
export {};
//# sourceMappingURL=Project.d.ts.map