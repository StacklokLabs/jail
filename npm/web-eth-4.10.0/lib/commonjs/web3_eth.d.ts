import { SupportedProviders, Address, Bytes, FeeData, Filter, HexString32Bytes, HexString8Bytes, Numbers, BlockNumberOrTag, Transaction, TransactionCall, Web3EthExecutionAPI, TransactionWithFromLocalWalletIndex, TransactionWithToLocalWalletIndex, TransactionWithFromAndToLocalWalletIndex, TransactionForAccessList, DataFormat, DEFAULT_RETURN_FORMAT, Eip712TypedData } from 'web3-types';
import { Web3Context, Web3ContextInitOptions } from 'web3-core';
import { SendTransactionOptions, TransactionMiddleware } from './types.js';
import { LogsSubscription, NewPendingTransactionsSubscription, NewHeadsSubscription, SyncingSubscription } from './web3_subscriptions.js';
export declare type RegisteredSubscription = {
    logs: typeof LogsSubscription;
    newPendingTransactions: typeof NewPendingTransactionsSubscription;
    pendingTransactions: typeof NewPendingTransactionsSubscription;
    newHeads: typeof NewHeadsSubscription;
    newBlockHeaders: typeof NewHeadsSubscription;
    syncing: typeof SyncingSubscription;
};
export declare const registeredSubscriptions: {
    logs: typeof LogsSubscription;
    newPendingTransactions: typeof NewPendingTransactionsSubscription;
    newHeads: typeof NewHeadsSubscription;
    syncing: typeof SyncingSubscription;
    pendingTransactions: typeof NewPendingTransactionsSubscription;
    newBlockHeaders: typeof NewHeadsSubscription;
};
/**
 *
 * The Web3Eth allows you to interact with an Ethereum blockchain.
 *
 * For using Web3 Eth functions, first install Web3 package using `npm i web3` or `yarn add web3` based on your package manager usage.
 * After that, Web3 Eth functions will be available as mentioned in following snippet.
 * ```ts
 * import { Web3 } from 'web3';
 * const web3 = new Web3('https://mainnet.infura.io/v3/<YOURPROJID>');
 *
 * const block = await web3.eth.getBlock(0);
 *
 * ```
 *
 * For using individual package install `web3-eth` package using `npm i web3-eth` or `yarn add web3-eth` and only import required functions.
 * This is more efficient approach for building lightweight applications.
 * ```ts
 * import { Web3Eth } from 'web3-eth';
 *
 * const eth = new Web3Eth('https://mainnet.infura.io/v3/<YOURPROJID>');
 * const block = await eth.getBlock(0);
 *
 * ```
 */
export declare class Web3Eth extends Web3Context<Web3EthExecutionAPI, RegisteredSubscription> {
    private transactionMiddleware?;
    constructor(providerOrContext?: SupportedProviders<any> | Web3ContextInitOptions | string);
    setTransactionMiddleware(transactionMiddleware: TransactionMiddleware): void;
    getTransactionMiddleware(): TransactionMiddleware | undefined;
    /**
     * @returns Returns the ethereum protocol version of the node.
     *
     * ```ts
     * web3.eth.getProtocolVersion().then(console.log);
     * > "63"
     * ```
     */
    getProtocolVersion(): Promise<string>;
    /**
     * Checks if the node is currently syncing.
     *
     * @returns Either a {@link SyncingStatusAPI}, or `false`.
     *
     * ```ts
     * web3.eth.isSyncing().then(console.log);
     * > {
     *     startingBlock: 100,
     *     currentBlock: 312,
     *     highestBlock: 512,
     *     knownStates: 234566,
     *     pulledStates: 123455
     * }
     * ```
     */
    isSyncing(): Promise<import("web3-types").SyncingStatusAPI>;
    /**
     * @returns Returns the coinbase address to which mining rewards will go.
     *
     * ```ts
     * web3.eth.getCoinbase().then(console.log);
     * > "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe"
     * ```
     */
    getCoinbase(): Promise<string>;
    /**
     * Checks whether the node is mining or not.
     *
     * @returns `true` if the node is mining, otherwise `false`.
     *
     * ```ts
     * web3.eth.isMining().then(console.log);
     * > true
     * ```
     */
    isMining(): Promise<boolean>;
    /**
     * @deprecated Will be removed in the future, please use {@link Web3Eth.getHashRate} method instead.
     *
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The number of hashes per second that the node is mining with.
     *
     * ```ts
     * web3.eth.getHashrate().then(console.log);
     * > 493736n
     *
     * web3.eth.getHashrate({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
     * > "0x788a8"
     * ```
     */
    getHashrate<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(returnFormat?: ReturnFormat): Promise<import("web3-types").NumberTypes[ReturnFormat["number"]]>;
    /**
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The number of hashes per second that the node is mining with.
     *
     * ```ts
     * web3.eth.getHashRate().then(console.log);
     * > 493736n
     *
     * web3.eth.getHashRate({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
     * > "0x788a8"
     * ```
     */
    getHashRate<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(returnFormat?: ReturnFormat): Promise<import("web3-types").NumberTypes[ReturnFormat["number"]]>;
    /**
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The gas price determined by the last few blocks median gas price.
     *
     * ```ts
     * web3.eth.getGasPrice().then(console.log);
     * > 20000000000n
     *
     * web3.eth.getGasPrice({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
     * > "0x4a817c800"
     * ```
     */
    getGasPrice<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(returnFormat?: ReturnFormat): Promise<import("web3-types").NumberTypes[ReturnFormat["number"]]>;
    /**
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns the current maxPriorityFeePerGas per gas in wei.
     *
     * ```ts
     * web3.eth.getMaxPriorityFeePerGas().then(console.log);
     * > 20000000000n
     *
     * web3.eth.getMaxPriorityFeePerGas({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
     * > "0x4a817c800"
     * ```
     */
    getMaxPriorityFeePerGas<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(returnFormat?: ReturnFormat): Promise<import("web3-types").NumberTypes[ReturnFormat["number"]]>;
    /**
     * Calculates the current Fee Data.
     * If the node supports EIP-1559, then `baseFeePerGas` and `maxPriorityFeePerGas` will be returned along with the calculated `maxFeePerGas` value.
     * `maxFeePerGas` is calculated as `baseFeePerGas` * `baseFeePerGasFactor` + `maxPriorityFeePerGas`.
     * If the node does not support EIP-1559, then the `gasPrice` will be returned and the other values will be undefined.
     *
     * @param baseFeePerGasFactor (optional) The factor to multiply the `baseFeePerGas` with when calculating `maxFeePerGas`, if the node supports EIP-1559. The default value is 2.
     * @param alternativeMaxPriorityFeePerGas (optional) The alternative `maxPriorityFeePerGas` to use when calculating `maxFeePerGas`, if the node supports EIP-1559, but does not support the method `eth_maxPriorityFeePerGas`. The default value is 1 gwei.
     * @returns The current fee data.
     *
     * ```ts
     * web3.eth.calculateFeeData().then(console.log);
     * > {
     *     gasPrice: 20000000000n,
     *     maxFeePerGas: 60000000000n,
     *     maxPriorityFeePerGas: 20000000000n,
     *     baseFeePerGas: 20000000000n
     * }
     *
     * web3.eth.calculateFeeData(1n).then(console.log);
     * > {
     *     gasPrice: 20000000000n,
     *     maxFeePerGas: 40000000000n,
     *     maxPriorityFeePerGas: 20000000000n,
     *     baseFeePerGas: 20000000000n
     * }
     *
     * web3.eth.calculateFeeData(3n).then(console.log);
     * > {
     *     gasPrice: 20000000000n,
     *     maxFeePerGas: 80000000000n,
     *     maxPriorityFeePerGas: 20000000000n,
     *     baseFeePerGas: 20000000000n
     * }
     * ```
     */
    calculateFeeData(baseFeePerGasFactor?: bigint, alternativeMaxPriorityFeePerGas?: bigint): Promise<FeeData>;
    getFeeData: (baseFeePerGasFactor?: bigint, alternativeMaxPriorityFeePerGas?: bigint) => Promise<FeeData>;
    /**
     * @returns A list of accounts the node controls (addresses are checksummed).
     *
     * ```ts
     * web3.eth.getAccounts().then(console.log);
     * > ["0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "0xDCc6960376d6C6dEa93647383FfB245CfCed97Cf"]
     * ```
     */
    getAccounts(): Promise<string[]>;
    /**
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The current block number.
     *
     * ```ts
     * web3.eth.getBlockNumber().then(console.log);
     * > 2744n
     *
     * web3.eth.getBlockNumber({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
     * > "0xab8"
     * ```
     */
    getBlockNumber<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(returnFormat?: ReturnFormat): Promise<import("web3-types").NumberTypes[ReturnFormat["number"]]>;
    /**
     * Get the balance of an address at a given block.
     *
     * @param address The address to get the balance of.
     * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) Specifies what block to use as the current state for the balance query.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The current balance for the given address in `wei`.
     *
     * ```ts
     * web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
     * > 1000000000000n
     *
     * web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
     * > "0xe8d4a51000"
     * ```
     */
    getBalance<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(address: Address, blockNumber?: BlockNumberOrTag, returnFormat?: ReturnFormat): Promise<import("web3-types").NumberTypes[ReturnFormat["number"]]>;
    /**
     * Get the storage at a specific position of an address.
     *
     * @param address The address to get the storage from.
     * @param storageSlot The index position of the storage.
     * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) Specifies what block to use as the current state for the storage query.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The value in storage at the given position.
     *
     * ```ts
     * web3.eth.getStorageAt("0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234", 0).then(console.log);
     * > "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"
     *
     * web3.eth.getStorageAt(
     *      "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234",
     *      0,
     *      undefined,
     *      { number: FMT_NUMBER.HEX , bytes: FMT_BYTES.UINT8ARRAY }
     * ).then(console.log);
     * > Uint8Array(31) [
     *       3, 52,  86, 115,  33,  35, 255, 255,
     *       35, 66,  52,  45, 209,  35,  66,  67,
     *       67, 36,  35,  66,  52, 253,  35,  79,
     *       210, 63, 212, 242,  61,  66,  52
     *    ]
     * ```
     */
    getStorageAt<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(address: Address, storageSlot: Numbers, blockNumber?: BlockNumberOrTag, returnFormat?: ReturnFormat): Promise<import("web3-types").ByteTypes[ReturnFormat["bytes"]]>;
    /**
     * Get the code at a specific address.
     *
     * @param address The address to get the code from.
     * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) Specifies what block to use as the current state for the code query.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The [data](https://ethereum.org/en/developers/docs/transactions/#the-data-field) at the provided `address`.
     *
     * ```ts
     * web3.eth.getCode("0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234").then(console.log);
     * > "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
     *
     * web3.eth.getCode(
     *      "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
     *      undefined,
     *      { number: FMT_NUMBER.HEX , bytes: FMT_BYTES.UINT8ARRAY }
     * ).then(console.log);
     * > Uint8Array(50) [
     *   96,  1,  96,   0, 128, 53, 129, 26, 129, 129, 129,
     *   20, 96,  18,  87, 131,  1,   0, 91,  96,  27,  96,
     *   1, 53,  96,  37,  86, 91, 128, 96,   0,  82,  96,
     *   32, 96,   0, 242,  91, 96,   0, 96,   7, 130,   2,
     *   144, 80, 145, 144,  80, 86
     * ]
     * ```
     */
    getCode<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(address: Address, blockNumber?: BlockNumberOrTag, returnFormat?: ReturnFormat): Promise<import("web3-types").ByteTypes[ReturnFormat["bytes"]]>;
    /**
     * Retrieves a {@link Block} matching the provided block number, block hash or block tag.
     *
     * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Eth.defaultBlock}) or block hash of the desired block.
     * @param hydrated If specified `true`, the returned block will contain all transactions as objects. If `false` it will only contain transaction hashes.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted (does not format transaction objects or hashes).
     * @returns A {@link Block} object matching the provided block number or block hash.
     *
     * ```ts
     * web3.eth.getBlock(0).then(console.log);
     * > {
     *    hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
     *    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *    sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
     *    miner: '0x0000000000000000000000000000000000000000',
     *    stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
     *    transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
     *    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
     *    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     *    difficulty: 1n,
     *    number: 0n,
     *    gasLimit: 30000000n,
     *    gasUsed: 0n,
     *    timestamp: 1658281638n,
     *    extraData: '0x',
     *    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *    nonce: 0n,
     *    totalDifficulty: 1n,
     *    baseFeePerGas: 1000000000n,
     *    size: 514n,
     *    transactions: [],
     *    uncles: []
     *  }
     *
     * web3.eth.getBlock(
     *      "0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d",
     *      false,
     *      { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
     * ).then(console.log);
     * > {
     *    hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
     *    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *    sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
     *    miner: '0x0000000000000000000000000000000000000000',
     *    stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
     *    transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
     *    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
     *    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     *    difficulty: 1,
     *    number: 0,
     *    gasLimit: 30000000,
     *    gasUsed: 0,
     *    timestamp: 1658281638,
     *    extraData: '0x',
     *    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *    nonce: 0,
     *    totalDifficulty: 1,
     *    baseFeePerGas: 1000000000,
     *    size: 514,
     *    transactions: [],
     *    uncles: []
     *  }
     * ```
     */
    getBlock<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(block?: HexString32Bytes | BlockNumberOrTag, hydrated?: boolean, returnFormat?: ReturnFormat): Promise<{
        transactions: string[] | {
            readonly blockHash?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
            readonly blockNumber?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            readonly from: string;
            readonly hash: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
            readonly transactionIndex?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            to?: string | null | undefined;
            value?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            accessList?: {
                readonly address?: string | undefined;
                readonly storageKeys?: string[] | undefined;
            }[] | undefined;
            common?: {
                customChain: {
                    name?: string | undefined;
                    networkId: import("web3-types").NumberTypes[ReturnFormat["number"]];
                    chainId: import("web3-types").NumberTypes[ReturnFormat["number"]];
                };
                baseChain?: import("web3-types").ValidChains | undefined;
                hardfork?: "chainstart" | "frontier" | "homestead" | "dao" | "tangerineWhistle" | "spuriousDragon" | "byzantium" | "constantinople" | "petersburg" | "istanbul" | "muirGlacier" | "berlin" | "london" | "altair" | "arrowGlacier" | "grayGlacier" | "bellatrix" | "merge" | "capella" | "shanghai" | undefined;
            } | undefined;
            gas?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            gasPrice?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            type?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            maxFeePerGas?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            maxPriorityFeePerGas?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            data?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
            input?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
            nonce?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            chain?: import("web3-types").ValidChains | undefined;
            hardfork?: "chainstart" | "frontier" | "homestead" | "dao" | "tangerineWhistle" | "spuriousDragon" | "byzantium" | "constantinople" | "petersburg" | "istanbul" | "muirGlacier" | "berlin" | "london" | "altair" | "arrowGlacier" | "grayGlacier" | "bellatrix" | "merge" | "capella" | "shanghai" | undefined;
            chainId?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            networkId?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            gasLimit?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            yParity?: string | undefined;
            v?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            r?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
            s?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
        }[];
        parentHash: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        sha3Uncles: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        miner: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        stateRoot: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        transactionsRoot: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        receiptsRoot: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        logsBloom?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
        difficulty?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        number: import("web3-types").NumberTypes[ReturnFormat["number"]];
        gasLimit: import("web3-types").NumberTypes[ReturnFormat["number"]];
        gasUsed: import("web3-types").NumberTypes[ReturnFormat["number"]];
        timestamp: import("web3-types").NumberTypes[ReturnFormat["number"]];
        extraData: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        mixHash: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        nonce: import("web3-types").NumberTypes[ReturnFormat["number"]];
        totalDifficulty: import("web3-types").NumberTypes[ReturnFormat["number"]];
        baseFeePerGas?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        size: import("web3-types").NumberTypes[ReturnFormat["number"]];
        uncles: string[];
        hash?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
    }>;
    /**
     * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Eth.defaultBlock}) or block hash of the desired block.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The number of transactions in the provided block.
     *
     * ```ts
     * web3.eth.getBlockTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
     * > 1n
     *
     * web3.eth.getBlockTransactionCount(
     *     "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
     *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
     * ).then(console.log);
     * > 1
     * ```
     */
    getBlockTransactionCount<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(block?: HexString32Bytes | BlockNumberOrTag, returnFormat?: ReturnFormat): Promise<import("web3-types").NumberTypes[ReturnFormat["number"]]>;
    /**
     * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Eth.defaultBlock}) or block hash of the desired block.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The number of [uncles](https://ethereum.org/en/glossary/#ommer) in the provided block.
     *
     * ```ts
     * web3.eth.getBlockUncleCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
     * > 1n
     *
     * web3.eth.getBlockUncleCount(
     *     "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
     *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
     * ).then(console.log);
     * > 1
     * ```
     */
    getBlockUncleCount<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(block?: HexString32Bytes | BlockNumberOrTag, returnFormat?: ReturnFormat): Promise<import("web3-types").NumberTypes[ReturnFormat["number"]]>;
    /**
     *
     * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Eth.defaultBlock}) or block hash of the desired block.
     * @param uncleIndex The index position of the uncle.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns A blocks [uncle](https://ethereum.org/en/glossary/#ommer) by a given uncle index position.
     *
     * ```ts
     * web3.eth.getUncle(0, 1).then(console.log);
     * > {
     *    hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
     *    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *    sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
     *    miner: '0x0000000000000000000000000000000000000000',
     *    stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
     *    transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
     *    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
     *    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     *    difficulty: 1n,
     *    number: 0n,
     *    gasLimit: 30000000n,
     *    gasUsed: 0n,
     *    timestamp: 1658281638n,
     *    extraData: '0x',
     *    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *    nonce: 0n,
     *    totalDifficulty: 1n,
     *    baseFeePerGas: 1000000000n,
     *    size: 514n,
     *    transactions: [],
     *    uncles: []
     *  }
     *
     * web3.eth.getUncle(
     *      "0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d",
     *      1,
     *      { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
     * ).then(console.log);
     * > {
     *    hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
     *    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *    sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
     *    miner: '0x0000000000000000000000000000000000000000',
     *    stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
     *    transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
     *    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
     *    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     *    difficulty: 1,
     *    number: 0,
     *    gasLimit: 30000000,
     *    gasUsed: 0,
     *    timestamp: 1658281638,
     *    extraData: '0x',
     *    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *    nonce: 0,
     *    totalDifficulty: 1,
     *    baseFeePerGas: 1000000000,
     *    size: 514,
     *    transactions: [],
     *    uncles: []
     *  }
     * ```
     */
    getUncle<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(block: BlockNumberOrTag | undefined, uncleIndex: Numbers, returnFormat?: ReturnFormat): Promise<{
        readonly parentHash: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly sha3Uncles: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly miner: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly stateRoot: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly transactionsRoot: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly receiptsRoot: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly logsBloom?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
        readonly difficulty?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        readonly number: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly gasLimit: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly gasUsed: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly timestamp: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly extraData: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly mixHash: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly nonce: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly totalDifficulty: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly baseFeePerGas?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        readonly size: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly transactions: string[] | {
            readonly blockHash?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
            readonly blockNumber?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            readonly from: string;
            readonly hash: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
            readonly transactionIndex?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            to?: string | null | undefined;
            value?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            accessList?: {
                readonly address?: string | undefined;
                readonly storageKeys?: string[] | undefined;
            }[] | undefined;
            common?: {
                customChain: {
                    name?: string | undefined;
                    networkId: import("web3-types").NumberTypes[ReturnFormat["number"]];
                    chainId: import("web3-types").NumberTypes[ReturnFormat["number"]];
                };
                baseChain?: import("web3-types").ValidChains | undefined;
                hardfork?: "chainstart" | "frontier" | "homestead" | "dao" | "tangerineWhistle" | "spuriousDragon" | "byzantium" | "constantinople" | "petersburg" | "istanbul" | "muirGlacier" | "berlin" | "london" | "altair" | "arrowGlacier" | "grayGlacier" | "bellatrix" | "merge" | "capella" | "shanghai" | undefined;
            } | undefined;
            gas?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            gasPrice?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            type?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            maxFeePerGas?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            maxPriorityFeePerGas?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            data?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
            input?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
            nonce?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            chain?: import("web3-types").ValidChains | undefined;
            hardfork?: "chainstart" | "frontier" | "homestead" | "dao" | "tangerineWhistle" | "spuriousDragon" | "byzantium" | "constantinople" | "petersburg" | "istanbul" | "muirGlacier" | "berlin" | "london" | "altair" | "arrowGlacier" | "grayGlacier" | "bellatrix" | "merge" | "capella" | "shanghai" | undefined;
            chainId?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            networkId?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            gasLimit?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            yParity?: string | undefined;
            v?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            r?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
            s?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
        }[];
        readonly uncles: string[];
        readonly hash?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
    }>;
    /**
     * @param transactionHash The hash of the desired transaction.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The desired transaction object.
     *
     * ```ts
     * web3.eth.getTransaction('0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc').then(console.log);
     * {
     *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
     *    type: 0n,
     *    nonce: 0n,
     *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
     *    blockNumber: 1n,
     *    transactionIndex: 0n,
     *    from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *    to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *    value: 1n,
     *    gas: 90000n,
     *    gasPrice: 2000000000n,
     *    input: '0x',
     *    v: 2709n,
     *    r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
     *    s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
     *  }
     *
     * web3.eth.getTransaction(
     *     web3.utils.hexToBytes("0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"),
     *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
     * ).then(console.log);
     * {
     *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
     *    type: 0,
     *    nonce: 0,
     *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
     *    blockNumber: 1,
     *    transactionIndex: 0,
     *    from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *    to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *    value: 1,
     *    gas: 90000,
     *    gasPrice: 2000000000,
     *    input: '0x',
     *    v: 2709,
     *    r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
     *    s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
     *  }
     * ```
     */
    getTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(transactionHash: Bytes, returnFormat?: ReturnFormat): Promise<{
        readonly yParity: string;
        readonly r: string;
        readonly s: string;
        readonly v?: undefined;
        readonly maxFeePerGas: string;
        readonly maxPriorityFeePerGas: string;
        readonly accessList: {
            readonly address?: string | undefined;
            readonly storageKeys?: string[] | undefined;
        }[];
        readonly gasPrice: string;
        readonly to?: string | null | undefined;
        readonly type: string;
        readonly nonce: string;
        readonly gas: string;
        readonly value: string;
        readonly input: string;
        readonly data?: string | undefined;
        readonly chainId?: string | undefined;
        readonly hash: string;
        readonly blockHash?: string | undefined;
        readonly blockNumber?: string | undefined;
        readonly from: string;
        readonly transactionIndex?: string | undefined;
    } | {
        readonly yParity: string;
        readonly r: string;
        readonly s: string;
        readonly v?: undefined;
        readonly gasPrice: string;
        readonly accessList: {
            readonly address?: string | undefined;
            readonly storageKeys?: string[] | undefined;
        }[];
        readonly maxFeePerGas?: undefined;
        readonly maxPriorityFeePerGas?: undefined;
        readonly to?: string | null | undefined;
        readonly type: string;
        readonly nonce: string;
        readonly gas: string;
        readonly value: string;
        readonly input: string;
        readonly data?: string | undefined;
        readonly chainId?: string | undefined;
        readonly hash: string;
        readonly blockHash?: string | undefined;
        readonly blockNumber?: string | undefined;
        readonly from: string;
        readonly transactionIndex?: string | undefined;
    } | {
        readonly v: string;
        readonly r: string;
        readonly s: string;
        readonly gasPrice: string;
        readonly accessList?: undefined;
        readonly maxFeePerGas?: undefined;
        readonly maxPriorityFeePerGas?: undefined;
        readonly to?: string | null | undefined;
        readonly type: string;
        readonly nonce: string;
        readonly gas: string;
        readonly value: string;
        readonly input: string;
        readonly data?: string | undefined;
        readonly chainId?: string | undefined;
        readonly hash: string;
        readonly blockHash?: string | undefined;
        readonly blockNumber?: string | undefined;
        readonly from: string;
        readonly transactionIndex?: string | undefined;
    }>;
    /**
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns A list of pending transactions.
     *
     * ```ts
     * web3.eth.getPendingTransactions().then(console.log);
     * > [
     *      {
     *          hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
     *          type: 0n,
     *          nonce: 0n,
     *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *          blockNumber: null,
     *          transactionIndex: 0n,
     *          from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *          to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *          value: 1n,
     *          gas: 90000n,
     *          gasPrice: 2000000000n,
     *          input: '0x',
     *          v: 2709n,
     *          r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
     *          s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
     *      },
     *      {
     *          hash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
     *          type: 0n,
     *          nonce: 1n,
     *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *          blockNumber: null,
     *          transactionIndex: 0n,
     *          from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *          to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *          value: 1n,
     *          gas: 90000n,
     *          gasPrice: 2000000000n,
     *          input: '0x',
     *          v: 2710n,
     *          r: '0x55ac19fade21db035a1b7ea0a8d49e265e05dbb926e75f273f836ad67ce5c96a',
     *          s: '0x6550036a7c3fd426d5c3d35d96a7075cd673957620b7889846a980d2d017ec08'
     *      }
     *   ]
     *
     * * web3.eth.getPendingTransactions({ number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
     * > [
     *      {
     *          hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
     *          type: 0,
     *          nonce: 0,
     *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *          blockNumber: null,
     *          transactionIndex: 0,
     *          from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *          to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *          value: 1,
     *          gas: 90000,
     *          gasPrice: 2000000000,
     *          input: '0x',
     *          v: 2709,
     *          r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
     *          s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
     *      },
     *      {
     *          hash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
     *          type: 0,
     *          nonce: 1,
     *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
     *          blockNumber: null,
     *          transactionIndex: 0,
     *          from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *          to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *          value: 1,
     *          gas: 90000,
     *          gasPrice: 2000000000,
     *          input: '0x',
     *          v: 2710,
     *          r: '0x55ac19fade21db035a1b7ea0a8d49e265e05dbb926e75f273f836ad67ce5c96a',
     *          s: '0x6550036a7c3fd426d5c3d35d96a7075cd673957620b7889846a980d2d017ec08'
     *      }
     *   ]
     * ```
     */
    getPendingTransactions<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(returnFormat?: ReturnFormat): Promise<{
        from?: string | undefined;
        to?: string | null | undefined;
        value?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        accessList?: {
            readonly address?: string | undefined;
            readonly storageKeys?: string[] | undefined;
        }[] | undefined;
        common?: {
            customChain: {
                name?: string | undefined;
                networkId: import("web3-types").NumberTypes[ReturnFormat["number"]];
                chainId: import("web3-types").NumberTypes[ReturnFormat["number"]];
            };
            baseChain?: import("web3-types").ValidChains | undefined;
            hardfork?: "chainstart" | "frontier" | "homestead" | "dao" | "tangerineWhistle" | "spuriousDragon" | "byzantium" | "constantinople" | "petersburg" | "istanbul" | "muirGlacier" | "berlin" | "london" | "altair" | "arrowGlacier" | "grayGlacier" | "bellatrix" | "merge" | "capella" | "shanghai" | undefined;
        } | undefined;
        gas?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        gasPrice?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        type?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        maxFeePerGas?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        maxPriorityFeePerGas?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        data?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
        input?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
        nonce?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        chain?: import("web3-types").ValidChains | undefined;
        hardfork?: "chainstart" | "frontier" | "homestead" | "dao" | "tangerineWhistle" | "spuriousDragon" | "byzantium" | "constantinople" | "petersburg" | "istanbul" | "muirGlacier" | "berlin" | "london" | "altair" | "arrowGlacier" | "grayGlacier" | "bellatrix" | "merge" | "capella" | "shanghai" | undefined;
        chainId?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        networkId?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        gasLimit?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        yParity?: string | undefined;
        v?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        r?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
        s?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
    }[]>;
    /**
     * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Eth.defaultBlock}) or block hash of the desired block.
     * @param transactionIndex The index position of the transaction.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The desired transaction object.
     *
     * ```ts
     * web3.eth.getTransactionFromBlock('0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00', 0).then(console.log);
     * {
     *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
     *    type: 0n,
     *    nonce: 0n,
     *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
     *    blockNumber: 1n,
     *    transactionIndex: 0n,
     *    from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *    to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *    value: 1n,
     *    gas: 90000n,
     *    gasPrice: 2000000000n,
     *    input: '0x',
     *    v: 2709n,
     *    r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
     *    s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
     *  }
     *
     * web3.eth.getTransactionFromBlock(
     *     hexToBytes("0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"),
     *     0,
     *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
     * ).then(console.log);
     * {
     *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
     *    type: 0,
     *    nonce: 0,
     *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
     *    blockNumber: 1,
     *    transactionIndex: 0,
     *    from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *    to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *    value: 1,
     *    gas: 90000,
     *    gasPrice: 2000000000,
     *    input: '0x',
     *    v: 2709,
     *    r: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
     *    s: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
     *  }
     * ```
     */
    getTransactionFromBlock<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(block: BlockNumberOrTag | undefined, transactionIndex: Numbers, returnFormat?: ReturnFormat): Promise<{
        readonly yParity: string;
        readonly r: string;
        readonly s: string;
        readonly v?: undefined;
        readonly maxFeePerGas: string;
        readonly maxPriorityFeePerGas: string;
        readonly accessList: {
            readonly address?: string | undefined;
            readonly storageKeys?: string[] | undefined;
        }[];
        readonly gasPrice: string;
        readonly to?: string | null | undefined;
        readonly type: string;
        readonly nonce: string;
        readonly gas: string;
        readonly value: string;
        readonly input: string;
        readonly data?: string | undefined;
        readonly chainId?: string | undefined;
        readonly hash: string;
        readonly blockHash?: string | undefined;
        readonly blockNumber?: string | undefined;
        readonly from: string;
        readonly transactionIndex?: string | undefined;
    } | {
        readonly yParity: string;
        readonly r: string;
        readonly s: string;
        readonly v?: undefined;
        readonly gasPrice: string;
        readonly accessList: {
            readonly address?: string | undefined;
            readonly storageKeys?: string[] | undefined;
        }[];
        readonly maxFeePerGas?: undefined;
        readonly maxPriorityFeePerGas?: undefined;
        readonly to?: string | null | undefined;
        readonly type: string;
        readonly nonce: string;
        readonly gas: string;
        readonly value: string;
        readonly input: string;
        readonly data?: string | undefined;
        readonly chainId?: string | undefined;
        readonly hash: string;
        readonly blockHash?: string | undefined;
        readonly blockNumber?: string | undefined;
        readonly from: string;
        readonly transactionIndex?: string | undefined;
    } | {
        readonly v: string;
        readonly r: string;
        readonly s: string;
        readonly gasPrice: string;
        readonly accessList?: undefined;
        readonly maxFeePerGas?: undefined;
        readonly maxPriorityFeePerGas?: undefined;
        readonly to?: string | null | undefined;
        readonly type: string;
        readonly nonce: string;
        readonly gas: string;
        readonly value: string;
        readonly input: string;
        readonly data?: string | undefined;
        readonly chainId?: string | undefined;
        readonly hash: string;
        readonly blockHash?: string | undefined;
        readonly blockNumber?: string | undefined;
        readonly from: string;
        readonly transactionIndex?: string | undefined;
    } | undefined>;
    /**
     * @param transactionHash Hash of the transaction to retrieve the receipt for.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The desired {@link TransactionReceipt} object.
     *
     * ```ts
     * web3.eth.getTransactionReceipt("0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f").then(console.log);
     * > {
     *      transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
     *      transactionIndex: 0n,
     *      blockNumber: 2n,
     *      blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
     *      from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *      to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *      cumulativeGasUsed: 21000n,
     *      gasUsed: 21000n,
     *      logs: [],
     *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     *      status: 1n,
     *      effectiveGasPrice: 2000000000n,
     *      type: 0n
     *  }
     *
     * web3.eth.getTransactionReceipt(
     *      "0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f",
     *      { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
     * ).then(console.log);
     * > {
     *      transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
     *      transactionIndex: 0,
     *      blockNumber: 2,
     *      blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
     *      from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *      to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *      cumulativeGasUsed: 21000,
     *      gasUsed: 21000,
     *      logs: [],
     *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     *      status: 1,
     *      effectiveGasPrice: 2000000000,
     *      type: 0n
     *  }
     * ```
     */
    getTransactionReceipt<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(transactionHash: Bytes, returnFormat?: ReturnFormat): Promise<{
        readonly transactionHash: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly transactionIndex: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly blockHash: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly blockNumber: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly from: string;
        readonly to: string;
        readonly cumulativeGasUsed: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly gasUsed: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly effectiveGasPrice?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        readonly contractAddress?: string | undefined;
        readonly logs: {
            readonly id?: string | undefined;
            readonly removed?: boolean | undefined;
            readonly logIndex?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            readonly transactionIndex?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            readonly transactionHash?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
            readonly blockHash?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
            readonly blockNumber?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
            readonly address?: string | undefined;
            readonly data?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
            readonly topics?: import("web3-types").ByteTypes[ReturnFormat["bytes"]][] | undefined;
        }[];
        readonly logsBloom: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly root: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly status: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly type?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        events?: {
            [x: string]: {
                readonly event: string;
                readonly id?: string | undefined;
                readonly logIndex?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
                readonly transactionIndex?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
                readonly transactionHash?: string | undefined;
                readonly blockHash?: string | undefined;
                readonly blockNumber?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
                readonly address: string;
                readonly topics: string[];
                readonly data: string;
                readonly raw?: {
                    data: string;
                    topics: unknown[];
                } | undefined;
                readonly returnValues: {
                    [x: string]: unknown;
                };
                readonly signature?: string | undefined;
            };
        } | undefined;
    }>;
    /**
     * @param address The address to get the number of transactions for.
     * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) Specifies what block to use as the current state for the query.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The number of transactions sent from the provided address.
     *
     * ```ts
     * web3.eth.getTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
     * > 1n
     *
     * web3.eth.getTransactionCount(
     *     "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
     *     undefined,
     *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
     * ).then(console.log);
     * > 1
     * ```
     */
    getTransactionCount<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(address: Address, blockNumber?: BlockNumberOrTag, returnFormat?: ReturnFormat): Promise<import("web3-types").NumberTypes[ReturnFormat["number"]]>;
    /**
     * @param transaction The {@link Transaction}, {@link TransactionWithFromLocalWalletIndex}, {@link TransactionWithToLocalWalletIndex} or {@link TransactionWithFromAndToLocalWalletIndex} to send. __Note:__ In the `to` and `from` fields when hex strings are used, it is assumed they are addresses, for any other form (number, string number, etc.) it is assumed they are wallet indexes.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @param options A configuration object used to change the behavior of the `sendTransaction` method.
     * @returns If `await`ed or `.then`d (i.e. the promise resolves), the transaction hash is returned.
     * ```ts
     * const transaction = {
     *   from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
     *   to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
     *   value: '0x1'
     * }
     *
     * const transactionHash = await web3.eth.sendTransaction(transaction);
     * console.log(transactionHash);
     * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
     *
     * web3.eth.sendTransaction(transaction).then(console.log);
     * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
     *
     * web3.eth.sendTransaction(transaction).catch(console.log);
     * > <Some TransactionError>
     *
     * // Example using options.ignoreGasPricing = true
     * web3.eth.sendTransaction(transaction, undefined, { ignoreGasPricing: true }).then(console.log);
     * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
     * ```
     *
     *
     * Otherwise, a {@link Web3PromiEvent} is returned which has several events than can be listened to using the `.on` syntax, such as:
     * - `sending`
     * ```ts
     * web3.eth.sendTransaction(transaction).on('sending', transactionToBeSent => console.log(transactionToBeSent));
     * > {
     *    from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
     *    to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
     *    value: '0x1',
     *    gasPrice: '0x77359400',
     *    maxPriorityFeePerGas: undefined,
     *    maxFeePerGas: undefined
     * }
     * ```
     * - `sent`
     * ```ts
     * web3.eth.sendTransaction(transaction).on('sent', sentTransaction => console.log(sentTransaction));
     * > {
     *    from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
     *    to: '0x6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
     *    value: '0x1',
     *    gasPrice: '0x77359400',
     *    maxPriorityFeePerGas: undefined,
     *    maxFeePerGas: undefined
     * }
     * ```
     * - `transactionHash`
     * ```ts
     * web3.eth.sendTransaction(transaction).on('transactionHash', transactionHash => console.log(transactionHash));
     * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
     * ```
     * - `receipt`
     * ```ts
     * web3.eth.sendTransaction(transaction).on('receipt', receipt => console.log(receipt));
     * > {
     *      transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
     *      transactionIndex: 0n,
     *      blockNumber: 2n,
     *      blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
     *      from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *      to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *      cumulativeGasUsed: 21000n,
     *      gasUsed: 21000n,
     *      logs: [],
     *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     *      status: 1n,
     *      effectiveGasPrice: 2000000000n,
     *      type: 0n
     * }
     * ```
     * - `confirmation`
     * ```ts
     * web3.eth.sendTransaction(transaction).on('confirmation', confirmation => console.log(confirmation));
     * > {
     *     confirmations: 1n,
     *     receipt: {
     *         transactionHash: '0xb4a3a35ae0f3e77ef0ff7be42010d948d011b21a4e341072ee18717b67e99ab8',
     *         transactionIndex: 0n,
     *         blockNumber: 5n,
     *         blockHash: '0xb57fbe6f145cefd86a305a9a024a4351d15d4d39607d7af53d69a319bc3b5548',
     *         from: '0x6e599da0bff7a6598ac1224e4985430bf16458a4',
     *         to: '0x6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
     *         cumulativeGasUsed: 21000n,
     *         gasUsed: 21000n,
     *         logs: [],
     *         logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     *         status: 1n,
     *         effectiveGasPrice: 2000000000n,
     *         type: 0n
     *     },
     *     latestBlockHash: '0xb57fbe6f145cefd86a305a9a024a4351d15d4d39607d7af53d69a319bc3b5548'
     * }
     * ```
     * - `error`
     * ```ts
     * web3.eth.sendTransaction(transaction).on('error', error => console.log);
     * > <Some TransactionError>
     * ```
     */
    sendTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(transaction: Transaction | TransactionWithFromLocalWalletIndex | TransactionWithToLocalWalletIndex | TransactionWithFromAndToLocalWalletIndex, returnFormat?: ReturnFormat, options?: SendTransactionOptions): import("web3-core").Web3PromiEvent<import("web3-types").TransactionReceipt, import("./types.js").SendTransactionEvents<ReturnFormat>>;
    /**
     * @param transaction Signed transaction in one of the valid {@link Bytes} format.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @param options A configuration object used to change the behavior of the method
     * @returns If `await`ed or `.then`d (i.e. the promise resolves), the transaction hash is returned.
     * ```ts
     * const signedTransaction = "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"
     *
     * const transactionHash = await web3.eth.sendSignedTransaction(signedTransaction);
     * console.log(transactionHash);
     * > 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700
     *
     * web3.eth.sendSignedTransaction(signedTransaction).then(console.log);
     * > 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700
     *
     * web3.eth.sendSignedTransaction(signedTransaction).catch(console.log);
     * > <Some TransactionError>
     * ```
     *
     *
     * Otherwise, a {@link Web3PromiEvent} is returned which has several events than can be listened to using the `.on` syntax, such as:
     * - `sending`
     * ```ts
     * web3.eth.sendSignedTransaction(signedTransaction).on('sending', transactionToBeSent => console.log(transactionToBeSent));
     * > "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"
     * ```
     * - `sent`
     * ```ts
     * web3.eth.sendSignedTransaction(signedTransaction).on('sent', sentTransaction => console.log(sentTransaction));
     * > "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"
     * ```
     * - `transactionHash`
     * ```ts
     * web3.eth.sendSignedTransaction(signedTransaction).on('transactionHash', transactionHash => console.log(transactionHash));
     * > 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700
     * ```
     * - `receipt`
     * ```ts
     * web3.eth.sendSignedTransaction(signedTransaction).on('receipt', receipt => console.log(receipt));
     * > {
     *      blockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081',
     *      blockNumber: 1n,
     *      cumulativeGasUsed: 21000n,
     *      effectiveGasPrice: 1000000001n,
     *      from: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
     *      gasUsed: 21000n,
     *      logs: [],
     *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     *      status: 1n,
     *      to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
     *      transactionHash: '0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700',
     *      transactionIndex: 0n,
     *      type: 0n
     * }
     * ```
     * - `confirmation`
     * ```ts
     * web3.eth.sendSignedTransaction(signedTransaction).on('confirmation', confirmation => console.log(confirmation));
     * > {
     *     confirmations: 1n,
     *     receipt: {
     *          blockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081',
     *          blockNumber: 1n,
     *          cumulativeGasUsed: 21000n,
     *          effectiveGasPrice: 1000000001n,
     *          from: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
     *          gasUsed: 21000n,
     *          logs: [],
     *          logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     *          status: 1n,
     *          to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
     *          transactionHash: '0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700',
     *          transactionIndex: 0n,
     *          type: 0n
     *     },
     *     latestBlockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081'
     * }
     * ```
     * - `error`
     * ```ts
     * web3.eth.sendSignedTransaction(signedTransaction).on('error', error => console.log(error));
     * > <Some TransactionError>
     * ```
     */
    sendSignedTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(transaction: Bytes, returnFormat?: ReturnFormat, options?: SendTransactionOptions): import("web3-core").Web3PromiEvent<import("web3-types").TransactionReceipt, import("./types.js").SendSignedTransactionEvents<ReturnFormat>>;
    /**
     * @param message Data to sign in one of the valid {@link Bytes} format.
     * @param address Address to sign data with, can be an address or the index of a local wallet.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns The signed `message`.
     *
     * ```ts
     * // Using an unlocked account managed by connected RPC client
     * web3.eth.sign("0x48656c6c6f20776f726c64", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe").then(console.log);
     * > "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
     *
     * // Using an unlocked account managed by connected RPC client
     * web3.eth.sign("0x48656c6c6f20776f726c64", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.UINT8ARRAY }).then(console.log);
     * > Uint8Array(65) [
     *    48, 117,  94, 214,  83, 150, 250, 207, 134, 197,  62,
     *    98,  23, 197,  43,  77, 174, 190, 114, 170,  73,  65,
     *   216, 150,  53,  64, 157, 228, 201, 199, 249,  70, 109,
     *    78, 154, 174, 199, 151, 127,   5, 233,  35, 136, 155,
     *    51, 192, 208, 221,  39, 215,  34, 107, 110, 111,  86,
     *   206, 115, 116, 101, 197, 207, 208,  75, 228,   0
     * ]
     * ```
     *
     * // Using an indexed account managed by local Web3 wallet
     * web3.eth.sign("0x48656c6c6f20776f726c64", 0).then(console.log);
     * > "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
     */
    sign<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(message: Bytes, addressOrIndex: Address | number, returnFormat?: ReturnFormat): Promise<{
        readonly messageHash: string;
        readonly r: string;
        readonly s: string;
        readonly v: string;
        readonly message?: string | undefined;
        readonly signature: string;
    } | import("web3-types").ByteTypes[ReturnFormat["bytes"]]>;
    /**
     * @param transaction The transaction object to sign.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
     * @returns {@link SignedTransactionInfoAPI}, an object containing the [RLP](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/#top) encoded signed transaction (accessed via the `raw` property) and the signed transaction object (accessed via the `tx` property).
     *
     * ```ts
     * const transaction = {
     *      from: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
     *      to: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
     *      value: '0x1',
     *      gas: '21000',
     *      gasPrice: await web3Eth.getGasPrice(),
     *      nonce: '0x1',
     *      type: '0x0'
     * }
     *
     * web3.eth.signTransaction(transaction).then(console.log);
     * > {
     *   raw: '0xf86501843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a96a0adb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679a027d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
     *   tx: {
     *      type: 0n,
     *      nonce: 1n,
     *      gasPrice: 1000000001n,
     *      gas: 21000n,
     *      value: 1n,
     *      v: 2710n,
     *      r: '0xadb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679',
     *      s: '0x27d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
     *      to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
     *      data: '0x'
     *   }
     * }
     *
     * web3.eth.signTransaction(transaction, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
     * > {
     *   raw: '0xf86501843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a96a0adb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679a027d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
     *   tx: {
     *      type: 0,
     *      nonce: 1,
     *      gasPrice: 1000000001,
     *      gas: 21000,
     *      value: 1,
     *      v: 2710,
     *      r: '0xadb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679',
     *      s: '0x27d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
     *      to: '0xe899f0130fd099c0b896b2ce4e5e15a25b23139a',
     *      data: '0x'
     *   }
     * }
     * ```
     */
    signTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(transaction: Transaction, returnFormat?: ReturnFormat): Promise<import("web3-types").SignedTransactionInfoAPI>;
    /**
     * Executes a message call within the EVM without creating a transaction.
     * It does not publish anything to the blockchain and does not consume any gas.
     *
     * @param transaction - A transaction object where all properties are optional except `to`, however it's recommended to include the `from` property or it may default to `0x0000000000000000000000000000000000000000` depending on your node or provider.
     * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the transaction.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
     * @returns The returned data of the call, e.g. a smart contract function's return value.
     */
    call<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(transaction: TransactionCall, blockNumber?: BlockNumberOrTag, returnFormat?: ReturnFormat): Promise<import("web3-types").ByteTypes[ReturnFormat["bytes"]]>;
    /**
     * Simulates the transaction within the EVM to estimate the amount of gas to be used by the transaction.
     * The transaction will not be added to the blockchain, and actual gas usage can vary when interacting
     * with a contract as a result of updating the contract's state.
     *
     * @param transaction The {@link Transaction} object to estimate the gas for.
     * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the gas estimation.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
     * @returns The used gas for the simulated transaction execution.
     *
     * ```ts
     * const transaction = {
     *       from: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
     *       to: '0xe899f0130FD099c0b896B2cE4E5E15A25b23139a',
     *       value: '0x1',
     *       nonce: '0x1',
     *       type: '0x0'
     * }
     *
     * web3.eth.estimateGas(transaction).then(console.log);
     * > 21000n
     *
     * web3.eth.estimateGas(transaction, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
     * > 21000
     * ```
     */
    estimateGas<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(transaction: Transaction, blockNumber?: BlockNumberOrTag, returnFormat?: ReturnFormat): Promise<import("web3-types").NumberTypes[ReturnFormat["number"]]>;
    /**
     * Gets past logs, matching the provided `filter`.
     *
     * @param filter A {@link Filter} object containing the properties for the desired logs.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
     * @returns {@link FilterResultsAPI}, an array of {@link Log} objects.
     *
     * ```ts
     * web3.eth.getPastLogs({
     *      address: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
     *      topics: ["0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"]
     *  }).then(console.log);
     * > [{
     *       data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
     *       topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
     *       logIndex: 0n,
     *       transactionIndex: 0n,
     *       transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
     *       blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
     *       blockNumber: 1234n,
     *       address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
     *   },
     *   {...}]
     *
     * web3.eth.getPastLogs(
     *     {
     *       address: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
     *       topics: ["0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"]
     *     },
     *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
     * ).then(console.log);
     * > [{
     *       data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
     *       topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
     *       logIndex: 0,
     *       transactionIndex: 0,
     *       transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
     *       blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
     *       blockNumber: 1234,
     *       address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
     *   },
     *   {...}]
     * ```
     */
    getPastLogs<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(filter: Filter, returnFormat?: ReturnFormat): Promise<(string | {
        readonly id?: string | undefined;
        readonly removed?: boolean | undefined;
        readonly logIndex?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        readonly transactionIndex?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        readonly transactionHash?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
        readonly blockHash?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
        readonly blockNumber?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
        readonly address?: string | undefined;
        readonly data?: import("web3-types").ByteTypes[ReturnFormat["bytes"]] | undefined;
        readonly topics?: import("web3-types").ByteTypes[ReturnFormat["bytes"]][] | undefined;
    })[]>;
    /**
     * Gets work for miners to mine on. Returns the hash of the current block, the seedHash, and the boundary condition to be met ('target').
     *
     * @returns The mining work as an array of strings with the following structure:
     *
     * String 32 Bytes - at index 0: current block header pow-hash
     * String 32 Bytes - at index 1: the seed hash used for the DAG.
     * String 32 Bytes - at index 2: the boundary condition ('target'), 2^256 / difficulty.
     *
     * ```ts
     * web3.eth.getWork().then(console.log);
     * > [
     *     "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
     *     "0x5EED00000000000000000000000000005EED0000000000000000000000000000",
     *     "0xd1ff1c01710000000000000000000000d1ff1c01710000000000000000000000"
     * ]
     * ```
     */
    getWork(): Promise<[string, string, string]>;
    /**
     * Used for submitting a proof-of-work solution.
     *
     * @param nonce The nonce found (8 bytes).
     * @param hash  The header’s pow-hash (32 bytes).
     * @param digest The mix digest (32 bytes).
     * @returns Returns `true` if the provided solution is valid, otherwise `false`.
     *
     * ```ts
     * web3.eth.submitWork([
     *     "0x0000000000000001",
     *     "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
     *     "0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000"
     * ]).then(console.log);
     * > true
     * ```
     */
    submitWork(nonce: HexString8Bytes, hash: HexString32Bytes, digest: HexString32Bytes): Promise<boolean>;
    /**
     * This method will request/enable the accounts from the current environment and for supporting [EIP 1102](https://eips.ethereum.org/EIPS/eip-1102)
     * This method will only work if you’re using the injected provider from a application like Metamask, Status or TrustWallet.
     * It doesn’t work if you’re connected to a node with a default Web3.js provider (WebsocketProvider, HttpProvider and IpcProvider).
     * For more information about the behavior of this method please read [EIP-1102](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1102.md): Opt-in account exposure.
     *
     * @returns An array of enabled accounts.
     *
     * ```ts
     * web3.eth.requestAccounts().then(console.log);
     * > ['0aae0B295369a9FD31d5F28D9Ec85E40f4cb692BAf', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe']
     * ```
     */
    requestAccounts(): Promise<string[]>;
    /**
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
     * @returns The chain ID of the current connected node as described in the [EIP-695](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md).
     *
     * ```ts
     * web3.eth.getChainId().then(console.log);
     * > 61n
     *
     * web3.eth.getChainId({ number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
     * > 61
     * ```
     */
    getChainId<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(returnFormat?: ReturnFormat): Promise<import("web3-types").NumberTypes[ReturnFormat["number"]]>;
    /**
     * @returns The current client version.
     *
     * ```ts
     * web3.eth.getNodeInfo().then(console.log);
     * > "Mist/v0.9.3/darwin/go1.4.1"
     * ```
     */
    getNodeInfo(): Promise<string>;
    /**
     * @param address The Address of the account or contract.
     * @param storageKeys Array of storage-keys which should be proofed and included. See {@link web3.getStorageAt}.
     * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the gas estimation.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
     * @returns The account and storage-values of the specified account including the Merkle-proof as described in [EIP-1186](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1186.md).
     *
     * ```ts
     * web3.eth.getProof(
     *     "0x1234567890123456789012345678901234567890",
     *     ["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000001"],
     *     "latest"
     * ).then(console.log);
     * > {
     *     "address": "0x1234567890123456789012345678901234567890",
     *     "accountProof": [
     *         "0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80",
     *         "0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80",
     *         "0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080",
     *         "0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080"
     *     ],
     *     "balance": 0n,
     *     "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
     *     "nonce": 0n,
     *     "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
     *     "storageProof": [
     *         {
     *             "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
     *             "value": 0n,
     *             "proof": []
     *         },
     *         {
     *             "key": "0x0000000000000000000000000000000000000000000000000000000000000001",
     *             "value": 0n,
     *             "proof": []
     *         }
     *     ]
     * }
     *
     * web3.eth.getProof(
     *     "0x1234567890123456789012345678901234567890",
     *     ["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000001"],
     *     undefined,
     *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
     * ).then(console.log);
     * > {
     *     "address": "0x1234567890123456789012345678901234567890",
     *     "accountProof": [
     *         "0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80",
     *         "0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80",
     *         "0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080",
     *         "0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080"
     *     ],
     *     "balance": 0,
     *     "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
     *     "nonce": 0,
     *     "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
     *     "storageProof": [
     *         {
     *             "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
     *             "value": 0,
     *             "proof": []
     *         },
     *         {
     *             "key": "0x0000000000000000000000000000000000000000000000000000000000000001",
     *             "value": 0,
     *             "proof": []
     *         }
     *     ]
     * }
     * ```
     */
    getProof<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(address: Address, storageKeys: Bytes[], blockNumber?: BlockNumberOrTag, returnFormat?: ReturnFormat): Promise<{
        readonly balance: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly codeHash: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly nonce: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly storageHash: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
        readonly accountProof: import("web3-types").ByteTypes[ReturnFormat["bytes"]][];
        readonly storageProof: {
            readonly key: import("web3-types").ByteTypes[ReturnFormat["bytes"]];
            readonly value: import("web3-types").NumberTypes[ReturnFormat["number"]];
            readonly proof: import("web3-types").ByteTypes[ReturnFormat["bytes"]][];
        }[];
    }>;
    /**
     * @param blockCount Number of blocks in the requested range. Between `1` and `1024` blocks can be requested in a single query. Less than requested may be returned if not all blocks are available.
     * @param newestBlock Highest number block of the requested range.
     * @param rewardPercentiles A monotonically increasing list of percentile values to sample from each block’s effective priority fees per gas in ascending order, weighted by gas used. Example: `['0', '25', '50', '75', '100']` or `['0', '0.5', '1', '1.5', '3', '80']`
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
     * @returns `baseFeePerGas` and transaction effective `priorityFeePerGas` history for the requested block range if available.
     * The range between `headBlock - 4` and `headBlock` is guaranteed to be available while retrieving data from the `pending` block and older history are optional to support.
     * For pre-EIP-1559 blocks the `gasPrice`s are returned as `rewards` and zeroes are returned for the `baseFeePerGas`.
     *
     * ```ts
     * web3.eth.getFeeHistory(4, 'pending', [0, 25, 75, 100]).then(console.log);
     * > {
     *     baseFeePerGas: [
     *         22983878621n,
     *         21417903463n,
     *         19989260230n,
     *         17770954829n,
     *         18850641304n
     *     ],
     *     gasUsedRatio: [
     *         0.22746546666666667,
     *         0.2331871,
     *         0.05610054885262125,
     *         0.7430227268212117
     *     ],
     *     oldestBlock: 15216343n,
     *     reward: [
     *         [ '0x3b9aca00', '0x53724e00', '0x77359400', '0x1d92c03423' ],
     *         [ '0x3b9aca00', '0x3b9aca00', '0x3b9aca00', '0xee6b2800' ],
     *         [ '0x3b9aca00', '0x4f86a721', '0x77d9743a', '0x9502f900' ],
     *         [ '0xcc8ff9e', '0x53724e00', '0x77359400', '0x1ec9771bb3' ]
     *     ]
     * }
     *
     * web3.eth.getFeeHistory(4, BlockTags.LATEST, [0, 25, 75, 100], { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
     * > {
     *     baseFeePerGas: [
     *         22983878621,
     *         21417903463,
     *         19989260230,
     *         17770954829,
     *         18850641304
     *     ],
     *     gasUsedRatio: [
     *         0.22746546666666667,
     *         0.2331871,
     *         0.05610054885262125,
     *         0.7430227268212117
     *     ],
     *     oldestBlock: 15216343,
     *     reward: [
     *         [ '0x3b9aca00', '0x53724e00', '0x77359400', '0x1d92c03423' ],
     *         [ '0x3b9aca00', '0x3b9aca00', '0x3b9aca00', '0xee6b2800' ],
     *         [ '0x3b9aca00', '0x4f86a721', '0x77d9743a', '0x9502f900' ],
     *         [ '0xcc8ff9e', '0x53724e00', '0x77359400', '0x1ec9771bb3' ]
     *     ]
     * }
     * ```
     */
    getFeeHistory<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(blockCount: Numbers, newestBlock: BlockNumberOrTag | undefined, rewardPercentiles: Numbers[], returnFormat?: ReturnFormat): Promise<{
        readonly oldestBlock: import("web3-types").NumberTypes[ReturnFormat["number"]];
        readonly baseFeePerGas: import("web3-types").NumberTypes[ReturnFormat["number"]][];
        readonly reward: import("web3-types").NumberTypes[ReturnFormat["number"]][][];
        readonly gasUsedRatio: import("web3-types").NumberTypes[ReturnFormat["number"]][];
    }>;
    /**
     * This method generates an access list for a transaction.
     *
     * @param transaction - A transaction object where all properties are optional except `from`, however it's recommended to include the `to` property.
     * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Eth.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the transaction.
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the createAccessList should be formatted.
     * @returns The returned data of the createAccessList,  e.g. The generated access list for transaction.
     * @example
     * ```ts
     * web3.eth.createAccessList({
     * from: '0xDe95305a63302C3aa4d3A9B42654659AeA72b694',
     * data: '0x9a67c8b100000000000000000000000000000000000000000000000000000000000004d0',
     * gasPrice: '0x3b9aca00',
     * gas: '0x3d0900',
     * to: '0x940b25304947ae863568B3804434EC77E2160b87'
     * })
     * .then(console.log);
     *
     * > {
     *  "accessList": [
     *     {
     *       "address": "0x15859bdf5aff2080a9968f6a410361e9598df62f",
     *       "storageKeys": [
     *         "0x0000000000000000000000000000000000000000000000000000000000000000"
     *       ]
     *     }
     *   ],
     *   "gasUsed": "0x7671"
     * }
     * ```
     */
    createAccessList<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(transaction: TransactionForAccessList, blockNumber?: BlockNumberOrTag, returnFormat?: ReturnFormat): Promise<{
        readonly accessList?: {
            readonly address?: string | undefined;
            readonly storageKeys?: string[] | undefined;
        }[] | undefined;
        readonly gasUsed?: import("web3-types").NumberTypes[ReturnFormat["number"]] | undefined;
    }>;
    /**
     * This method sends EIP-712 typed data to the RPC provider to be signed.
     *
     * @param address The address that corresponds with the private key used to sign the typed data.
     * @param typedData The EIP-712 typed data object.
     * @param useLegacy A boolean flag determining whether the RPC call uses the legacy method `eth_signTypedData` or the newer method `eth_signTypedData_v4`
     * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the signed typed data should be formatted.
     * @returns The signed typed data.
     */
    signTypedData<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(address: Address, typedData: Eip712TypedData, useLegacy?: boolean, returnFormat?: ReturnFormat): Promise<string>;
    /**
     * Lets you subscribe to specific events in the blockchain.
     *
     * @param name - The subscription you want to subscribe to.
     * @param args - Optional additional parameters, depending on the subscription type.
     * @returns A subscription object of type {@link RegisteredSubscription}. The object contains:
     *  - subscription.id: The subscription id, used to identify and unsubscribing the subscription.
     *  - subscription.subscribe(): Can be used to re-subscribe with the same parameters.
     *  - subscription.unsubscribe(): Unsubscribes the subscription and returns TRUE in the callback if successful.
     *  - subscription.args: The subscription arguments, used when re-subscribing.
     *
     *
     * You can use the subscription object to listen on:
     *
     * - on("data") - Fires on each incoming log with the log object as argument.
     * - on("changed") - Fires on each log which was removed from the blockchain. The log will have the additional property "removed: true".
     * - on("error") - Fires when an error in the subscription occurs.
     * - on("connected") - Fires once after the subscription successfully connected. Returns the subscription id.
     *
     * @example **Subscribe to Smart Contract events**
     * ```ts
     * // Subscribe to `logs`
     * const logSubscription = web3.eth.subscribe('logs', {
     *     address: '0x1234567890123456789012345678901234567890',
     *     topics: ['0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234']
     * });
     * logSubscription.on('data', (data: any) => console.log(data));
     * logSubscription.on('error', (error: any) => console.log(error));
     *
     * ```
     *
     * @example **Subscribe to new block headers**
     * ```ts
     * // Subscribe to `newBlockHeaders`
     * const newBlocksSubscription = await web3.eth.subscribe('newBlockHeaders');
     *
     * newBlocksSubscription.on('data', async blockhead => {
     * 	console.log('New block header: ', blockhead);
     *
     * 	// You do not need the next line, if you like to keep notified for every new block
     * 	await newBlocksSubscription.unsubscribe();
     * 	console.log('Unsubscribed from new block headers.');
     * });
     * newBlocksSubscription.on('error', error =>
     * 	console.log('Error when subscribing to New block header: ', error),
     * );
     * ```
     *
     * 	### subscribe('pendingTransactions')
     *
     * Subscribes to incoming pending transactions.
     * You can subscribe to pending transactions by calling web3.eth.subscribe('pendingTransactions').
     *
     * ```ts
     * (await web3.eth.subscribe('pendingTransactions')).on('data', console.log);
     * ```
     *
     * ### subscribe('newHeads')
     * ( same as subscribe('newBlockHeaders'))
     * Subscribes to incoming block headers. This can be used as timer to check for changes on the blockchain.
     *
     * The structure of a returned block header is {@link BlockHeaderOutput}:
     *
     * ```ts
     * (await web3.eth.subscribe('newHeads')).on( // 'newBlockHeaders' would work as well
     *  'data',
     * console.log
     * );
     * >{
     * parentHash: '0x9e746a1d906b299def98c75b06f714d62dacadd567c7515d76eeaa8c8074c738',
     * sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
     * miner: '0x0000000000000000000000000000000000000000',
     * stateRoot: '0xe0f04b04861ecfa95e82a9310d6a7ef7aef8d7417f5209c182582bfb98a8e307',
     * transactionsRoot: '0x31ab4ea571a9e10d3a19aaed07d190595b1dfa34e03960c04293fec565dea536',
     * logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
     * difficulty: 2n,
     * number: 21n,
     * gasLimit: 11738125n,
     * gasUsed: 830006n,
     * timestamp: 1678797237n,
     * extraData: '0xd883010b02846765746888676f312e32302e31856c696e757800000000000000e0a6e93cf40e2e71a72e493272210c3f43738ccc7e7d7b14ffd51833797d896c09117e8dc4fbcbc969bd21b42e5af3e276a911524038c001b2109b63b8e0352601',
     * nonce: 0n
     * }
     * ```
     *
     * ### subscribe('syncing')
     * Subscribe to syncing events. This will return `true` when the node is syncing and when it’s finished syncing will return `false`, for the `changed` event.
     *
     * ```ts
     * (await web3.eth.subscribe('syncing')).on('changed', console.log);
     * > `true` // when syncing
     *
     * (await web3.eth.subscribe('syncing')).on('data', console.log);
     * > {
     *      startingBlock: 0,
     *      currentBlock: 0,
     *      highestBlock: 0,
     *      pulledStates: 0,
     *      knownStates: 0
     *   }
     * ```
     *
     * ### subscribe('logs', options)
     * Subscribes to incoming logs, filtered by the given options. If a valid numerical fromBlock options property is set, web3.js will retrieve logs beginning from this point, backfilling the response as necessary.
     *
     * options: You can subscribe to logs matching a given filter object, which can take the following parameters:
     * - `fromBlock`: (optional, default: 'latest') Integer block number, or `'latest'` for the last mined block or `'pending'`, `'earliest'` for not yet mined transactions.
     * - `address`: (optional) Contract address or a list of addresses from which logs should originate.
     * - `topics`: (optional) Array of 32 Bytes DATA topics. Topics are order-dependent. Each topic can also be an array of DATA with `or` options.
     *
     * ```ts
     *  (await web3.eth.subscribe('logs', {
     *    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
     *   })).on('data', console.log);
     *
     * > {
     * removed: false,
     * logIndex: 119n,
     * transactionIndex: 58n,
     * transactionHash: '0x61533efa77937360215069d5d6cb0be09a22af9721e6dc3df59d957833ed8870',
     * blockHash: '0xe32bb97084479d32247f66f8b46d00af2fbc3c2db2bc6e5843fe2e4d1ca9b099',
     * blockNumber: 18771966n,
     * address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
     * data: '0x00000000000000000000000000000000000000000000000000000000d88b2e40',
     * topics: [
     * '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
     * '0x0000000000000000000000002fb2457f6ec1865dc0d4e7300c696b69c2a1b989',
     * '0x00000000000000000000000027fd43babfbe83a81d14665b1a6fb8030a60c9b4'
     * ]
     * }
     *```
     */
    subscribe<T extends keyof RegisteredSubscription, ReturnType extends DataFormat = DataFormat>(name: T, args?: ConstructorParameters<RegisteredSubscription[T]>[0], returnFormat?: ReturnType): Promise<InstanceType<RegisteredSubscription[T]>>;
    private static shouldClearSubscription;
    /**
     * Resets subscriptions.
     *
     * @param notClearSyncing If `true` it keeps the `syncing` subscription.
     * @returns A promise to an array of subscription ids that were cleared.
     *
     * ```ts
     * web3.eth.clearSubscriptions().then(console.log);
     * > [...] An array of subscription ids that were cleared
     * ```
     */
    clearSubscriptions(notClearSyncing?: boolean): Promise<string[]> | undefined;
}
