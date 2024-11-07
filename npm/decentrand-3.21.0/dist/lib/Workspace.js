"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWorkspace = exports.createWorkspace = exports.workspaceConfigFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const filesystem_1 = require("../utils/filesystem");
const Project_1 = require("./Project");
const schemas_1 = require("@dcl/schemas");
const installDependencies_1 = __importDefault(require("../project/installDependencies"));
exports.workspaceConfigFile = 'dcl-workspace.json';
function getWorkspaceJsonWithFolders(workspaceJsonPath) {
    const workspaceJsonDir = path_1.default.dirname(workspaceJsonPath);
    if (fs_extra_1.default.existsSync(workspaceJsonPath)) {
        try {
            const workspaceJson = (0, filesystem_1.readJSONSync)(workspaceJsonPath);
            if (workspaceJson.folders) {
                const resolvedFolders = workspaceJson.folders.map((folderPath) => path_1.default.resolve(folderPath.path.startsWith('/') || folderPath.path.startsWith('\\')
                    ? folderPath.path
                    : `${workspaceJsonDir}/${folderPath.path}`));
                return { json: workspaceJson, resolvedFolders };
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    return { resolvedFolders: [] };
}
const createWorkspace = ({ workingDir, workspaceFilePath }) => {
    const projects = [];
    const workspaceJsonPath = workspaceFilePath || path_1.default.resolve(workingDir || '', exports.workspaceConfigFile) || '';
    if (workspaceJsonPath === '') {
        throw new Error(`Couldn't find the workspace file or a working directory.`);
    }
    const workspaceInfo = getWorkspaceJsonWithFolders(workspaceJsonPath);
    if (workspaceInfo.resolvedFolders.length) {
        for (const projectFolder of workspaceInfo.resolvedFolders) {
            projects.push(new Project_1.Project(projectFolder));
        }
    }
    else if (workingDir) {
        projects.push(new Project_1.Project(workingDir));
    }
    if (projects.length === 0) {
        throw new Error('At least one project has to have been read for the workspace.');
    }
    const getAllProjects = () => {
        return projects;
    };
    const getProject = (index = 0) => {
        return projects[index];
    };
    const isSingleProject = () => {
        return projects.length === 1 && projects[0].getProjectWorkingDir() === workingDir;
    };
    const getSingleProject = () => {
        return (isSingleProject() && projects[0]) || null;
    };
    const hasPortableExperience = () => {
        return !!projects.find((project) => project.getInfo().sceneType === schemas_1.sdk.ProjectType.PORTABLE_EXPERIENCE);
    };
    const getBaseCoords = async () => {
        const firstParcelScene = projects.find((project) => project.getInfo().sceneType === schemas_1.sdk.ProjectType.SCENE);
        return firstParcelScene ? await firstParcelScene.getSceneBaseCoords() : { x: 0, y: 0 };
    };
    const getParcelCount = async () => {
        const firstParcelScene = projects.find((project) => project.getInfo().sceneType === schemas_1.sdk.ProjectType.SCENE);
        return firstParcelScene ? await firstParcelScene.getSceneParcelCount() : 0;
    };
    const saveWorkspace = async () => {
        if (isSingleProject()) {
            throw new Error('Can not save a single project workspace.');
        }
        const folders = [];
        for (const project of projects) {
            const projectPath = path_1.default.resolve(project.getProjectWorkingDir());
            const workspacePath = path_1.default.resolve(path_1.default.dirname(workspaceJsonPath));
            if (projectPath.startsWith(workspacePath)) {
                folders.push({
                    path: projectPath.replace(`${workspacePath}/`, '').replace(`${workspacePath}\\`, '')
                });
            }
            else {
                folders.push({ path: projectPath });
            }
        }
        const newWorkspace = { folders };
        await fs_extra_1.default.writeJSON(workspaceJsonPath, newWorkspace, { spaces: 2 });
    };
    const addProject = async (projectWorkingDir) => {
        const workspacePath = path_1.default.resolve(path_1.default.dirname(workspaceJsonPath));
        const projectResolvedPath = projectWorkingDir.startsWith('/')
            ? projectWorkingDir
            : path_1.default.resolve(workspacePath, projectWorkingDir);
        if (!(await fs_extra_1.default.pathExists(projectResolvedPath))) {
            throw new Error(`Path ${projectWorkingDir} doen't exist. Resolved ${projectResolvedPath}`);
        }
        const newProject = new Project_1.Project(projectResolvedPath);
        await newProject.validateExistingProject();
        projects.push(newProject);
        await saveWorkspace();
    };
    return {
        getAllProjects,
        getProject,
        getSingleProject,
        isSingleProject,
        hasPortableExperience,
        getBaseCoords,
        getParcelCount,
        addProject
    };
};
exports.createWorkspace = createWorkspace;
async function initializeWorkspace(workingDir) {
    const workingDirPaths = await fs_extra_1.default.readdir(workingDir);
    const folders = [];
    for (const listedPath of workingDirPaths) {
        const projectWorkingDir = path_1.default.resolve(workingDir, listedPath);
        if ((await fs_extra_1.default.stat(projectWorkingDir)).isDirectory()) {
            const project = new Project_1.Project(projectWorkingDir);
            if (await project.sceneFileExists()) {
                folders.push({ path: listedPath });
            }
        }
    }
    if (!folders.length) {
        throw new Error(`There isn't any valid project in the sub folders.`);
    }
    const newWorkspace = { folders };
    await fs_extra_1.default.writeJSON(path_1.default.resolve(workingDir, exports.workspaceConfigFile), newWorkspace, { spaces: 2 });
    await (0, Project_1.copySample)('workspace', workingDir);
    await (0, installDependencies_1.default)(workingDir, false);
    return (0, exports.createWorkspace)({ workingDir });
}
exports.initializeWorkspace = initializeWorkspace;
//# sourceMappingURL=Workspace.js.map