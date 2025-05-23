import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
/**
 * Creates a new {@link PaymentCallBuilder} pointed to server defined by serverUrl.
 *
 * Do not create this object directly, use {@link Server#payments}.
 * @see [All Payments](https://developers.stellar.org/api/horizon/resources/list-all-payments/)
 * @class
 * @augments CallBuilder
 * @param {string} serverUrl Horizon server URL.
 */
export declare class PaymentCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.PaymentOperationRecord | ServerApi.CreateAccountOperationRecord | ServerApi.AccountMergeOperationRecord | ServerApi.PathPaymentOperationRecord | ServerApi.PathPaymentStrictSendOperationRecord | ServerApi.InvokeHostFunctionOperationRecord>> {
    constructor(serverUrl: URI);
    /**
     * This endpoint responds with a collection of Payment operations where the given account was either the sender or receiver.
     * @see [Payments for Account](https://developers.stellar.org/api/horizon/resources/get-payments-by-account-id)
     * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {PaymentCallBuilder} this PaymentCallBuilder instance
     */
    forAccount(accountId: string): this;
    /**
     * This endpoint represents all payment operations that are part of a valid transactions in a given ledger.
     * @see [Payments for Ledger](https://developers.stellar.org/api/horizon/resources/retrieve-a-ledgers-payments)
     * @param {number|string} sequence Ledger sequence
     * @returns {PaymentCallBuilder} this PaymentCallBuilder instance
     */
    forLedger(sequence: number | string): this;
    /**
     * This endpoint represents all payment operations that are part of a given transaction.
     * @see [Payments for Transaction](https://developers.stellar.org/api/resources/transactions/payments/)
     * @param {string} transactionId Transaction ID
     * @returns {PaymentCallBuilder} this PaymentCallBuilder instance
     */
    forTransaction(transactionId: string): this;
}
