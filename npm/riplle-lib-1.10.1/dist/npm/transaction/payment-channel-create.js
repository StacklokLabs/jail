"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("./utils"));
const common_1 = require("../common");
function createPaymentChannelCreateTransaction(account, paymentChannel) {
    const txJSON = {
        Account: account,
        TransactionType: 'PaymentChannelCreate',
        Amount: common_1.xrpToDrops(paymentChannel.amount),
        Destination: paymentChannel.destination,
        SettleDelay: paymentChannel.settleDelay,
        PublicKey: paymentChannel.publicKey.toUpperCase()
    };
    if (paymentChannel.cancelAfter != null) {
        txJSON.CancelAfter = common_1.iso8601ToRippleTime(paymentChannel.cancelAfter);
    }
    if (paymentChannel.sourceTag != null) {
        txJSON.SourceTag = paymentChannel.sourceTag;
    }
    if (paymentChannel.destinationTag != null) {
        txJSON.DestinationTag = paymentChannel.destinationTag;
    }
    return txJSON;
}
function preparePaymentChannelCreate(address, paymentChannelCreate, instructions = {}) {
    try {
        common_1.validate.preparePaymentChannelCreate({
            address,
            paymentChannelCreate,
            instructions
        });
        const txJSON = createPaymentChannelCreateTransaction(address, paymentChannelCreate);
        return utils.prepareTransaction(txJSON, this, instructions);
    }
    catch (e) {
        return Promise.reject(e);
    }
}
exports.default = preparePaymentChannelCreate;
//# sourceMappingURL=payment-channel-create.js.map