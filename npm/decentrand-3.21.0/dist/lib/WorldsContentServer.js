"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldsContentServer = void 0;
const events_1 = require("events");
const wildcards_1 = __importDefault(require("wildcards"));
const errors_1 = require("../utils/errors");
const config_1 = require("../config");
const crypto_1 = require("@dcl/crypto/dist/crypto");
const eth_connect_1 = require("eth-connect");
const WorldsContentServerLinkerAPI_1 = require("./WorldsContentServerLinkerAPI");
class WorldsContentServer extends events_1.EventEmitter {
    constructor(args) {
        super();
        this.options = args;
        this.options.config = this.options.config || (0, config_1.getConfig)();
        this.targetContent = args.targetContent;
        if (process.env.DCL_PRIVATE_KEY) {
            this.createWallet(process.env.DCL_PRIVATE_KEY);
        }
    }
    async link(payload) {
        return new Promise(async (resolve, reject) => {
            const linker = new WorldsContentServerLinkerAPI_1.WorldsContentServerLinkerAPI({
                worldName: this.options.worldName,
                allowed: this.options.allowed,
                oldAllowed: this.options.oldAllowed,
                targetContent: this.options.targetContent,
                method: this.options.method,
                expiration: 120,
                payload
            });
            (0, wildcards_1.default)(linker, '*', this.pipeEvents.bind(this));
            linker.on('link:success', async (message) => {
                resolve(message);
            });
            try {
                await linker.link(this.options.linkerPort, !!this.options.isHttps);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    async getAddressAndSignature(messageToSign) {
        if (this.environmentIdentity) {
            return {
                signature: (0, crypto_1.ethSign)((0, eth_connect_1.hexToBytes)(this.environmentIdentity.privateKey), messageToSign),
                address: this.environmentIdentity.address
            };
        }
        return this.link(messageToSign);
    }
    pipeEvents(event, ...args) {
        this.emit(event, ...args);
    }
    createWallet(privateKey) {
        let length = 64;
        if (privateKey.startsWith('0x')) {
            length = 66;
        }
        if (privateKey.length !== length) {
            (0, errors_1.fail)(errors_1.ErrorType.DEPLOY_ERROR, 'Addresses should be 64 characters length.');
        }
        const pk = (0, eth_connect_1.hexToBytes)(privateKey);
        const msg = Math.random().toString();
        const signature = (0, crypto_1.ethSign)(pk, msg);
        const address = (0, crypto_1.recoverAddressFromEthSignature)(signature, msg);
        this.environmentIdentity = {
            address,
            privateKey,
            publicKey: '0x'
        };
    }
}
exports.WorldsContentServer = WorldsContentServer;
//# sourceMappingURL=WorldsContentServer.js.map