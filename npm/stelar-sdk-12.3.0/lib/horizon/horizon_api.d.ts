import { AssetType, MemoType } from "@stellar/stellar-base";
export declare namespace HorizonApi {
    interface ResponseLink {
        href: string;
        templated?: boolean;
    }
    interface BaseResponse<T extends string = never> {
        _links: {
            [key in T | "self"]: ResponseLink;
        };
    }
    interface SubmitTransactionResponse {
        hash: string;
        ledger: number;
        successful: boolean;
        envelope_xdr: string;
        result_xdr: string;
        result_meta_xdr: string;
        paging_token: string;
    }
    interface SubmitAsyncTransactionResponse {
        hash: string;
        tx_status: string;
        error_result_xdr: string;
    }
    interface FeeBumpTransactionResponse {
        hash: string;
        signatures: string[];
    }
    interface InnerTransactionResponse {
        hash: string;
        signatures: string[];
        max_fee: string;
    }
    interface TransactionPreconditions {
        timebounds?: {
            min_time: string;
            max_time: string;
        };
        ledgerbounds?: {
            min_ledger: number;
            max_ledger: number;
        };
        min_account_sequence?: string;
        min_account_sequence_age?: string;
        min_account_sequence_ledger_gap?: number;
        extra_signers?: string[];
    }
    interface TransactionResponse extends SubmitTransactionResponse, BaseResponse<"account" | "ledger" | "operations" | "effects" | "succeeds" | "precedes"> {
        created_at: string;
        fee_meta_xdr: string;
        fee_charged: number | string;
        max_fee: number | string;
        id: string;
        memo_type: MemoType;
        memo?: string;
        memo_bytes?: string;
        operation_count: number;
        paging_token: string;
        signatures: string[];
        source_account: string;
        source_account_sequence: string;
        fee_account: string;
        inner_transaction?: InnerTransactionResponse;
        fee_bump_transaction?: FeeBumpTransactionResponse;
        preconditions?: TransactionPreconditions;
    }
    interface BalanceLineNative {
        balance: string;
        asset_type: AssetType.native;
        buying_liabilities: string;
        selling_liabilities: string;
    }
    interface BalanceLineLiquidityPool {
        liquidity_pool_id: string;
        asset_type: AssetType.liquidityPoolShares;
        balance: string;
        limit: string;
        last_modified_ledger: number;
        is_authorized: boolean;
        is_authorized_to_maintain_liabilities: boolean;
        is_clawback_enabled: boolean;
        sponsor?: string;
    }
    interface BalanceLineAsset<T extends AssetType.credit4 | AssetType.credit12 = AssetType.credit4 | AssetType.credit12> {
        balance: string;
        limit: string;
        asset_type: T;
        asset_code: string;
        asset_issuer: string;
        buying_liabilities: string;
        selling_liabilities: string;
        last_modified_ledger: number;
        is_authorized: boolean;
        is_authorized_to_maintain_liabilities: boolean;
        is_clawback_enabled: boolean;
        sponsor?: string;
    }
    type BalanceLine<T extends AssetType = AssetType> = T extends AssetType.native ? BalanceLineNative : T extends AssetType.credit4 | AssetType.credit12 ? BalanceLineAsset<T> : T extends AssetType.liquidityPoolShares ? BalanceLineLiquidityPool : BalanceLineNative | BalanceLineAsset | BalanceLineLiquidityPool;
    interface AssetAccounts {
        authorized: number;
        authorized_to_maintain_liabilities: number;
        unauthorized: number;
    }
    interface AssetBalances {
        authorized: string;
        authorized_to_maintain_liabilities: string;
        unauthorized: string;
    }
    interface PriceR {
        numerator: number;
        denominator: number;
    }
    interface PriceRShorthand {
        n: number;
        d: number;
    }
    interface AccountThresholds {
        low_threshold: number;
        med_threshold: number;
        high_threshold: number;
    }
    interface Flags {
        auth_immutable: boolean;
        auth_required: boolean;
        auth_revocable: boolean;
        auth_clawback_enabled: boolean;
    }
    interface AccountSigner {
        key: string;
        weight: number;
        type: string;
        sponsor?: string;
    }
    interface AccountResponse extends BaseResponse<"transactions" | "operations" | "payments" | "effects" | "offers" | "trades" | "data"> {
        id: string;
        paging_token: string;
        account_id: string;
        sequence: string;
        sequence_ledger?: number;
        sequence_time?: string;
        subentry_count: number;
        thresholds: AccountThresholds;
        last_modified_ledger: number;
        last_modified_time: string;
        flags: Flags;
        balances: BalanceLine[];
        signers: AccountSigner[];
        data: {
            [key: string]: string;
        };
        sponsor?: string;
        num_sponsoring: number;
        num_sponsored: number;
    }
    enum LiquidityPoolType {
        constantProduct = "constant_product"
    }
    enum OperationResponseType {
        createAccount = "create_account",
        payment = "payment",
        pathPayment = "path_payment_strict_receive",
        createPassiveOffer = "create_passive_sell_offer",
        manageOffer = "manage_sell_offer",
        setOptions = "set_options",
        changeTrust = "change_trust",
        allowTrust = "allow_trust",
        accountMerge = "account_merge",
        inflation = "inflation",
        manageData = "manage_data",
        bumpSequence = "bump_sequence",
        manageBuyOffer = "manage_buy_offer",
        pathPaymentStrictSend = "path_payment_strict_send",
        createClaimableBalance = "create_claimable_balance",
        claimClaimableBalance = "claim_claimable_balance",
        beginSponsoringFutureReserves = "begin_sponsoring_future_reserves",
        endSponsoringFutureReserves = "end_sponsoring_future_reserves",
        revokeSponsorship = "revoke_sponsorship",
        clawback = "clawback",
        clawbackClaimableBalance = "clawback_claimable_balance",
        setTrustLineFlags = "set_trust_line_flags",
        liquidityPoolDeposit = "liquidity_pool_deposit",
        liquidityPoolWithdraw = "liquidity_pool_withdraw",
        invokeHostFunction = "invoke_host_function",
        bumpFootprintExpiration = "bump_footprint_expiration",
        restoreFootprint = "restore_footprint"
    }
    enum OperationResponseTypeI {
        createAccount = 0,
        payment = 1,
        pathPayment = 2,
        createPassiveOffer = 3,
        manageOffer = 4,
        setOptions = 5,
        changeTrust = 6,
        allowTrust = 7,
        accountMerge = 8,
        inflation = 9,
        manageData = 10,
        bumpSequence = 11,
        manageBuyOffer = 12,
        pathPaymentStrictSend = 13,
        createClaimableBalance = 14,
        claimClaimableBalance = 15,
        beginSponsoringFutureReserves = 16,
        endSponsoringFutureReserves = 17,
        revokeSponsorship = 18,
        clawback = 19,
        clawbackClaimableBalance = 20,
        setTrustLineFlags = 21,
        liquidityPoolDeposit = 22,
        liquidityPoolWithdraw = 23,
        invokeHostFunction = 24,
        bumpFootprintExpiration = 25,
        restoreFootprint = 26
    }
    interface BaseOperationResponse<T extends OperationResponseType = OperationResponseType, TI extends OperationResponseTypeI = OperationResponseTypeI> extends BaseResponse<"succeeds" | "precedes" | "effects" | "transaction"> {
        id: string;
        paging_token: string;
        source_account: string;
        type: T;
        type_i: TI;
        created_at: string;
        transaction_hash: string;
        transaction_successful: boolean;
    }
    interface CreateAccountOperationResponse extends BaseOperationResponse<OperationResponseType.createAccount, OperationResponseTypeI.createAccount> {
        account: string;
        funder: string;
        starting_balance: string;
    }
    interface PaymentOperationResponse extends BaseOperationResponse<OperationResponseType.payment, OperationResponseTypeI.payment> {
        from: string;
        to: string;
        asset_type: AssetType;
        asset_code?: string;
        asset_issuer?: string;
        amount: string;
    }
    interface PathPaymentOperationResponse extends BaseOperationResponse<OperationResponseType.pathPayment, OperationResponseTypeI.pathPayment> {
        amount: string;
        asset_code?: string;
        asset_issuer?: string;
        asset_type: AssetType;
        from: string;
        path: Array<{
            asset_code: string;
            asset_issuer: string;
            asset_type: AssetType;
        }>;
        source_amount: string;
        source_asset_code?: string;
        source_asset_issuer?: string;
        source_asset_type: AssetType;
        source_max: string;
        to: string;
    }
    interface PathPaymentStrictSendOperationResponse extends BaseOperationResponse<OperationResponseType.pathPaymentStrictSend, OperationResponseTypeI.pathPaymentStrictSend> {
        amount: string;
        asset_code?: string;
        asset_issuer?: string;
        asset_type: AssetType;
        destination_min: string;
        from: string;
        path: Array<{
            asset_code: string;
            asset_issuer: string;
            asset_type: AssetType;
        }>;
        source_amount: string;
        source_asset_code?: string;
        source_asset_issuer?: string;
        source_asset_type: AssetType;
        to: string;
    }
    interface ManageOfferOperationResponse extends BaseOperationResponse<OperationResponseType.manageOffer, OperationResponseTypeI.manageOffer> {
        offer_id: number | string;
        amount: string;
        buying_asset_type: AssetType;
        buying_asset_code?: string;
        buying_asset_issuer?: string;
        price: string;
        price_r: PriceR;
        selling_asset_type: AssetType;
        selling_asset_code?: string;
        selling_asset_issuer?: string;
    }
    interface PassiveOfferOperationResponse extends BaseOperationResponse<OperationResponseType.createPassiveOffer, OperationResponseTypeI.createPassiveOffer> {
        offer_id: number | string;
        amount: string;
        buying_asset_type: AssetType;
        buying_asset_code?: string;
        buying_asset_issuer?: string;
        price: string;
        price_r: PriceR;
        selling_asset_type: AssetType;
        selling_asset_code?: string;
        selling_asset_issuer?: string;
    }
    interface SetOptionsOperationResponse extends BaseOperationResponse<OperationResponseType.setOptions, OperationResponseTypeI.setOptions> {
        signer_key?: string;
        signer_weight?: number;
        master_key_weight?: number;
        low_threshold?: number;
        med_threshold?: number;
        high_threshold?: number;
        home_domain?: string;
        set_flags: Array<1 | 2 | 4>;
        set_flags_s: Array<"auth_required_flag" | "auth_revocable_flag" | "auth_clawback_enabled_flag">;
        clear_flags: Array<1 | 2 | 4>;
        clear_flags_s: Array<"auth_required_flag" | "auth_revocable_flag" | "auth_clawback_enabled_flag">;
    }
    interface ChangeTrustOperationResponse extends BaseOperationResponse<OperationResponseType.changeTrust, OperationResponseTypeI.changeTrust> {
        asset_type: AssetType.credit4 | AssetType.credit12 | AssetType.liquidityPoolShares;
        asset_code?: string;
        asset_issuer?: string;
        liquidity_pool_id?: string;
        trustee?: string;
        trustor: string;
        limit: string;
    }
    interface AllowTrustOperationResponse extends BaseOperationResponse<OperationResponseType.allowTrust, OperationResponseTypeI.allowTrust> {
        asset_type: AssetType;
        asset_code: string;
        asset_issuer: string;
        authorize: boolean;
        authorize_to_maintain_liabilities: boolean;
        trustee: string;
        trustor: string;
    }
    interface AccountMergeOperationResponse extends BaseOperationResponse<OperationResponseType.accountMerge, OperationResponseTypeI.accountMerge> {
        into: string;
    }
    interface InflationOperationResponse extends BaseOperationResponse<OperationResponseType.inflation, OperationResponseTypeI.inflation> {
    }
    interface ManageDataOperationResponse extends BaseOperationResponse<OperationResponseType.manageData, OperationResponseTypeI.manageData> {
        name: string;
        value: Buffer;
    }
    interface BumpSequenceOperationResponse extends BaseOperationResponse<OperationResponseType.bumpSequence, OperationResponseTypeI.bumpSequence> {
        bump_to: string;
    }
    interface Predicate {
        and?: Predicate[];
        or?: Predicate[];
        not?: Predicate;
        abs_before?: string;
        rel_before?: string;
    }
    interface Claimant {
        destination: string;
        predicate: Predicate;
    }
    interface CreateClaimableBalanceOperationResponse extends BaseOperationResponse<OperationResponseType.createClaimableBalance, OperationResponseTypeI.createClaimableBalance> {
        asset: string;
        amount: string;
        sponsor: string;
        claimants: Claimant[];
    }
    interface ClaimClaimableBalanceOperationResponse extends BaseOperationResponse<OperationResponseType.claimClaimableBalance, OperationResponseTypeI.claimClaimableBalance> {
        balance_id: string;
        claimant: string;
    }
    interface BeginSponsoringFutureReservesOperationResponse extends BaseOperationResponse<OperationResponseType.beginSponsoringFutureReserves, OperationResponseTypeI.beginSponsoringFutureReserves> {
        sponsored_id: string;
    }
    interface EndSponsoringFutureReservesOperationResponse extends BaseOperationResponse<OperationResponseType.endSponsoringFutureReserves, OperationResponseTypeI.endSponsoringFutureReserves> {
        begin_sponsor: string;
    }
    interface RevokeSponsorshipOperationResponse extends BaseOperationResponse<OperationResponseType.revokeSponsorship, OperationResponseTypeI.revokeSponsorship> {
        account_id?: string;
        claimable_balance_id?: string;
        data_account_id?: string;
        data_name?: string;
        offer_id?: string;
        trustline_account_id?: string;
        trustline_asset?: string;
        trustline_liquidity_pool_id?: string;
        signer_account_id?: string;
        signer_key?: string;
    }
    interface ClawbackOperationResponse extends BaseOperationResponse<OperationResponseType.clawback, OperationResponseTypeI.clawback> {
        asset_type: AssetType;
        asset_code: string;
        asset_issuer: string;
        from: string;
        amount: string;
    }
    interface ClawbackClaimableBalanceOperationResponse extends BaseOperationResponse<OperationResponseType.clawbackClaimableBalance, OperationResponseTypeI.clawbackClaimableBalance> {
        balance_id: string;
    }
    interface SetTrustLineFlagsOperationResponse extends BaseOperationResponse<OperationResponseType.setTrustLineFlags, OperationResponseTypeI.setTrustLineFlags> {
        asset_type: AssetType;
        asset_code: string;
        asset_issuer: string;
        trustor: string;
        set_flags: Array<1 | 2 | 4>;
        clear_flags: Array<1 | 2 | 4>;
    }
    interface Reserve {
        asset: string;
        amount: string;
    }
    interface DepositLiquidityOperationResponse extends BaseOperationResponse<OperationResponseType.liquidityPoolDeposit, OperationResponseTypeI.liquidityPoolDeposit> {
        liquidity_pool_id: string;
        reserves_max: Reserve[];
        min_price: string;
        min_price_r: PriceRShorthand;
        max_price: string;
        max_price_r: PriceRShorthand;
        reserves_deposited: Reserve[];
        shares_received: string;
    }
    interface WithdrawLiquidityOperationResponse extends BaseOperationResponse<OperationResponseType.liquidityPoolWithdraw, OperationResponseTypeI.liquidityPoolWithdraw> {
        liquidity_pool_id: string;
        reserves_min: Reserve[];
        shares: string;
        reserves_received: Reserve[];
    }
    interface BalanceChange {
        asset_type: string;
        asset_code?: string;
        asset_issuer?: string;
        type: string;
        from: string;
        to: string;
        amount: string;
    }
    interface InvokeHostFunctionOperationResponse extends BaseOperationResponse<OperationResponseType.invokeHostFunction, OperationResponseTypeI.invokeHostFunction> {
        function: string;
        parameters: {
            value: string;
            type: string;
        }[];
        address: string;
        salt: string;
        asset_balance_changes: BalanceChange[];
    }
    interface BumpFootprintExpirationOperationResponse extends BaseOperationResponse<OperationResponseType.bumpFootprintExpiration, OperationResponseTypeI.bumpFootprintExpiration> {
        ledgers_to_expire: number;
    }
    interface RestoreFootprintOperationResponse extends BaseOperationResponse<OperationResponseType.restoreFootprint, OperationResponseTypeI.restoreFootprint> {
    }
    interface ResponseCollection<T extends BaseResponse = BaseResponse> {
        _links: {
            self: ResponseLink;
            next: ResponseLink;
            prev: ResponseLink;
        };
        _embedded: {
            records: T[];
        };
    }
    interface TransactionResponseCollection extends ResponseCollection<TransactionResponse> {
    }
    interface FeeDistribution {
        max: string;
        min: string;
        mode: string;
        p10: string;
        p20: string;
        p30: string;
        p40: string;
        p50: string;
        p60: string;
        p70: string;
        p80: string;
        p90: string;
        p95: string;
        p99: string;
    }
    interface FeeStatsResponse {
        last_ledger: string;
        last_ledger_base_fee: string;
        ledger_capacity_usage: string;
        fee_charged: FeeDistribution;
        max_fee: FeeDistribution;
    }
    type ErrorResponseData = ErrorResponseData.RateLimitExceeded | ErrorResponseData.InternalServerError | ErrorResponseData.TransactionFailed;
    namespace ErrorResponseData {
        interface Base {
            status: number;
            title: string;
            type: string;
            details: string;
            instance: string;
        }
        interface RateLimitExceeded extends Base {
            status: 429;
            title: "Rate Limit Exceeded";
        }
        interface InternalServerError extends Base {
            status: 500;
            title: "Internal Server Error";
        }
        interface TransactionFailed extends Base {
            status: 400;
            title: "Transaction Failed";
            extras: TransactionFailedExtras;
        }
    }
    enum TransactionFailedResultCodes {
        TX_FAILED = "tx_failed",
        TX_BAD_SEQ = "tx_bad_seq",
        TX_BAD_AUTH = "tx_bad_auth",
        TX_BAD_AUTH_EXTRA = "tx_bad_auth_extra",
        TX_FEE_BUMP_INNER_SUCCESS = "tx_fee_bump_inner_success",
        TX_FEE_BUMP_INNER_FAILED = "tx_fee_bump_inner_failed",
        TX_NOT_SUPPORTED = "tx_not_supported",
        TX_SUCCESS = "tx_success",
        TX_TOO_EARLY = "tx_too_early",
        TX_TOO_LATE = "tx_too_late",
        TX_MISSING_OPERATION = "tx_missing_operation",
        TX_INSUFFICIENT_BALANCE = "tx_insufficient_balance",
        TX_NO_SOURCE_ACCOUNT = "tx_no_source_account",
        TX_INSUFFICIENT_FEE = "tx_insufficient_fee",
        TX_INTERNAL_ERROR = "tx_internal_error"
    }
    interface TransactionFailedExtras {
        envelope_xdr: string;
        result_codes: {
            transaction: TransactionFailedResultCodes;
            operations: string[];
        };
        result_xdr: string;
    }
}
