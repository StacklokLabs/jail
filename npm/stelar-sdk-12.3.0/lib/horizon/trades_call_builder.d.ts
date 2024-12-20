import { Asset } from "@stellar/stellar-base";
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
/**
 * Creates a new {@link TradesCallBuilder} pointed to server defined by serverUrl.
 * Do not create this object directly, use {@link Server#trades}.
 *
 * @class TradesCallBuilder
 * @augments CallBuilder
 * @class
 * @see [Trades](https://developers.stellar.org/api/resources/trades/)
 * @param {string} serverUrl serverUrl Horizon server URL.
 */
export declare class TradesCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.TradeRecord>> {
    constructor(serverUrl: URI);
    /**
     * Filter trades for a specific asset pair (orderbook)
     * @param {Asset} base asset
     * @param {Asset} counter asset
     * @returns {TradesCallBuilder} current TradesCallBuilder instance
     */
    forAssetPair(base: Asset, counter: Asset): this;
    /**
     * Filter trades for a specific offer
     * @param {string} offerId ID of the offer
     * @returns {TradesCallBuilder} current TradesCallBuilder instance
     */
    forOffer(offerId: string): this;
    /**
     * Filter trades by a specific type.
     * @param {ServerApi.TradeType} tradeType the trade type to filter by.
     * @returns {TradesCallBuilder} current TradesCallBuilder instance.
     */
    forType(tradeType: ServerApi.TradeType): this;
    /**
     * Filter trades for a specific account
     * @see [Trades for Account](https://developers.stellar.org/api/resources/accounts/trades/)
     * @param {string} accountId For example: `GBYTR4MC5JAX4ALGUBJD7EIKZVM7CUGWKXIUJMRSMK573XH2O7VAK3SR`
     * @returns {TradesCallBuilder} current TradesCallBuilder instance
     */
    forAccount(accountId: string): this;
    /**
     * Filter trades for a specific liquidity pool
     * @see [Trades for Liquidity Pool](https://developers.stellar.org/api/resources/liquiditypools/trades/)
     * @param {string} liquidityPoolId For example: `3b476aff8a406a6ec3b61d5c038009cef85f2ddfaf616822dc4fec92845149b4`
     * @returns {TradesCallBuilder} current TradesCallBuilder instance
     */
    forLiquidityPool(liquidityPoolId: string): this;
}
