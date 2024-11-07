import { sdk } from '@dcl/schemas';
declare type URL = string;
export declare type InitOptionProjectType = {
    type: 'project';
    value: sdk.ProjectType;
};
export declare type InitOptionRepositoryURL = {
    type: 'scene';
    value: URL;
};
export declare type InitOption = InitOptionProjectType | InitOptionRepositoryURL;
export declare type RepositoryJson = {
    scenes: {
        title: string;
        url: string;
    }[];
    library: string;
    portableExperience: string;
    smartItem: string;
};
export {};
//# sourceMappingURL=types.d.ts.map