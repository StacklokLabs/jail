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
const validate = utils.common.validate;
function createEscrowCancellationTransaction(account, payment) {
    const txJSON = {
        TransactionType: 'EscrowCancel',
        Account: account,
        Owner: payment.owner,
        OfferSequence: payment.escrowSequence
    };
    if (payment.memos != null) {
        txJSON.Memos = payment.memos.map(utils.convertMemo);
    }
    return txJSON;
}
function prepareEscrowCancellation(address, escrowCancellation, instructions = {}) {
    validate.prepareEscrowCancellation({
        address,
        escrowCancellation,
        instructions
    });
    const txJSON = createEscrowCancellationTransaction(address, escrowCancellation);
    return utils.prepareTransaction(txJSON, this, instructions);
}
exports.default = prepareEscrowCancellation;
//# sourceMappingURL=escrow-cancellation.js.map