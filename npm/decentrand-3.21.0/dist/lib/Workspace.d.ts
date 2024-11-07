import { Project } from './Project';
export declare const workspaceConfigFile = "dcl-workspace.json";
export interface Workspace {
    getAllProjects: () => Project[];
    getProject: (index: number) => Project;
    getSingleProject: () => Project | null;
    isSingleProject: () => boolean;
    hasPortableExperience: () => boolean;
    getBaseCoords: () => Promise<{
        x: number;
        y: number;
    }>;
    getParcelCount: () => Promise<number>;
    addProject: (projectPath: string) => Promise<void>;
}
export declare const createWorkspace: ({ workingDir, workspaceFilePath }: {
    workingDir?: string | undefined;
    workspaceFilePath?: string | undefined;
}) => Workspace;
export declare function initializeWorkspace(workingDir: string): Promise<Workspace>;
//# sourceMappingURL=Workspace.d.ts.map