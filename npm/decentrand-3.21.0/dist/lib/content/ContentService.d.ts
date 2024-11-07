/// <reference types="node" />
import { EventEmitter } from 'events';
import { Scene } from '@dcl/schemas';
import { Coords } from '../../utils/coordinateHelpers';
import { FileInfo } from '../Decentraland';
export declare class ContentService extends EventEmitter {
    private readonly client;
    private contentClient?;
    constructor(catalystServerUrl: string);
    /**
     * Retrives the uploaded content information by a given Parcel (x y coordinates)
     * @param x
     * @param y
     */
    getParcelStatus(coordinates: Coords): Promise<{
        cid: string;
        files: FileInfo[];
    }>;
    /**
     * Retrives the content of the scene.json file from the content-server
     * @param x
     * @param y
     */
    getSceneData(coordinates: Coords): Promise<Scene>;
    private fetchEntity;
}
//# sourceMappingURL=ContentService.d.ts.map