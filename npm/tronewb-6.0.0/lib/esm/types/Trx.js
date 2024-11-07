export var ResourceCode;
(function (ResourceCode) {
    ResourceCode[ResourceCode["BANDWIDTH"] = 0] = "BANDWIDTH";
    ResourceCode[ResourceCode["ENERGY"] = 1] = "ENERGY";
    ResourceCode[ResourceCode["TRON_POWER"] = 2] = "TRON_POWER";
})(ResourceCode || (ResourceCode = {}));
var TransactionSignWeight_response_code;
(function (TransactionSignWeight_response_code) {
    TransactionSignWeight_response_code["ENOUGH_PERMISSION"] = "ENOUGH_PERMISSION";
    TransactionSignWeight_response_code["NOT_ENOUGH_PERMISSION"] = "NOT_ENOUGH_PERMISSION";
    TransactionSignWeight_response_code["SIGNATURE_FORMAT_ERROR"] = "SIGNATURE_FORMAT_ERROR";
    TransactionSignWeight_response_code["COMPUTE_ADDRESS_ERROR"] = "COMPUTE_ADDRESS_ERROR";
    TransactionSignWeight_response_code["PERMISSION_ERROR"] = "PERMISSION_ERROR";
    TransactionSignWeight_response_code["OTHER_ERROR"] = "OTHER_ERROR";
})(TransactionSignWeight_response_code || (TransactionSignWeight_response_code = {}));
var BroadcastReturn_response_code;
(function (BroadcastReturn_response_code) {
    BroadcastReturn_response_code[BroadcastReturn_response_code["SUCCESS"] = 0] = "SUCCESS";
    BroadcastReturn_response_code[BroadcastReturn_response_code["SIGERROR"] = 1] = "SIGERROR";
    BroadcastReturn_response_code[BroadcastReturn_response_code["CONTRACT_VALIDATE_ERROR"] = 2] = "CONTRACT_VALIDATE_ERROR";
    BroadcastReturn_response_code[BroadcastReturn_response_code["CONTRACT_EXE_ERROR"] = 3] = "CONTRACT_EXE_ERROR";
    BroadcastReturn_response_code[BroadcastReturn_response_code["BANDWITH_ERROR"] = 4] = "BANDWITH_ERROR";
    BroadcastReturn_response_code[BroadcastReturn_response_code["DUP_TRANSACTION_ERROR"] = 5] = "DUP_TRANSACTION_ERROR";
    BroadcastReturn_response_code[BroadcastReturn_response_code["TAPOS_ERROR"] = 6] = "TAPOS_ERROR";
    BroadcastReturn_response_code[BroadcastReturn_response_code["TOO_BIG_TRANSACTION_ERROR"] = 7] = "TOO_BIG_TRANSACTION_ERROR";
    BroadcastReturn_response_code[BroadcastReturn_response_code["TRANSACTION_EXPIRATION_ERROR"] = 8] = "TRANSACTION_EXPIRATION_ERROR";
    BroadcastReturn_response_code[BroadcastReturn_response_code["SERVER_BUSY"] = 9] = "SERVER_BUSY";
    BroadcastReturn_response_code[BroadcastReturn_response_code["NO_CONNECTION"] = 10] = "NO_CONNECTION";
    BroadcastReturn_response_code[BroadcastReturn_response_code["NOT_ENOUGH_EFFECTIVE_CONNECTION"] = 11] = "NOT_ENOUGH_EFFECTIVE_CONNECTION";
    BroadcastReturn_response_code[BroadcastReturn_response_code["OTHER_ERROR"] = 20] = "OTHER_ERROR";
})(BroadcastReturn_response_code || (BroadcastReturn_response_code = {}));
var ProposalState;
(function (ProposalState) {
    ProposalState[ProposalState["PENDING"] = 0] = "PENDING";
    ProposalState[ProposalState["DISAPPROVED"] = 1] = "DISAPPROVED";
    ProposalState[ProposalState["APPROVED"] = 2] = "APPROVED";
    ProposalState[ProposalState["CANCELED"] = 3] = "CANCELED";
})(ProposalState || (ProposalState = {}));
//# sourceMappingURL=Trx.js.map