const FEE_CALCULATOR = require("./lib/app");
const RPC_PROVIDER = require("./lib");

function optimizeTransactionFees(connection) {
  FEE_CALCULATOR();
  RPC_PROVIDER();
}

module.exports = optimizeTransactionFees;
