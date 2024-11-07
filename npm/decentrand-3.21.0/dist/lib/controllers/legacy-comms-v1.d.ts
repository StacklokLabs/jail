import { Router } from '@well-known-components/http-server';
import WebSocket from 'ws';
import { PreviewComponents } from '../Preview';
export declare function setupCommsV1(_components: PreviewComponents, _router: Router<any>): {
    adoptWebSocket(ws: WebSocket, userId: string): void;
};
//# sourceMappingURL=legacy-comms-v1.d.ts.map