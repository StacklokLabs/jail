import { Observable } from "rxjs";
import { AccountStatus } from "../models";
import { AccountHarvestInfo } from "../models/account/AccountHarvestInfo";
import { AccountHistoricalInfo } from "../models/account/AccountHistoricalInfo";
import { AccountImportanceInfo } from "../models/account/AccountImportanceInfo";
import { AccountInfoWithMetaData } from "../models/account/AccountInfo";
import { Address } from "../models/account/Address";
import { NodeHarvestInfo } from "../models/account/NodeHarvestInfo";
import { Asset } from "../models/asset/Asset";
import { AssetDefinition } from "../models/asset/AssetDefinition";
import { Namespace } from "../models/namespace/Namespace";
import { Transaction } from "../models/transaction/Transaction";
import { HttpEndpoint, ServerConfig } from "./HttpEndpoint";
import { Pageable } from "./Pageable";
export interface QueryParams {
    /**
     * (Optional) The xem of transactions returned. Between 5 and 100, otherwise 10
     */
    pageSize?: number;
    /**
     * (Optional) The 256 bit sha3 hash of the transaction up to which transactions are returned.
     */
    hash?: string;
    /**
     * (Optional) The transaction id up to which transactions are returned. This parameter will prevail over hash.
     */
    id?: number;
}
/**
 *
 */
export declare class AccountHttp extends HttpEndpoint {
    constructor(nodes?: ServerConfig[]);
    /**
     * Gets an AccountInfoWithMetaData for an account.
     * @param address - Address
     * @return Observable<AccountInfoWithMetaData>
     */
    getFromAddress(address: Address): Observable<AccountInfoWithMetaData>;
    /**
     * Gets an AccountInfoWithMetaData for an account with publicKey
     * @param publicKey - NEM
     * @return Observable<AccountInfoWithMetaData>
     */
    getFromPublicKey(publicKey: string): Observable<AccountInfoWithMetaData>;
    /**
     * Given a delegate (formerly known as remote) account's address, gets the AccountMetaDataPair for the account for which the given account is the delegate account.
     * If the given account address is not a delegate account for any account, the request returns the AccountMetaDataPair for the given address.
     * @param address - Address
     * @return Observable<AccountInfoWithMetaData>
     */
    getOriginalAccountDataFromDelegatedAccountAddress(address: Address): Observable<AccountInfoWithMetaData>;
    /**
     * retrieve the original account data by providing the public key of the delegate account.
     * @param publicKey - string
     * @return Observable<AccountInfoWithMetaData>
     */
    getOriginalAccountDataFromDelegatedAccountPublicKey(publicKey: string): Observable<AccountInfoWithMetaData>;
    /**
     * Gets the AccountMetaData from an account.
     * @param address - NEM Address
     * @return Observable<AccountStatus>
     */
    status(address: Address): Observable<AccountStatus>;
    /**
     * A transaction is said to be incoming with respect to an account if the account is the recipient of the transaction.
     * In the same way outgoing transaction are the transactions where the account is the sender of the transaction.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block
     * @param address - The address of the account.
     * @param params
     */
    incomingTransactions(address: Address, params?: QueryParams): Observable<Transaction[]>;
    /**
     * Paginaged version of incomingTransactions request
     * @param address
     * @param params
     */
    incomingTransactionsPaginated(address: Address, params?: QueryParams): Pageable<Transaction[]>;
    /**
     * Gets an array of transaction meta data pairs where the recipient has the address given as parameter to the request.
     * A maximum of 25 transaction meta data pairs is returned. For details about sorting and discussion of the second parameter see Incoming transactions.
     * @param address - The address of the account.
     * @param params
     */
    outgoingTransactions(address: Address, params?: QueryParams): Observable<Transaction[]>;
    /**
     * Paginaged version of outgoingTransactions request
     * @param address
     * @param params
     * @param params
     */
    outgoingTransactionsPaginated(address: Address, params?: QueryParams): Pageable<Transaction[]>;
    /**
     * Gets an array of transaction meta data pairs for which an account is the sender or receiver.
     * A maximum of 25 transaction meta data pairs is returned.
     * For details about sorting and discussion of the second parameter see Incoming transactions.
     * @param address - The address of the account.
     * @param params
     */
    allTransactions(address: Address, params?: QueryParams): Observable<Transaction[]>;
    /**
     * Paginaged version of allTransactions request
     * @param address
     * @param params
     */
    allTransactionsPaginated(address: Address, params?: QueryParams): Pageable<Transaction[]>;
    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block
     * @param address - NEM Address
     * @return Observable<Transaction[]>
     */
    unconfirmedTransactions(address: Address): Observable<Transaction[]>;
    /**
     * Gets an array of harvest info objects for an account.
     * @param address - Address
     * @param id - string (optional)
     * @return Observable<AccountHarvestInfo[]>
     */
    getHarvestInfoDataForAnAccount(address: Address, id?: string): Observable<AccountHarvestInfo[]>;
    /**
     * Paginaged version of allTransactions request
     * @param address
     * @param id
     * @returns {HarvestInfoPageable}
     */
    getHarvestInfoDataForAnAccountPaginated(address: Address, id?: string): Pageable<AccountHarvestInfo[]>;
    /**
     * Gets an array of account importance view model objects.
     * @return Observable<AccountImportanceInfo[]>
     */
    getAccountImportances(): Observable<AccountImportanceInfo[]>;
    /**
     * Gets an array of namespace objects for a given account address.
     * The parent parameter is optional. If supplied, only sub-namespaces of the parent namespace are returned.
     * @param address - Address
     * @param parent - The optional parent namespace id.
     * @param id - The optional namespace database id up to which namespaces are returned.
     * @param pageSize - The (optional) number of namespaces to be returned.
     * @return Observable<Namespace[]>
     */
    getNamespaceOwnedByAddress(address: Address, parent?: string, pageSize?: number, id?: string): Observable<Namespace[]>;
    /**
     * Gets an array of asset definition objects for a given account address. The parent parameter is optional.
     * If supplied, only asset definitions for the given parent namespace are returned.
     * The id parameter is optional and allows retrieving asset definitions in batches of 25 asset definitions.
     * @param address - The address of the account.
     * @param parent - The optional parent namespace id.
     * @param id - The optional asset definition database id up to which asset definitions are returned.
     * @return Observable<AssetDefinition[]>
     */
    getAssetsCreatedByAddress(address: Address, parent?: string, id?: string): Observable<AssetDefinition[]>;
    /**
     * Gets an array of asset objects for a given account address.
     * @param address - Address
     * @return Observable<Asset[]>
     */
    getAssetsOwnedByAddress(address: Address): Observable<Asset[]>;
    /**
     * Unlocks an account (starts harvesting).
     * @param host - string
     * @param privateKey - string
     * @return Observable<boolean>
     */
    unlockHarvesting(host: string, privateKey: string): Observable<boolean>;
    /**
     * Locks an account (stops harvesting).
     * @param host - string
     * @param privateKey - string
     * @return Observable<boolean>
     */
    lockHarvesting(host: string, privateKey: string): Observable<boolean>;
    /**
     * Each node can allow users to harvest with their delegated key on that node.
     * The NIS configuration has entries for configuring the maximum number of allowed harvesters and optionally allow harvesting only for certain account addresses.
     * The unlock info gives information about the maximum number of allowed harvesters and how many harvesters are already using the node.
     * @return Observable<NodeHarvestInfo>
     */
    unlockInfo(): Observable<NodeHarvestInfo>;
    /**
     * Gets historical information for an account.
     * @param address - The address of the account.
     * @param startHeight - The block height from which on the data should be supplied.
     * @param endHeight - The block height up to which the data should be supplied. The end height must be greater than or equal to the start height.
     * @param increment - The value by which the height is incremented between each data point. The value must be greater than 0. NIS can supply up to 1000 data points with one request. Requesting more than 1000 data points results in an error.
     * @return Observable<AccountHistoricalInfo[]>
     */
    getHistoricalAccountData(address: Address, startHeight: number, endHeight: number, increment: number): Observable<AccountHistoricalInfo[]>;
    /**
     * Gets historical information for an array of accounts.
     * @param addresses - The addresses of the accounts as an array of addresses.
     * @param startHeight - The block height from which on the data should be supplied.
     * @param endHeight - The block height up to which the data should be supplied. The end height must be greater than or equal to the start height.
     * @param increment - The value by which the height is incremented between each data point. The value must be greater than 0. NIS can supply up to 1000 data points with one request. Requesting more than 1000 data points results in an error.
     * @return Observable<AccountHistoricalInfo[][]>
     */
    getBatchHistoricalAccountData(addresses: Address[], startHeight: number, endHeight: number, increment: number): Observable<AccountHistoricalInfo[][]>;
    /**
     * Gets batch information for an array of accounts.
     * @param addresses - The addresses of the accounts as an array of addresses.
     * @return Observable<AccountInfoWithMetadata[]>
     */
    getBatchAccountData(addresses: Address[]): Observable<AccountInfoWithMetaData[]>;
}
