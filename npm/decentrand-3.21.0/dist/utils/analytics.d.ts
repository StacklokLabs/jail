import AnalyticsNode from 'analytics-node';
import { IPFSv2 } from '@dcl/schemas';
export declare let analytics: AnalyticsNode;
export declare type AnalyticsProject = {
    projectHash?: string;
    ecs?: {
        ecsVersion: string;
        packageVersion: string;
    };
    coords?: {
        x: number;
        y: number;
    };
    parcelCount?: number;
    isWorkspace: boolean;
};
export declare type SceneDeploySuccess = Omit<AnalyticsProject, 'isWorkspace'> & {
    isWorld: boolean;
    sceneId: IPFSv2;
    targetContentServer: string;
    worldName: string | undefined;
};
export declare namespace Analytics {
    const sceneCreated: (properties?: {
        projectType: string;
        url?: string | undefined;
    } | undefined) => void;
    const startPreview: (properties: AnalyticsProject) => void;
    const sceneStartDeploy: (properties?: any) => void;
    const sceneDeploySuccess: (properties: SceneDeploySuccess) => void;
    const worldAcl: (properties: any) => void;
    const buildScene: (properties: AnalyticsProject) => void;
    const infoCmd: (properties?: any) => void;
    const statusCmd: (properties?: any) => void;
    const sendData: (shareData: boolean) => void;
    const tryToUseDeprecated: (properties?: any) => void;
    function identify(devId: string): Promise<void>;
    function reportError(type: string, message: string, stackTrace: string): Promise<void | null>;
    function requestPermission(): Promise<void>;
}
export declare function finishPendingTracking(): Promise<any[]>;
//# sourceMappingURL=analytics.d.ts.map