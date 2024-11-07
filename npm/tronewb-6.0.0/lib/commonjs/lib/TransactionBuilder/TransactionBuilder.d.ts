import { TronWeb } from '../../tronweb.js';
import { CreateSmartContractTransaction, SignedTransaction, Transaction, TransactionWrapper } from '../../types/Transaction.js';
import { AccountCreateContract, AccountPermissionUpdateContract, AccountUpdateContract, AssetIssueContract, CancelFreezeBalanceV2Contract, ClearABIContract, ContractParamter, DelegateResourceContract, ExchangeCreateContract, ExchangeInjectContract, ExchangeTransactionContract, ExchangeWithdrawContract, FreezeBalanceContract, FreezeBalanceV2Contract, ParticipateAssetIssueContract, Permission, ProposalCreateContract, ProposalDeleteContract, SetAccountIdContract, TransferAssetContract, TransferContract, TriggerSmartContract, UnDelegateResourceContract, UnfreezeBalanceContract, UnfreezeBalanceV2Contract, UpdateAssetContract, UpdateBrokerageContract, UpdateEnergyLimitContract, UpdateSettingContract, VoteProposalContract, VoteWitnessContract, WithdrawBalanceContract, WithdrawExpireUnfreezeContract, WitnessCreateContract } from '../../types/Contract.js';
import { AlterTransactionOptions, CreateSmartContractOptions, CreateTokenOptions, DeployConstantContractOptions, TriggerConstantContractOptions, TransactionCommonOptions, Resource, ContractFunctionParameter, TriggerSmartContractOptions, TxLocal, UpdateTokenOptions, VoteInfo } from '../../types/TransactionBuilder.js';
interface IArgs extends TriggerSmartContract {
    function_selector?: string;
    parameter?: string;
    fee_limit?: number;
    Permission_id?: number;
}
export declare class TransactionBuilder {
    private tronWeb;
    private validator;
    constructor(tronWeb?: TronWeb);
    sendTrx(to: string, amount?: number, from?: string, options?: TransactionCommonOptions): Promise<Transaction<TransferContract>>;
    sendToken(to: string, amount: number | undefined, tokenId: string, from?: string, options?: TransactionCommonOptions): Promise<Transaction<TransferAssetContract>>;
    purchaseToken(issuerAddress: string, tokenId: string, amount?: number, buyer?: string, options?: TransactionCommonOptions): Promise<Transaction<ParticipateAssetIssueContract>>;
    freezeBalance(amount?: number, duration?: number, resource?: Resource, ownerAddress?: string, receiverAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<FreezeBalanceContract>>;
    unfreezeBalance(resource?: Resource, address?: string, receiverAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<UnfreezeBalanceContract>>;
    freezeBalanceV2(amount?: number, resource?: Resource, address?: string, options?: TransactionCommonOptions): Promise<Transaction<FreezeBalanceV2Contract>>;
    unfreezeBalanceV2(amount?: number, resource?: Resource, address?: string, options?: TransactionCommonOptions): Promise<Transaction<UnfreezeBalanceV2Contract>>;
    cancelUnfreezeBalanceV2(address?: string, options?: TransactionCommonOptions): Promise<Transaction<CancelFreezeBalanceV2Contract>>;
    delegateResource(amount: number | undefined, receiverAddress: string, resource?: Resource, address?: string, lock?: boolean, lockPeriod?: number, options?: TransactionCommonOptions): Promise<Transaction<DelegateResourceContract>>;
    undelegateResource(amount: number | undefined, receiverAddress: string, resource?: Resource, address?: string, options?: TransactionCommonOptions): Promise<Transaction<UnDelegateResourceContract>>;
    withdrawExpireUnfreeze(address?: string, options?: TransactionCommonOptions): Promise<Transaction<WithdrawExpireUnfreezeContract>>;
    withdrawBlockRewards(address?: string, options?: TransactionCommonOptions): Promise<Transaction<WithdrawBalanceContract>>;
    applyForSR(address?: string, url?: string, options?: TransactionCommonOptions): Promise<Transaction<WitnessCreateContract>>;
    vote(votes?: VoteInfo, voterAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<VoteWitnessContract>>;
    createSmartContract(options?: CreateSmartContractOptions, issuerAddress?: string): Promise<CreateSmartContractTransaction>;
    triggerSmartContract(contractAddress: string, functionSelector: string, options?: TriggerSmartContractOptions, parameters?: ContractFunctionParameter[], issuerAddress?: string): Promise<TransactionWrapper>;
    triggerConstantContract(contractAddress: string, functionSelector: string, options?: TriggerConstantContractOptions, parameters?: ContractFunctionParameter[], issuerAddress?: string): Promise<TransactionWrapper>;
    triggerConfirmedConstantContract(contractAddress: string, functionSelector: string, options?: TriggerConstantContractOptions, parameters?: ContractFunctionParameter[], issuerAddress?: string): Promise<TransactionWrapper>;
    estimateEnergy(contractAddress: string, functionSelector: string, options?: TriggerConstantContractOptions, parameters?: ContractFunctionParameter[], issuerAddress?: string): Promise<{
        result: {
            result: boolean;
        };
        energy_required: number;
    }>;
    deployConstantContract(options?: DeployConstantContractOptions): Promise<{
        result: {
            result: boolean;
        };
        energy_required: number;
    }>;
    _getTriggerSmartContractArgs(contractAddress: string, functionSelector: string, options: TriggerConstantContractOptions, parameters: ContractFunctionParameter[], issuerAddress: string, tokenValue?: number, tokenId?: string, callValue?: number, feeLimit?: number): IArgs;
    _triggerSmartContractLocal(contractAddress: string, functionSelector: string, options?: TriggerConstantContractOptions, parameters?: ContractFunctionParameter[], issuerAddress?: string): Promise<{
        result: {
            result: boolean;
        };
        transaction: Transaction<TriggerSmartContract>;
    }>;
    _triggerSmartContract(contractAddress: string, functionSelector: string, options?: TriggerConstantContractOptions, parameters?: ContractFunctionParameter[], issuerAddress?: string): Promise<TransactionWrapper>;
    clearABI(contractAddress: string, ownerAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<ClearABIContract>>;
    updateBrokerage(brokerage: number, ownerAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<UpdateBrokerageContract>>;
    createToken(options?: CreateTokenOptions, issuerAddress?: string): Promise<Transaction<AssetIssueContract>>;
    createAccount(accountAddress: string, address?: string, options?: TransactionCommonOptions): Promise<Transaction<AccountCreateContract>>;
    updateAccount(accountName: string, address?: string, options?: TransactionCommonOptions): Promise<Transaction<AccountUpdateContract>>;
    setAccountId(accountId: string, address?: string, options?: TransactionCommonOptions): Promise<Transaction<SetAccountIdContract>>;
    updateToken(options?: UpdateTokenOptions, issuerAddress?: string): Promise<Transaction<UpdateAssetContract>>;
    sendAsset(to: string, amount: number | undefined, tokenId: string, from?: string, options?: TransactionCommonOptions): Promise<Transaction<TransferAssetContract>>;
    purchaseAsset(issuerAddress: string, tokenId: string, amount?: number, buyer?: string, options?: TransactionCommonOptions): Promise<Transaction<ParticipateAssetIssueContract>>;
    createAsset(options: CreateTokenOptions, issuerAddress: string): Promise<Transaction<AssetIssueContract>>;
    updateAsset(options?: UpdateTokenOptions, issuerAddress?: string): Promise<Transaction<UpdateAssetContract>>;
    /**
     * Creates a proposal to modify the network.
     * Can only be created by a current Super Representative.
     */
    createProposal(parameters: Record<string, string | number> | Record<string, string | number>[], issuerAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<ProposalCreateContract>>;
    /**
     * Deletes a network modification proposal that the owner issued.
     * Only current Super Representative can vote on a proposal.
     */
    deleteProposal(proposalID: number, issuerAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<ProposalDeleteContract>>;
    /**
     * Adds a vote to an issued network modification proposal.
     * Only current Super Representative can vote on a proposal.
     */
    voteProposal(proposalID: number, isApproval?: boolean, voterAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<VoteProposalContract>>;
    /**
     * Create an exchange between a token and TRX.
     * Token Name should be a CASE SENSITIVE string.
     * PLEASE VERIFY THIS ON TRONSCAN.
     */
    createTRXExchange(tokenName: string, tokenBalance: number, trxBalance: number, ownerAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<ExchangeCreateContract>>;
    /**
     * Create an exchange between a token and another token.
     * DO NOT USE THIS FOR TRX.
     * Token Names should be a CASE SENSITIVE string.
     * PLEASE VERIFY THIS ON TRONSCAN.
     */
    createTokenExchange(firstTokenName: string, firstTokenBalance: number, secondTokenName: string, secondTokenBalance: number, ownerAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<ExchangeCreateContract>>;
    /**
     * Adds tokens into a bancor style exchange.
     * Will add both tokens at market rate.
     * Use "_" for the constant value for TRX.
     */
    injectExchangeTokens(exchangeID: number, tokenName: string, tokenAmount: number, ownerAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<ExchangeInjectContract>>;
    /**
     * Withdraws tokens from a bancor style exchange.
     * Will withdraw at market rate both tokens.
     * Use "_" for the constant value for TRX.
     */
    withdrawExchangeTokens(exchangeID: number, tokenName: string, tokenAmount: number, ownerAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<ExchangeWithdrawContract>>;
    /**
     * Trade tokens on a bancor style exchange.
     * Expected value is a validation and used to cap the total amt of token 2 spent.
     * Use "_" for the constant value for TRX.
     */
    tradeExchangeTokens(exchangeID: number, tokenName: string, tokenAmountSold: number, tokenAmountExpected: number, ownerAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<ExchangeTransactionContract>>;
    /**
     * Update userFeePercentage.
     */
    updateSetting(contractAddress: string, userFeePercentage: number, ownerAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<UpdateSettingContract>>;
    /**
     * Update energy limit.
     */
    updateEnergyLimit(contractAddress: string, originEnergyLimit?: number, ownerAddress?: string, options?: TransactionCommonOptions): Promise<Transaction<UpdateEnergyLimitContract>>;
    private checkPermissions;
    updateAccountPermissions(ownerAddress: string | undefined, ownerPermission: Permission, witnessPermission?: Permission, activesPermissions?: Permission | Permission[], options?: TransactionCommonOptions): Promise<Transaction<AccountPermissionUpdateContract>>;
    newTxID<T extends ContractParamter, U extends (SignedTransaction<T> | Transaction<T>)>(transaction: U, options?: {
        txLocal?: boolean;
    }): Promise<U>;
    alterTransaction(transaction: Transaction, options?: AlterTransactionOptions): Promise<Transaction<ContractParamter>>;
    extendExpiration(transaction: Transaction, extension: number, options?: TxLocal): Promise<Transaction<ContractParamter>>;
    addUpdateData(transaction: Transaction, data: string, dataFormat?: 'utf8' | 'hex', options?: TxLocal): Promise<Transaction<ContractParamter>>;
}
export {};
