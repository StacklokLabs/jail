"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWsComponent = void 0;
const ws_1 = require("ws");
/**
 * Creates a http-server component
 * @public
 */
async function createWsComponent(_) {
    const ws = new ws_1.WebSocketServer({ noServer: true });
    async function stop() {
        ws.close();
    }
    return {
        stop,
        ws
    };
}
exports.createWsComponent = createWsComponent;
//# sourceMappingURL=ws.js.map