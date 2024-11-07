"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = exports.TronWeb = exports.Plugin = exports.Event = exports.Contract = exports.Trx = exports.TransactionBuilder = exports.providers = exports.BigNumber = exports.utils = void 0;
const tslib_1 = require("tslib");
const index_js_1 = tslib_1.__importDefault(require("./utils/index.js"));
exports.utils = index_js_1.default;
const bignumber_js_1 = require("bignumber.js");
Object.defineProperty(exports, "BigNumber", { enumerable: true, get: function () { return bignumber_js_1.BigNumber; } });
const index_js_2 = require("./lib/providers/index.js");
Object.defineProperty(exports, "providers", { enumerable: true, get: function () { return index_js_2.providers; } });
const TransactionBuilder_js_1 = require("./lib/TransactionBuilder/TransactionBuilder.js");
Object.defineProperty(exports, "TransactionBuilder", { enumerable: true, get: function () { return TransactionBuilder_js_1.TransactionBuilder; } });
const trx_js_1 = require("./lib/trx.js");
Object.defineProperty(exports, "Trx", { enumerable: true, get: function () { return trx_js_1.Trx; } });
const index_js_3 = require("./lib/contract/index.js");
Object.defineProperty(exports, "Contract", { enumerable: true, get: function () { return index_js_3.Contract; } });
const event_js_1 = require("./lib/event.js");
Object.defineProperty(exports, "Event", { enumerable: true, get: function () { return event_js_1.Event; } });
const plugin_js_1 = require("./lib/plugin.js");
Object.defineProperty(exports, "Plugin", { enumerable: true, get: function () { return plugin_js_1.Plugin; } });
const tronweb_js_1 = require("./tronweb.js");
Object.defineProperty(exports, "TronWeb", { enumerable: true, get: function () { return tronweb_js_1.TronWeb; } });
const Types = tslib_1.__importStar(require("./types/index.js"));
exports.Types = Types;
exports.default = {
    utils: index_js_1.default,
    BigNumber: bignumber_js_1.BigNumber,
    providers: index_js_2.providers,
    TransactionBuilder: TransactionBuilder_js_1.TransactionBuilder,
    Trx: trx_js_1.Trx,
    Contract: index_js_3.Contract,
    Event: event_js_1.Event,
    Plugin: plugin_js_1.Plugin,
    TronWeb: tronweb_js_1.TronWeb,
    Types,
};
//# sourceMappingURL=index.js.map