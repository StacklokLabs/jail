"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommsV1 = void 0;
const broker_1 = __importDefault(require("../adapters/proto/broker"));
// Handles Comms V1
function setupCommsV1(_components, _router) {
    const connections = new Set();
    const topicsPerConnection = new WeakMap();
    let connectionCounter = 0;
    const aliasToUserId = new Map();
    function getTopicList(socket) {
        let set = topicsPerConnection.get(socket);
        if (!set) {
            set = new Set();
            topicsPerConnection.set(socket, set);
        }
        return set;
    }
    return {
        adoptWebSocket(ws, userId) {
            const alias = ++connectionCounter;
            aliasToUserId.set(alias, userId);
            console.log('Acquiring comms connection.');
            connections.add(ws);
            ws.on('message', (message) => {
                const data = message;
                const msgType = broker_1.default.CoordinatorMessage.deserializeBinary(data).getType();
                if (msgType === broker_1.default.MessageType.PING) {
                    ws.send(data);
                }
                else if (msgType === broker_1.default.MessageType.TOPIC) {
                    const topicMessage = broker_1.default.TopicMessage.deserializeBinary(data);
                    const topic = topicMessage.getTopic();
                    const topicFwMessage = new broker_1.default.TopicFWMessage();
                    topicFwMessage.setType(broker_1.default.MessageType.TOPIC_FW);
                    topicFwMessage.setFromAlias(alias);
                    topicFwMessage.setBody(topicMessage.getBody_asU8());
                    const topicData = topicFwMessage.serializeBinary();
                    // Reliable/unreliable data
                    connections.forEach(($) => {
                        if (ws !== $) {
                            if (getTopicList($).has(topic)) {
                                $.send(topicData);
                            }
                        }
                    });
                }
                else if (msgType === broker_1.default.MessageType.TOPIC_IDENTITY) {
                    const topicMessage = broker_1.default.TopicIdentityMessage.deserializeBinary(data);
                    const topic = topicMessage.getTopic();
                    const topicFwMessage = new broker_1.default.TopicIdentityFWMessage();
                    topicFwMessage.setType(broker_1.default.MessageType.TOPIC_IDENTITY_FW);
                    topicFwMessage.setFromAlias(alias);
                    topicFwMessage.setIdentity(aliasToUserId.get(alias));
                    topicFwMessage.setRole(broker_1.default.Role.CLIENT);
                    topicFwMessage.setBody(topicMessage.getBody_asU8());
                    const topicData = topicFwMessage.serializeBinary();
                    // Reliable/unreliable data
                    connections.forEach(($) => {
                        if (ws !== $) {
                            if (getTopicList($).has(topic)) {
                                $.send(topicData);
                            }
                        }
                    });
                }
                else if (msgType === broker_1.default.MessageType.SUBSCRIPTION) {
                    const topicMessage = broker_1.default.SubscriptionMessage.deserializeBinary(data);
                    const rawTopics = topicMessage.getTopics();
                    const topics = Buffer.from(rawTopics).toString('utf8');
                    const set = getTopicList(ws);
                    set.clear();
                    topics.split(/\s+/g).forEach(($) => set.add($));
                }
            });
            ws.on('close', () => connections.delete(ws));
            setTimeout(() => {
                const welcome = new broker_1.default.WelcomeMessage();
                welcome.setType(broker_1.default.MessageType.WELCOME);
                welcome.setAlias(alias);
                const data = welcome.serializeBinary();
                ws.send(data, (err) => {
                    if (err) {
                        try {
                            ws.close();
                        }
                        catch (_a) { }
                    }
                });
            }, 100);
        }
    };
}
exports.setupCommsV1 = setupCommsV1;
//# sourceMappingURL=legacy-comms-v1.js.map