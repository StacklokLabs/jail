"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const tslib_1 = require("tslib");
const tronweb_js_1 = require("../tronweb.js");
const index_js_1 = tslib_1.__importDefault(require("../utils/index.js"));
const index_js_2 = require("./providers/index.js");
class Event {
    tronWeb;
    constructor(tronWeb) {
        if (!tronWeb || !(tronWeb instanceof tronweb_js_1.TronWeb))
            throw new Error('Expected instance of TronWeb');
        this.tronWeb = tronWeb;
    }
    setServer(eventServer, healthcheck = 'healthcheck') {
        if (!eventServer)
            return (this.tronWeb.eventServer = undefined);
        if (index_js_1.default.isString(eventServer))
            eventServer = new index_js_2.HttpProvider(eventServer);
        if (!this.tronWeb.isValidProvider(eventServer))
            throw new Error('Invalid event server provided');
        this.tronWeb.eventServer = eventServer;
        this.tronWeb.eventServer.isConnected = () => this.tronWeb
            .eventServer.request(healthcheck)
            .then(() => true)
            .catch(() => false);
    }
    async getEventsByContractAddress(contractAddress, options = {}) {
        const newOptions = Object.assign({
            limit: 20,
        }, options);
        const { eventName, blockNumber, onlyUnconfirmed, onlyConfirmed, minBlockTimestamp, maxBlockTimestamp, orderBy, fingerprint, } = newOptions;
        let { limit } = newOptions;
        if (!this.tronWeb.eventServer) {
            throw new Error('No event server configured');
        }
        if (!this.tronWeb.isAddress(contractAddress)) {
            throw new Error('Invalid contract address provided');
        }
        if (typeof minBlockTimestamp !== 'undefined' && !index_js_1.default.isInteger(minBlockTimestamp)) {
            throw new Error('Invalid minBlockTimestamp provided');
        }
        if (typeof maxBlockTimestamp !== 'undefined' && !index_js_1.default.isInteger(maxBlockTimestamp)) {
            throw new Error('Invalid maxBlockTimestamp provided');
        }
        if (index_js_1.default.isInteger(limit) && limit > 200) {
            console.warn('Defaulting to maximum accepted limit: 200');
            limit = 200;
        }
        const qs = {};
        if (eventName)
            qs.event_name = eventName;
        if (blockNumber)
            qs.block_number = blockNumber;
        if (typeof onlyUnconfirmed === 'boolean')
            qs.only_unconfirmed = onlyUnconfirmed;
        if (typeof onlyConfirmed === 'boolean')
            qs.only_confirmed = onlyConfirmed;
        if (minBlockTimestamp)
            qs.min_block_timestamp = minBlockTimestamp;
        if (maxBlockTimestamp)
            qs.max_block_timestamp = maxBlockTimestamp;
        if (orderBy)
            qs.order_by = orderBy;
        if (fingerprint)
            qs.fingerprint = fingerprint;
        if (index_js_1.default.isInteger(limit))
            qs.limit = limit;
        const res = await this.tronWeb.eventServer.request(`v1/contracts/${this.tronWeb.address.fromHex(contractAddress)}/events?${new URLSearchParams(qs).toString()}`);
        if (res.success) {
            return res;
        }
        throw new Error(res.error);
    }
    async getEventsByTransactionID(transactionID, options = {}) {
        if (!this.tronWeb.eventServer) {
            throw new Error('No event server configured');
        }
        const qs = {};
        if (typeof options.only_unconfirmed === 'boolean') {
            qs.only_unconfirmed = options.only_unconfirmed;
        }
        if (typeof options.only_confirmed === 'boolean') {
            qs.only_confirmed = options.only_confirmed;
        }
        return this.tronWeb.eventServer
            .request(`v1/transactions/${transactionID}/events?${new URLSearchParams(qs).toString()}`)
            .then((res) => {
            if (res.success) {
                return res;
            }
            throw new Error(JSON.parse(res.error).message);
        });
    }
    async getEventsByBlockNumber(blockNumber, options = {}) {
        if (!this.tronWeb.eventServer) {
            throw new Error('No event server configured');
        }
        const qs = {};
        if (typeof options.only_confirmed === 'boolean') {
            qs.only_confirmed = options.only_confirmed;
        }
        if (options.limit) {
            qs.limit = options.limit;
        }
        if (options.fingerprint) {
            qs.fingerprint = options.fingerprint;
        }
        return this.tronWeb.eventServer
            .request(`v1/blocks/${blockNumber}/events?${new URLSearchParams(qs).toString()}`)
            .then((res) => {
            if (res.success) {
                return res;
            }
            throw new Error(res.error);
        });
    }
    async getEventsOfLatestBlock(options = {}) {
        if (!this.tronWeb.eventServer) {
            throw new Error('No event server configured');
        }
        const qs = {};
        if (typeof options.only_confirmed === 'boolean') {
            qs.only_confirmed = options.only_confirmed;
        }
        return this.tronWeb.eventServer
            .request(`v1/blocks/latest/events?${new URLSearchParams(qs).toString()}`)
            .then((res) => {
            if (res.success) {
                return res;
            }
            throw new Error(res.error);
        });
    }
}
exports.Event = Event;
//# sourceMappingURL=event.js.map