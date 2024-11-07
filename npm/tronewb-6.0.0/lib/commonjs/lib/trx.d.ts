import { TronWeb } from '../tronweb.js';
import { Block } from '../types/APIResponse.js';
import { Token, Account, Witness, TransactionSignWeight, BroadcastReturn, AddressOptions, Proposal, ChainParameter, BroadcastHexReturn, AccountResourceMessage, Address, Exchange, TransactionInfo } from '../types/Trx.js';
import { SignedTransaction, Transaction } from '../types/Transaction.js';
import { TypedDataDomain, TypedDataField } from '../utils/typedData.js';
import { Resource } from '../types/TransactionBuilder.js';
type SignedStringOrSignedTransaction<T extends string | Transaction | SignedTransaction> = T extends string ? string : SignedTransaction & T;
export declare class Trx {
    private tronWeb;
    private cache;
    private validator;
    signMessage: <T extends SignedTransaction | Transaction | string>(transaction: T, privateKey?: string | false, useTronHeader?: boolean, multisig?: boolean) => Promise<SignedStringOrSignedTransaction<T>>;
    sendAsset: (to: string, amount: number, tokenID: string | number, options?: AddressOptions) => Promise<BroadcastReturn<SignedTransaction>>;
    send: (to: string, amount: number, options?: AddressOptions) => Promise<BroadcastReturn<SignedTransaction>>;
    sendTrx: (to: string, amount: number, options?: AddressOptions) => Promise<BroadcastReturn<SignedTransaction>>;
    broadcast: <T extends SignedTransaction>(signedTransaction: T) => Promise<BroadcastReturn<T>>;
    broadcastHex: (signedHexTransaction: string) => Promise<BroadcastHexReturn | {
        transaction: Transaction;
        hexTransaction: string;
        result: boolean;
        txid: string;
        code: string;
        message: string;
    }>;
    signTransaction: <T extends SignedTransaction | Transaction | string>(transaction: T, privateKey?: string | false, useTronHeader?: boolean, multisig?: boolean) => Promise<SignedStringOrSignedTransaction<T>>;
    constructor(tronWeb: TronWeb);
    _parseToken(token: any): Token;
    getCurrentBlock(): Promise<Block>;
    getConfirmedCurrentBlock(): Promise<Block>;
    getBlock(block?: 'earliest' | 'latest' | number | string | false): Promise<Block>;
    getBlockByHash(blockHash: string): Promise<Block>;
    getBlockByNumber(blockID: number): Promise<Block>;
    getBlockTransactionCount(block?: 'earliest' | 'latest' | number | string | false): Promise<number>;
    getTransactionFromBlock(block: ("earliest" | "latest" | number | string | false) | undefined, index: number): Promise<Transaction>;
    getTransactionsFromBlock(block?: 'earliest' | 'latest' | number | string | false): Promise<Transaction[]>;
    getTransaction(transactionID: string): Promise<Transaction>;
    getConfirmedTransaction(transactionID: string): Promise<Transaction>;
    getUnconfirmedTransactionInfo(transactionID: string): Promise<TransactionInfo>;
    getTransactionInfo(transactionID: string): Promise<TransactionInfo>;
    getTransactionsToAddress(address?: string | false, limit?: number, offset?: number): Promise<Transaction[]>;
    getTransactionsFromAddress(address?: string | false, limit?: number, offset?: number): Promise<Transaction[]>;
    getTransactionsRelated(address?: string | false, direction?: string, limit?: number, offset?: number): Promise<Transaction[]>;
    getAccount(address?: string | false): Promise<Account>;
    getAccountById(id: string): Promise<Account>;
    getAccountInfoById(id: string, options: {
        confirmed: boolean;
    }): Promise<Account>;
    getBalance(address?: string | false): Promise<number>;
    getUnconfirmedAccount(address?: string | false): Promise<Account>;
    getUnconfirmedAccountById(id: string): Promise<Account>;
    getUnconfirmedBalance(address?: string | false): Promise<number>;
    getBandwidth(address?: string | false): Promise<number>;
    getTokensIssuedByAddress(address?: string | false): Promise<Record<string, Token>>;
    getTokenFromID(tokenID: string | number): Promise<Token>;
    listNodes(): Promise<string[]>;
    getBlockRange(start?: number, end?: number): Promise<Block[]>;
    listSuperRepresentatives(): Promise<Witness[]>;
    listTokens(limit?: number, offset?: number): Promise<Token[]>;
    timeUntilNextVoteCycle(): Promise<number>;
    getContract(contractAddress: string): Promise<any>;
    ecRecover(transaction: SignedTransaction): string | string[];
    static ecRecover(transaction: SignedTransaction): Address | Address[];
    verifyMessage(message: string, signature: string, address?: string | false, useTronHeader?: boolean): Promise<boolean>;
    static verifySignature(message: string, address: string, signature: string, useTronHeader?: boolean): boolean;
    verifyMessageV2(message: string | Uint8Array | Array<number>, signature: string): Promise<string>;
    static verifyMessageV2(message: string | Uint8Array | Array<number>, signature: string): string;
    verifyTypedData(domain: TypedDataDomain, types: Record<string, TypedDataField[]>, value: Record<string, any>, signature: string, address?: string | false): boolean;
    static verifyTypedData(domain: TypedDataDomain, types: Record<string, TypedDataField[]>, value: Record<string, any>, signature: string, address: string): boolean;
    sign<T extends SignedTransaction | Transaction | string>(transaction: T, privateKey?: string | false, useTronHeader?: boolean, multisig?: boolean): Promise<SignedStringOrSignedTransaction<T>>;
    static signString(message: string, privateKey: string, useTronHeader?: boolean): string;
    /**
     * sign message v2 for verified header length
     *
     * @param {message to be signed, should be Bytes or string} message
     * @param {privateKey for signature} privateKey
     * @param {reserved} options
     */
    signMessageV2(message: string | Uint8Array | Array<number>, privateKey?: string | false): string;
    static signMessageV2(message: string | Uint8Array | Array<number>, privateKey: string): string;
    _signTypedData(domain: TypedDataDomain, types: Record<string, TypedDataField[]>, value: Record<string, any>, privateKey?: string | false): string;
    static _signTypedData(domain: TypedDataDomain, types: Record<string, TypedDataField[]>, value: Record<string, any>, privateKey: string): string;
    multiSign(transaction: Transaction, privateKey?: string | false, permissionId?: number): Promise<SignedTransaction<import("../types/Contract.js").ContractParamter>>;
    getApprovedList(transaction: Transaction): Promise<{
        approved_list: string[];
    }>;
    getSignWeight(transaction: Transaction, permissionId?: number): Promise<TransactionSignWeight>;
    sendRawTransaction<T extends SignedTransaction>(signedTransaction: T): Promise<BroadcastReturn<T>>;
    sendHexTransaction(signedHexTransaction: string): Promise<BroadcastHexReturn | {
        transaction: Transaction;
        hexTransaction: string;
        result: boolean;
        txid: string;
        code: string;
        message: string;
    }>;
    sendTransaction(to: string, amount: number, options?: AddressOptions): Promise<BroadcastReturn<SignedTransaction>>;
    sendToken(to: string, amount: number, tokenID: string | number, options?: AddressOptions): Promise<BroadcastReturn<SignedTransaction>>;
    /**
     * Freezes an amount of TRX.
     * Will give bandwidth OR Energy and TRON Power(voting rights)
     * to the owner of the frozen tokens.
     *
     * @param amount - is the number of frozen trx
     * @param duration - is the duration in days to be frozen
     * @param resource - is the type, must be either "ENERGY" or "BANDWIDTH"
     * @param options
     */
    freezeBalance(amount?: number, duration?: number, resource?: Resource, options?: AddressOptions, receiverAddress?: string): Promise<BroadcastReturn<SignedTransaction>>;
    /**
     * Unfreeze TRX that has passed the minimum freeze duration.
     * Unfreezing will remove bandwidth and TRON Power.
     *
     * @param resource - is the type, must be either "ENERGY" or "BANDWIDTH"
     * @param options
     */
    unfreezeBalance(resource: Resource | undefined, options: AddressOptions | undefined, receiverAddress: string): Promise<BroadcastReturn<SignedTransaction>>;
    /**
     * Modify account name
     * Note: Username is allowed to edit only once.
     *
     * @param privateKey - Account private Key
     * @param accountName - name of the account
     *
     * @return modified Transaction Object
     */
    updateAccount(accountName: string, options?: AddressOptions): Promise<BroadcastReturn<SignedTransaction>>;
    /**
     * Gets a network modification proposal by ID.
     */
    getProposal(proposalID: number): Promise<Proposal>;
    /**
     * Lists all network modification proposals.
     */
    listProposals(): Promise<Proposal[]>;
    /**
     * Lists all parameters available for network modification proposals.
     */
    getChainParameters(): Promise<ChainParameter[]>;
    /**
     * Get the account resources
     */
    getAccountResources(address?: string | false): Promise<AccountResourceMessage>;
    /**
     * Query the amount of resources of a specific resourceType delegated by fromAddress to toAddress
     */
    getDelegatedResourceV2(fromAddress?: string | false, toAddress?: string | false, options?: {
        confirmed: boolean;
    }): Promise<{
        delegatedResource: {
            from: string;
            to: string;
            frozen_balance_for_bandwidth: number;
            frozen_balance_for_energy: number;
            expire_time_for_bandwidth: number;
            expire_time_for_energy: number;
        };
    }>;
    /**
     * Query the resource delegation index by an account
     */
    getDelegatedResourceAccountIndexV2(address?: string | false, options?: {
        confirmed: boolean;
    }): Promise<{
        account: Address;
        fromAccounts: Address[];
        toAccounts: Address[];
    }>;
    /**
     * Query the amount of delegatable resources of the specified resource Type for target address, unit is sun.
     */
    getCanDelegatedMaxSize(address?: string | false, resource?: Resource, options?: {
        confirmed: boolean;
    }): Promise<{
        max_size: number;
    }>;
    /**
     * Remaining times of available unstaking API
     */
    getAvailableUnfreezeCount(address?: string | false, options?: {
        confirmed: boolean;
    }): Promise<{
        count: number;
    }>;
    /**
     * Query the withdrawable balance at the specified timestamp
     */
    getCanWithdrawUnfreezeAmount(address?: string | false, timestamp?: number, options?: {
        confirmed: boolean;
    }): Promise<{
        amount: number;
    }>;
    /**
     * Get the exchange ID.
     */
    getExchangeByID(exchangeID: number): Promise<Exchange>;
    /**
     * Lists the exchanges
     */
    listExchanges(): Promise<Exchange[]>;
    /**
     * Lists all network modification proposals.
     */
    listExchangesPaginated(limit?: number, offset?: number): Promise<Exchange[]>;
    /**
     * Get info about thre node
     */
    getNodeInfo(): Promise<{
        beginSyncNum: number;
        block: string;
        solidityBlock: string;
        currentConnectCount: number;
        activeConnectCount: number;
        passiveConnectCount: number;
        totalFlow: number;
        peerInfoList: {
            lastSyncBlock: string;
            remainNum: number;
            lastBlockUpdateTime: number;
            syncFlag: boolean;
            headBlockTimeWeBothHave: number;
            needSyncFromPeer: boolean;
            needSyncFromUs: boolean;
            host: string;
            port: number;
            nodeId: string;
            connectTime: number;
            avgLatency: number;
            syncToFetchSize: number;
            syncToFetchSizePeekNum: number;
            syncBlockRequestedSize: number;
            unFetchSynNum: number;
            blockInPorcSize: number;
            headBlockWeBothHave: string;
            isActive: boolean;
            score: number;
            nodeCount: number;
            inFlow: number;
            disconnectTimes: number;
            localDisconnectReason: string;
            remoteDisconnectReason: string;
        };
        configNodeInfo: {
            codeVersion: string;
            p2pVersion: string;
            listenPort: number;
            discoverEnable: boolean;
            activeNodeSize: number;
            passiveNodeSize: number;
            sendNodeSize: number;
            maxConnectCount: number;
            sameIpMaxConnectCount: number;
            backupListenPort: number;
            backupMemberSize: number;
            backupPriority: number;
            dbVersion: number;
            minParticipationRate: number;
            supportConstant: boolean;
            minTimeRatio: number;
            maxTimeRatio: number;
            allowCreationOfContracts: number;
            allowAdaptiveEnergy: number;
        };
        machineInfo: {
            threadCount: number;
            deadLockThreadCount: number;
            cpuCount: number;
            totalMemory: number;
            freeMemory: number;
            cpuRate: number;
            javaVersion: string;
            osName: string;
            jvmTotalMemory: number;
            jvmFreeMemory: number;
            processCpuRate: number;
            memoryDescInfoList: {
                name: string;
                initSize: number;
                useSize: number;
                maxSize: number;
                useRate: number;
            };
            deadLockThreadInfoList: {
                name: string;
                lockName: string;
                lockOwner: string;
                state: string;
                blockTime: number;
                waitTime: number;
                stackTrace: string;
            };
        };
        cheatWitnessInfoMap: Map<string, string>;
    }>;
    getTokenListByName(tokenID: string | number): Promise<Token | Token[]>;
    getTokenByID(tokenID: number | string): Promise<Token>;
    getReward(address: Address, options?: {
        confirmed?: boolean;
    }): Promise<number>;
    getUnconfirmedReward(address: Address, options?: {
        confirmed?: boolean;
    }): Promise<number>;
    getBrokerage(address: Address, options?: {
        confirmed?: boolean;
    }): Promise<number>;
    getUnconfirmedBrokerage(address: Address, options?: {
        confirmed?: boolean;
    }): Promise<number>;
    _getReward(address: string | false | undefined, options: {
        confirmed?: boolean;
    }): Promise<number>;
    private _getBrokerage;
    getBandwidthPrices(): Promise<string>;
    getEnergyPrices(): Promise<string>;
}
export {};
