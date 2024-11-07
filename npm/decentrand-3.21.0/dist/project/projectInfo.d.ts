import { sdk } from '@dcl/schemas';
export declare type ProjectInfo = {
    sceneId: string;
    sceneType: sdk.ProjectType;
};
export declare function smartWearableNameToId(name: string): string;
export declare function getProjectInfo(workDir: string): ProjectInfo | null;
//# sourceMappingURL=projectInfo.d.ts.map