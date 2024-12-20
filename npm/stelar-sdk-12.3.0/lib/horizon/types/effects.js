"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EffectType = void 0;
var EffectType = exports.EffectType = function (EffectType) {
  EffectType[EffectType["account_created"] = 0] = "account_created";
  EffectType[EffectType["account_removed"] = 1] = "account_removed";
  EffectType[EffectType["account_credited"] = 2] = "account_credited";
  EffectType[EffectType["account_debited"] = 3] = "account_debited";
  EffectType[EffectType["account_thresholds_updated"] = 4] = "account_thresholds_updated";
  EffectType[EffectType["account_home_domain_updated"] = 5] = "account_home_domain_updated";
  EffectType[EffectType["account_flags_updated"] = 6] = "account_flags_updated";
  EffectType[EffectType["account_inflation_destination_updated"] = 7] = "account_inflation_destination_updated";
  EffectType[EffectType["signer_created"] = 10] = "signer_created";
  EffectType[EffectType["signer_removed"] = 11] = "signer_removed";
  EffectType[EffectType["signer_updated"] = 12] = "signer_updated";
  EffectType[EffectType["trustline_created"] = 20] = "trustline_created";
  EffectType[EffectType["trustline_removed"] = 21] = "trustline_removed";
  EffectType[EffectType["trustline_updated"] = 22] = "trustline_updated";
  EffectType[EffectType["trustline_authorized"] = 23] = "trustline_authorized";
  EffectType[EffectType["trustline_deauthorized"] = 24] = "trustline_deauthorized";
  EffectType[EffectType["trustline_authorized_to_maintain_liabilities"] = 25] = "trustline_authorized_to_maintain_liabilities";
  EffectType[EffectType["trustline_flags_updated"] = 26] = "trustline_flags_updated";
  EffectType[EffectType["offer_created"] = 30] = "offer_created";
  EffectType[EffectType["offer_removed"] = 31] = "offer_removed";
  EffectType[EffectType["offer_updated"] = 32] = "offer_updated";
  EffectType[EffectType["trade"] = 33] = "trade";
  EffectType[EffectType["data_created"] = 40] = "data_created";
  EffectType[EffectType["data_removed"] = 41] = "data_removed";
  EffectType[EffectType["data_updated"] = 42] = "data_updated";
  EffectType[EffectType["sequence_bumped"] = 43] = "sequence_bumped";
  EffectType[EffectType["claimable_balance_created"] = 50] = "claimable_balance_created";
  EffectType[EffectType["claimable_balance_claimant_created"] = 51] = "claimable_balance_claimant_created";
  EffectType[EffectType["claimable_balance_claimed"] = 52] = "claimable_balance_claimed";
  EffectType[EffectType["account_sponsorship_created"] = 60] = "account_sponsorship_created";
  EffectType[EffectType["account_sponsorship_updated"] = 61] = "account_sponsorship_updated";
  EffectType[EffectType["account_sponsorship_removed"] = 62] = "account_sponsorship_removed";
  EffectType[EffectType["trustline_sponsorship_created"] = 63] = "trustline_sponsorship_created";
  EffectType[EffectType["trustline_sponsorship_updated"] = 64] = "trustline_sponsorship_updated";
  EffectType[EffectType["trustline_sponsorship_removed"] = 65] = "trustline_sponsorship_removed";
  EffectType[EffectType["data_sponsorship_created"] = 66] = "data_sponsorship_created";
  EffectType[EffectType["data_sponsorship_updated"] = 67] = "data_sponsorship_updated";
  EffectType[EffectType["data_sponsorship_removed"] = 68] = "data_sponsorship_removed";
  EffectType[EffectType["claimable_balance_sponsorship_created"] = 69] = "claimable_balance_sponsorship_created";
  EffectType[EffectType["claimable_balance_sponsorship_updated"] = 70] = "claimable_balance_sponsorship_updated";
  EffectType[EffectType["claimable_balance_sponsorship_removed"] = 71] = "claimable_balance_sponsorship_removed";
  EffectType[EffectType["signer_sponsorship_created"] = 72] = "signer_sponsorship_created";
  EffectType[EffectType["signer_sponsorship_updated"] = 73] = "signer_sponsorship_updated";
  EffectType[EffectType["signer_sponsorship_removed"] = 74] = "signer_sponsorship_removed";
  EffectType[EffectType["claimable_balance_clawed_back"] = 80] = "claimable_balance_clawed_back";
  EffectType[EffectType["liquidity_pool_deposited"] = 90] = "liquidity_pool_deposited";
  EffectType[EffectType["liquidity_pool_withdrew"] = 91] = "liquidity_pool_withdrew";
  EffectType[EffectType["liquidity_pool_trade"] = 92] = "liquidity_pool_trade";
  EffectType[EffectType["liquidity_pool_created"] = 93] = "liquidity_pool_created";
  EffectType[EffectType["liquidity_pool_removed"] = 94] = "liquidity_pool_removed";
  EffectType[EffectType["liquidity_pool_revoked"] = 95] = "liquidity_pool_revoked";
  EffectType[EffectType["contract_credited"] = 96] = "contract_credited";
  EffectType[EffectType["contract_debited"] = 97] = "contract_debited";
  return EffectType;
}({});