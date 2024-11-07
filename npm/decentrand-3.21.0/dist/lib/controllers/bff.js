"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupBffAndComms = void 0;
const handle_linear_protocol_1 = require("@dcl/mini-comms/dist/logic/handle-linear-protocol");
const ws_1 = require("@well-known-components/http-server/dist/ws");
/**
 * This module handles the BFF mock and communications server for the preview mode.
 * It runs using @dcl/mini-comms implementing RFC-5
 */
async function setupBffAndComms(components, router) {
    router.get('/about', async (ctx) => {
        const host = ctx.url.host;
        const body = {
            acceptingUsers: true,
            bff: { healthy: false, publicUrl: '' },
            comms: {
                healthy: true,
                protocol: 'v3',
                fixedAdapter: `ws-room:${ctx.url.protocol.replace(/^http/, 'ws')}//${host}/mini-comms/room-1`
            },
            configurations: {
                realmName: 'LocalPreview',
                networkId: 1,
                globalScenesUrn: [],
                scenesUrn: []
            },
            content: {
                healthy: true,
                publicUrl: `${ctx.url.protocol}//${ctx.url.host}/content`
            },
            lambdas: {
                healthy: true,
                publicUrl: `${ctx.url.protocol}//${ctx.url.host}/lambdas`
            },
            healthy: true
        };
        return { body };
    });
    router.get('/mini-comms/:roomId', async (ctx) => {
        return (0, ws_1.upgradeWebSocketResponse)((ws) => {
            if (ws.protocol === 'rfc5' || ws.protocol === 'rfc4') {
                ws.on('error', (error) => {
                    console.error(error);
                    ws.close();
                });
                ws.on('close', () => {
                    console.debug('Websocket closed');
                });
                (0, handle_linear_protocol_1.handleSocketLinearProtocol)(components, ws, ctx.params.roomId).catch((err) => {
                    console.info(err);
                    ws.close();
                });
            }
        });
    });
}
exports.setupBffAndComms = setupBffAndComms;
//# sourceMappingURL=bff.js.map