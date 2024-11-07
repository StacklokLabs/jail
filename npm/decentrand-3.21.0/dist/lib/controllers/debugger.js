"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDebuggingAdapter = void 0;
const ws_1 = require("@well-known-components/http-server/dist/ws");
const child_process_1 = require("child_process");
function setupDebuggingAdapter(components, router) {
    router.get('/_scene/debug-adapter', async (ctx) => {
        if (ctx.request.headers.get('upgrade') === 'websocket') {
            return (0, ws_1.upgradeWebSocketResponse)((ws) => {
                if (ws.protocol === 'dcl-scene') {
                    const file = require.resolve('dcl-node-runtime');
                    const theFork = (0, child_process_1.fork)(file, [], {
                        // enable two way IPC
                        stdio: [0, 1, 2, 'ipc'],
                        cwd: process.cwd()
                    });
                    console.log(`> Creating scene fork #` + theFork.pid);
                    theFork.on('close', () => {
                        if (ws.readyState === ws.OPEN) {
                            ws.close();
                        }
                    });
                    theFork.on('message', (message) => {
                        if (ws.readyState === ws.OPEN) {
                            ws.send(message);
                        }
                    });
                    ws.on('message', (data) => theFork.send(data.toString()));
                    ws.on('close', () => {
                        console.log('> Killing fork #' + theFork.pid);
                        theFork.kill();
                    });
                }
                else
                    ws.close();
            });
        }
        return { status: 201 };
    });
}
exports.setupDebuggingAdapter = setupDebuggingAdapter;
//# sourceMappingURL=debugger.js.map