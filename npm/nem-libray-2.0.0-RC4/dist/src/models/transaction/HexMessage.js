"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
class HexMessage extends Message_1.Message {
    /**
     * @internal
     * @param payload
     */
    constructor(payload) {
        super(payload);
    }
    /**
     * Create new constructor
     * @param message
     */
    static create(message) {
        let msg = "fe" + message;
        return new HexMessage(msg);
    }
    isEncrypted() {
        return false;
    }
    isPlain() {
        return true;
    }
    /**
     * @internal
     */
    toDTO() {
        return {
            payload: this.payload,
            type: 1,
        };
    }
}
exports.HexMessage = HexMessage;
//# sourceMappingURL=HexMessage.js.map