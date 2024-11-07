import { WebSocketServer } from 'ws';
import { PreviewComponents } from '../Preview';
import { IBaseComponent } from '@well-known-components/interfaces';
export declare type WebSocketComponent = IBaseComponent & {
    ws: WebSocketServer;
};
/**
 * Creates a http-server component
 * @public
 */
export declare function createWsComponent(_: Pick<PreviewComponents, 'logs'>): Promise<WebSocketComponent>;
//# sourceMappingURL=ws.d.ts.map