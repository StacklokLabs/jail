import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
/**
 * Creates a new {@link LedgerCallBuilder} pointed to server defined by serverUrl.
 * Do not create this object directly, use {@link Server#ledgers}.
 *
 * @see [All Ledgers](https://developers.stellar.org/api/resources/ledgers/list/)
 * @class
 * @class LedgerCallBuilder
 * @augments CallBuilder
 * @param {string} serverUrl Horizon server URL.
 */
export declare class LedgerCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.LedgerRecord>> {
    constructor(serverUrl: URI);
    /**
     * Provides information on a single ledger.
     * @param {number|string} sequence Ledger sequence
     * @returns {LedgerCallBuilder} current LedgerCallBuilder instance
     */
    ledger(sequence: number | string): this;
}
