import { Decentraland } from './Decentraland';
import { ILoggerComponent, IMetricsComponent, IHttpServerComponent, IConfigComponent } from '@well-known-components/interfaces';
import { HTTPProvider } from 'eth-connect';
import { RoomComponent } from '@dcl/mini-comms/dist/adapters/rooms';
import { WebSocketComponent } from './adapters/ws';
export declare type PreviewComponents = {
    logs: ILoggerComponent;
    server: IHttpServerComponent<PreviewComponents>;
    config: IConfigComponent;
    metrics: IMetricsComponent<any>;
    ethereumProvider: HTTPProvider;
    rooms: RoomComponent;
    dcl: Decentraland;
    ws: WebSocketComponent;
};
export declare function wirePreview(components: PreviewComponents, watch: boolean): Promise<void>;
//# sourceMappingURL=Preview.d.ts.map