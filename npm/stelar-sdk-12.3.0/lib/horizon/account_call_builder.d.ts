import { Asset } from "@stellar/stellar-base";
import { CallBuilder } from "./call_builder";
import { ServerApi } from "./server_api";
/**
 * Creates a new {@link AccountCallBuilder} pointed to server defined by serverUrl.
 * Do not create this object directly, use {@link Server#accounts}.
 *
 * @see [All Accounts](https://developers.stellar.org/api/resources/accounts/)
 * @class AccountCallBuilder
 * @augments CallBuilder
 * @class
 * @param {string} serverUrl Horizon server URL.
 */
export declare class AccountCallBuilder extends CallBuilder<ServerApi.CollectionPage<ServerApi.AccountRecord>> {
    constructor(serverUrl: URI);
    /**
     * Returns information and links relating to a single account.
     * The balances section in the returned JSON will also list all the trust lines this account has set up.
     *
     * @see [Account Details](https://developers.stellar.org/api/resources/accounts/single/)
     * @param {string} id For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {CallBuilder} a new CallBuilder instance for the /accounts/:id endpoint
     */
    accountId(id: string): CallBuilder<ServerApi.AccountRecord>;
    /**
     * This endpoint filters accounts by signer account.
     * @see [Accounts](https://developers.stellar.org/api/resources/accounts/list/)
     * @param {string} id For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {AccountCallBuilder} current AccountCallBuilder instance
     */
    forSigner(id: string): this;
    /**
     * This endpoint filters all accounts who are trustees to an asset.
     * @see [Accounts](https://developers.stellar.org/api/resources/accounts/list/)
     * @see Asset
     * @param {Asset} asset For example: `new Asset('USD','GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD')`
     * @returns {AccountCallBuilder} current AccountCallBuilder instance
     */
    forAsset(asset: Asset): this;
    /**
     * This endpoint filters accounts where the given account is sponsoring the account or any of its sub-entries..
     * @see [Accounts](https://developers.stellar.org/api/resources/accounts/list/)
     * @param {string} id For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
     * @returns {AccountCallBuilder} current AccountCallBuilder instance
     */
    sponsor(id: string): this;
    /**
     * This endpoint filters accounts holding a trustline to the given liquidity pool.
     *
     * @param {string} id The ID of the liquidity pool. For example: `dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7`.
     * @returns {AccountCallBuilder} current AccountCallBuilder instance
     */
    forLiquidityPool(id: string): this;
}
