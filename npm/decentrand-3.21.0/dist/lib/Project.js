"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copySample = exports.Project = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const ignore_1 = __importDefault(require("ignore"));
const semver_1 = __importDefault(require("semver"));
const uuid_1 = require("uuid");
const filesystem_1 = require("../utils/filesystem");
const project_1 = require("../utils/project");
const errors_1 = require("../utils/errors");
const coordinateHelpers_1 = require("../utils/coordinateHelpers");
const projectInfo_1 = require("../project/projectInfo");
const sceneJson_1 = require("../sceneJson");
const logging_1 = require("../utils/logging");
const moduleHelpers_1 = require("../utils/moduleHelpers");
class Project {
    constructor(projectWorkingDir) {
        this.files = [];
        this.deployInfo = {};
        this.projectWorkingDir = projectWorkingDir || process.cwd();
        const info = (0, projectInfo_1.getProjectInfo)(this.projectWorkingDir);
        if (!info) {
            throw new Error(`Unable to get project info of directory '${this.projectWorkingDir}'
      Please, see if its json configuration file is wrong.`);
        }
        this.projectInfo = info;
    }
    getEcsVersion() {
        const ecs6Path = path_1.default.resolve(this.projectWorkingDir, 'node_modules', 'decentraland-ecs');
        const ecs7Path = path_1.default.resolve(this.projectWorkingDir, 'node_modules', '@dcl', 'sdk');
        const ecs6 = fs_extra_1.default.pathExistsSync(ecs6Path);
        const ecs7 = fs_extra_1.default.pathExistsSync(ecs7Path);
        if (ecs6 && ecs7) {
            throw new Error(`Conflict initializing project of '${this.projectWorkingDir}' because it has both 'decentraland-ecs' and '@dcl/sdk' packages installed.`);
        }
        else if (ecs6) {
            return 'ecs6';
        }
        else if (ecs7) {
            return 'ecs7';
        }
        return 'unknown';
    }
    async getEcsPackageVersion() {
        const ecsVersion = this.getEcsVersion();
        if (ecsVersion === 'unknown') {
            return {
                ecsVersion,
                packageVersion: 'none'
            };
        }
        const ecsPackageName = ecsVersion === 'ecs7' ? '@dcl/sdk' : 'decentraland-ecs';
        const ecsPackageJson = await (0, filesystem_1.readJSON)(path_1.default.resolve((0, project_1.getNodeModulesPath)(this.projectWorkingDir), ecsPackageName, 'package.json'));
        return {
            ecsVersion,
            packageVersion: ecsPackageJson.version
        };
    }
    setDeployInfo(value) {
        this.deployInfo = Object.assign(Object.assign({}, this.deployInfo), value);
    }
    getDeployInfo() {
        return this.deployInfo;
    }
    getProjectWorkingDir() {
        return this.projectWorkingDir;
    }
    getInfo() {
        return this.projectInfo;
    }
    /**
     * Returns `true` if the provided path contains a scene file
     */
    sceneFileExists() {
        return fs_extra_1.default.pathExists((0, project_1.getSceneFilePath)(this.projectWorkingDir));
    }
    /**
     * Returns `true` if the project working directory is empty of files
     */
    async isProjectDirEmpty() {
        return (0, filesystem_1.isEmptyDirectory)(this.projectWorkingDir);
    }
    /**
     * Returns an object containing the contents of the `scene.json` file.
     */
    async getSceneFile() {
        if (this.sceneFile) {
            return this.sceneFile;
        }
        try {
            const sceneFile = await (0, filesystem_1.readJSON)((0, project_1.getSceneFilePath)(this.projectWorkingDir));
            this.sceneFile = sceneFile;
            return sceneFile;
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.PROJECT_ERROR, `Unable to read 'scene.json' file. Try initializing the project using 'dcl init'.
        \t > Folder: ${this.projectWorkingDir}
        `);
        }
        return this.sceneFile;
    }
    /**
     * Returns true if the project contains a package.json file and an empty node_modules folder
     */
    async needsDependencies() {
        const files = await this.getAllFilePaths({
            dir: this.projectWorkingDir,
            rootFolder: this.projectWorkingDir
        });
        const hasPackageFile = files.some((file) => file === 'package.json');
        const nodeModulesPath = path_1.default.resolve(this.projectWorkingDir, 'node_modules');
        const hasNodeModulesFolder = await fs_extra_1.default.pathExists(nodeModulesPath);
        const isNodeModulesEmpty = (await this.getAllFilePaths({
            dir: nodeModulesPath,
            rootFolder: this.projectWorkingDir
        })).length === 0;
        if (hasPackageFile && (!hasNodeModulesFolder || isNodeModulesEmpty)) {
            return true;
        }
        return false;
    }
    /**
     * Returns true if te project root contains a `tsconfig.json` file
     * @param dir
     */
    async isTypescriptProject() {
        const files = await this.getAllFilePaths({
            dir: this.projectWorkingDir,
            rootFolder: this.projectWorkingDir
        });
        return files.some((file) => file === 'tsconfig.json');
    }
    /**
     * Writes the provided websocket server to the `scene.json` file
     * @param server The url to a websocket server
     */
    async scaffoldWebsockets(server) {
        await this.copySample('websockets');
        if (server) {
            await this.writeSceneFile({ main: server });
        }
    }
    /**
     * Creates a new `scene.json` file
     * @param path The path to the directory where the file will be written.
     */
    writeSceneFile(content) {
        return (0, filesystem_1.writeJSON)((0, project_1.getSceneFilePath)(this.projectWorkingDir), content);
    }
    /**
     * Copies the contents of a specific sample into the project (for scaffolding purposes).
     * Merges `scene.json` and `package.json` files
     * @param project The name of the sample folder (used as an indentifier).
     * @param destination The path to the project root. By default the current woxsrking directory.
     */
    async copySample(project) {
        await copySample(project, this.projectWorkingDir);
    }
    /**
     * Returns a promise of an object containing the base X and Y coordinates for a parcel.
     */
    async getParcelCoordinates() {
        const sceneFile = await this.getSceneFile();
        const { base } = sceneFile.scene;
        return (0, coordinateHelpers_1.getObject)(base);
    }
    /**
     * Returns a promise of an array of the parcels of the scene
     */
    async getParcels() {
        const sceneFile = await this.getSceneFile();
        return sceneFile.scene.parcels.map(coordinateHelpers_1.getObject);
    }
    /**
     * Returns a promise of the owner address
     */
    async getOwner() {
        const { owner } = await this.getSceneFile();
        if (!owner) {
            (0, errors_1.fail)(errors_1.ErrorType.PROJECT_ERROR, `Missing owner attribute at scene.json. Owner attribute is required for deploying`);
        }
        return (owner === null || owner === void 0 ? void 0 : owner.toLowerCase()) || '';
    }
    /**
     * Fails the execution if one of the parcel data is invalid
     */
    async validateSceneOptions() {
        const sceneFile = await this.getSceneFile();
        return this.validateSceneData(sceneFile);
    }
    /**
     * Writes the `.dclignore` file to the provided directory path.
     * @param dir The target path where the file will be
     */
    async writeDclIgnore() {
        const content = [
            '.*',
            'package.json',
            'package-lock.json',
            'yarn-lock.json',
            'build.json',
            'export',
            'tsconfig.json',
            'tslint.json',
            'node_modules',
            '*.ts',
            '*.tsx',
            'Dockerfile',
            'dist',
            'README.md',
            '*.blend',
            '*.fbx',
            '*.zip',
            '*.rar'
        ].join('\n');
        await fs_extra_1.default.outputFile(path_1.default.join(this.projectWorkingDir, project_1.DCLIGNORE_FILE), content);
        return content;
    }
    /**
     * Validates all the conditions required to operate over an existing project.
     * Throws if a project contains an invalid main path or if the `scene.json` file is missing.
     */
    async validateExistingProject() {
        const sceneFile = await this.getSceneFile();
        if (!this.isWebSocket(sceneFile.main)) {
            if (!this.isValidMainFormat(sceneFile.main)) {
                (0, errors_1.fail)(errors_1.ErrorType.PROJECT_ERROR, `Main scene format file (${sceneFile.main}) is not a supported format`);
            }
            if (sceneFile.main !== null && !(await this.fileExists(sceneFile.main))) {
                (0, errors_1.fail)(errors_1.ErrorType.PROJECT_ERROR, `Main scene file ${sceneFile.main} is missing in folder ${this.projectWorkingDir}`);
            }
        }
    }
    /**
     * Returns a promise of an array containing all the file paths for the given directory.
     * @param dir The given directory where to list the file paths.
     */
    async getAllFilePaths({ dir, rootFolder } = {
        dir: this.projectWorkingDir,
        rootFolder: this.projectWorkingDir
    }) {
        try {
            const files = await fs_extra_1.default.readdir(dir);
            let tmpFiles = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const filePath = path_1.default.resolve(dir, file);
                const relativePath = path_1.default.relative(rootFolder, filePath);
                const stat = await fs_extra_1.default.stat(filePath);
                if (stat.isDirectory()) {
                    const folderFiles = await this.getAllFilePaths({
                        dir: filePath,
                        rootFolder
                    });
                    tmpFiles = tmpFiles.concat(folderFiles);
                }
                else {
                    tmpFiles.push(relativePath);
                }
            }
            return tmpFiles;
        }
        catch (e) {
            return [];
        }
    }
    /**
     * Returns a promise of an array of objects containing the path and the content for all the files in the project.
     * All the paths added to the `.dclignore` file will be excluded from the results.
     * Windows directory separators are replaced for POSIX separators.
     * @param ignoreFile The contents of the .dclignore file
     */
    async getFiles({ ignoreFiles = '', cache = false, skipFileSizeCheck = false } = {}) {
        if (cache && this.files.length) {
            return this.files;
        }
        const files = await this.getAllFilePaths();
        const filteredFiles = ignore_1.default()
            .add(ignoreFiles.split(/\n/g).map(($) => $.trim()))
            .filter(files);
        const data = [];
        for (let i = 0; i < filteredFiles.length; i++) {
            const file = filteredFiles[i];
            const filePath = path_1.default.resolve(this.projectWorkingDir, file);
            const stat = await fs_extra_1.default.stat(filePath);
            if (stat.size > Project.MAX_FILE_SIZE_BYTES && !skipFileSizeCheck) {
                (0, errors_1.fail)(errors_1.ErrorType.UPLOAD_ERROR, `Maximum file size exceeded: '${file}' is larger than ${Project.MAX_FILE_SIZE_BYTES / 1e6}MB`);
            }
            const content = await fs_extra_1.default.readFile(filePath);
            data.push({
                path: file.replace(/\\/g, '/'),
                content: Buffer.from(content),
                size: stat.size
            });
        }
        this.files = data;
        return data;
    }
    /**
     * Returns the the contents of the `.dclignore` file
     */
    async getDCLIgnore() {
        let ignoreFile;
        try {
            ignoreFile = await fs_extra_1.default.readFile((0, project_1.getIgnoreFilePath)(this.projectWorkingDir), 'utf8');
        }
        catch (e) {
            ignoreFile = null;
        }
        return ignoreFile;
    }
    /**
     * Returns `true` if the provided path contains a valid main file format.
     * @param path The path to the main file.
     */
    isValidMainFormat(path) {
        const supportedExtensions = new Set(['js', 'html', 'xml']);
        const mainExt = path ? path.split('.').pop() : null;
        return path === null || !!(mainExt && supportedExtensions.has(mainExt));
    }
    /**
     * Returns true if the given URL is a valid websocket URL.
     * @param url The given URL.
     */
    isWebSocket(url) {
        return /wss?\:\/\//gi.test(url);
    }
    /**
     * Returns `true` if the path exists as a valid file or websocket URL.
     * @param filePath The path to a given file.
     */
    async fileExists(filePath) {
        if (this.isWebSocket(filePath)) {
            return true;
        }
        return fs_extra_1.default.pathExists(path_1.default.join(this.projectWorkingDir, filePath));
    }
    /**
     * Fails the execution if one of the parcel data is invalid
     * @param sceneFile The JSON parsed file of scene.json
     */
    validateSceneData(sceneFile) {
        const { base, parcels } = sceneFile.scene;
        const parcelSet = new Set(parcels);
        if (!base) {
            (0, errors_1.fail)(errors_1.ErrorType.PROJECT_ERROR, 'Missing scene base attribute at scene.json');
        }
        if (!parcels) {
            (0, errors_1.fail)(errors_1.ErrorType.PROJECT_ERROR, 'Missing scene parcels attribute at scene.json');
        }
        if (parcelSet.size < parcels.length) {
            (0, errors_1.fail)(errors_1.ErrorType.PROJECT_ERROR, `There are duplicated parcels at scene.json. Project folder ${this.projectWorkingDir}`);
        }
        if (!parcelSet.has(base)) {
            (0, errors_1.fail)(errors_1.ErrorType.PROJECT_ERROR, `Your base parcel ${base} should be included on parcels attribute at scene.json`);
        }
        const objParcels = parcels.map(coordinateHelpers_1.getObject);
        objParcels.forEach(({ x, y }) => {
            if ((0, coordinateHelpers_1.inBounds)(x, y)) {
                return;
            }
            const { minX, maxX } = (0, coordinateHelpers_1.getBounds)();
            (0, errors_1.fail)(errors_1.ErrorType.PROJECT_ERROR, `Coordinates ${x},${y} are outside of allowed limits (from ${minX} to ${maxX})`);
        });
        if (!(0, coordinateHelpers_1.areConnected)(objParcels)) {
            (0, errors_1.fail)(errors_1.ErrorType.PROJECT_ERROR, 'Parcels described on scene.json are not connected. They should be one next to each other');
        }
    }
    async getSceneBaseCoords() {
        try {
            const sceneFile = await (0, sceneJson_1.getSceneFile)(this.projectWorkingDir);
            const [x, y] = sceneFile.scene.base.replace(/\ /g, '').split(',');
            return { x: parseInt(x), y: parseInt(y) };
        }
        catch (e) {
            console.log((0, logging_1.error)(`Could not open "scene.json" file`));
            throw e;
        }
    }
    async getSceneParcelCount() {
        try {
            const sceneFile = await (0, sceneJson_1.getSceneFile)(this.projectWorkingDir);
            return sceneFile.scene.parcels.length;
        }
        catch (e) {
            console.log((0, logging_1.error)(`Could not open "scene.json" file`));
            throw e;
        }
    }
    async checkCLIandECSCompatibility() {
        const ecsVersion = this.getEcsVersion();
        if (ecsVersion === 'unknown') {
            throw new Error('There is no SDK installed to know how version should use. Please run `npm install`.');
        }
        const ecsPackageName = ecsVersion === 'ecs7' ? '@dcl/sdk' : 'decentraland-ecs';
        const ecsPackageJson = await (0, filesystem_1.readJSON)(path_1.default.resolve((0, project_1.getNodeModulesPath)(this.projectWorkingDir), ecsPackageName, 'package.json'));
        const cliPackageJson = await (0, moduleHelpers_1.getCLIPackageJson)();
        if (ecsVersion === 'ecs6') {
            if (cliPackageJson.minEcsVersion && semver_1.default.lt(ecsPackageJson.version, `${cliPackageJson.minEcsVersion}`)) {
                throw new Error([
                    'This version of decentraland-cli (dcl) requires an ECS version higher than',
                    cliPackageJson.minEcsVersion,
                    'the installed version is',
                    ecsPackageJson.version,
                    'please go to https://docs.decentraland.org/creator/development-guide/cli/ to know more about the versions and upgrade guides'
                ].join(' '));
            }
        }
        if (ecsPackageJson.minCliVersion && semver_1.default.lt(cliPackageJson.version, ecsPackageJson.minCliVersion)) {
            throw new Error([
                `This version of ${ecsPackageName} requires a version of the CLI (dcl) higher than`,
                ecsPackageJson.minCliVersion,
                '\nThe installed CLI version is',
                cliPackageJson.version,
                `\nRun npm i -g decentraland@${ecsPackageJson.minCliVersion} or npm i -g decentraland@latest to fix this issue.\n`,
                '\nGo to https://docs.decentraland.org/creator/development-guide/cli/ to know more about the versions and upgrade guides'
            ].join(' '));
        }
    }
}
exports.Project = Project;
Project.MAX_FILE_SIZE_BYTES = 50 * 1e6; // 50mb
async function copySample(projectSample, destWorkingDir) {
    const src = path_1.default.resolve(__dirname, '..', '..', 'samples', projectSample);
    const files = await fs_extra_1.default.readdir(src);
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file === project_1.WEARABLE_JSON_FILE) {
            const wearableJsonFile = await (0, filesystem_1.readJSON)(path_1.default.join(src, file));
            const wearableJsonFileWithUuid = Object.assign(Object.assign({}, wearableJsonFile), { id: (0, uuid_1.v4)() });
            await (0, filesystem_1.writeJSON)(path_1.default.join(destWorkingDir, file), wearableJsonFileWithUuid);
        }
        else if (file === project_1.GITIGNORE_FILE || file === project_1.NPMRC_FILE || file === project_1.ESTLINTRC_FILE) {
            await fs_extra_1.default.copy(path_1.default.join(src, file), path_1.default.join(destWorkingDir, '.' + file));
        }
        else {
            await fs_extra_1.default.copy(path_1.default.join(src, file), path_1.default.join(destWorkingDir, file));
        }
    }
}
exports.copySample = copySample;
//# sourceMappingURL=Project.js.map