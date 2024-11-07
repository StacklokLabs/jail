"use strict";
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 NEM
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const requestPromise = require("request-promise-native");
const rxjs_1 = require("rxjs");
const models_1 = require("../models");
const AccountHarvestInfo_1 = require("../models/account/AccountHarvestInfo");
const AccountHistoricalInfo_1 = require("../models/account/AccountHistoricalInfo");
const AccountImportanceInfo_1 = require("../models/account/AccountImportanceInfo");
const AccountInfo_1 = require("../models/account/AccountInfo");
const NodeHarvestInfo_1 = require("../models/account/NodeHarvestInfo");
const Asset_1 = require("../models/asset/Asset");
const AssetDefinition_1 = require("../models/asset/AssetDefinition");
const Namespace_1 = require("../models/namespace/Namespace");
const AllTransactionsPageable_1 = require("./AllTransactionsPageable");
const HarvestInfoPageable_1 = require("./HarvestInfoPageable");
const HttpEndpoint_1 = require("./HttpEndpoint");
const IncomingTransactionsPageable_1 = require("./IncomingTransactionsPageable");
const OutgoingTransactionsPageable_1 = require("./OutgoingTransactionsPageable");
const CreateTransactionFromDTO_1 = require("./transaction/CreateTransactionFromDTO");
const CreateUnconfirmedTransactionFromDTO_1 = require("./transaction/CreateUnconfirmedTransactionFromDTO");
const operators_1 = require("rxjs/operators");
/**
 *
 */
class AccountHttp extends HttpEndpoint_1.HttpEndpoint {
    constructor(nodes) {
        super("account", nodes);
    }
    /**
     * Gets an AccountInfoWithMetaData for an account.
     * @param address - Address
     * @return Observable<AccountInfoWithMetaData>
     */
    getFromAddress(address) {
        return rxjs_1.of("get?address=" + address.plain())
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((accountMetaDataPairDTO) => {
            return AccountInfo_1.AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(accountMetaDataPairDTO);
        }));
    }
    /**
     * Gets an AccountInfoWithMetaData for an account with publicKey
     * @param publicKey - NEM
     * @return Observable<AccountInfoWithMetaData>
     */
    getFromPublicKey(publicKey) {
        return rxjs_1.of("get/from-public-key?publicKey=" + publicKey)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((accountMetaDataPairDTO) => {
            return AccountInfo_1.AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(accountMetaDataPairDTO);
        }));
    }
    /**
     * Given a delegate (formerly known as remote) account's address, gets the AccountMetaDataPair for the account for which the given account is the delegate account.
     * If the given account address is not a delegate account for any account, the request returns the AccountMetaDataPair for the given address.
     * @param address - Address
     * @return Observable<AccountInfoWithMetaData>
     */
    getOriginalAccountDataFromDelegatedAccountAddress(address) {
        return rxjs_1.of("get/forwarded?address=" + address.plain())
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((accountMetaDataPairDTO) => {
            return AccountInfo_1.AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(accountMetaDataPairDTO);
        }));
    }
    /**
     * retrieve the original account data by providing the public key of the delegate account.
     * @param publicKey - string
     * @return Observable<AccountInfoWithMetaData>
     */
    getOriginalAccountDataFromDelegatedAccountPublicKey(publicKey) {
        return rxjs_1.of("get/forwarded/from-public-key?publicKey=" + publicKey)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((accountMetaDataPairDTO) => {
            return AccountInfo_1.AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(accountMetaDataPairDTO);
        }));
    }
    /**
     * Gets the AccountMetaData from an account.
     * @param address - NEM Address
     * @return Observable<AccountStatus>
     */
    status(address) {
        return rxjs_1.of("status?address=" + address.plain())
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((result) => models_1.AccountStatus.createFromAccountMetaDataDTO(result)));
    }
    /**
     * A transaction is said to be incoming with respect to an account if the account is the recipient of the transaction.
     * In the same way outgoing transaction are the transactions where the account is the sender of the transaction.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block
     * @param address - The address of the account.
     * @param params
     */
    incomingTransactions(address, params) {
        if (params == undefined)
            params = {};
        params.pageSize = params.pageSize && (params.pageSize >= 5 && params.pageSize <= 100) ? params.pageSize : 10;
        const url = "transfers/incoming?address=" + address.plain() +
            (params.hash === undefined ? "" : "&hash=" + params.hash) +
            (params.id === undefined ? "" : "&id=" + params.id) +
            (params.pageSize === undefined ? "" : "&pageSize=" + params.pageSize);
        return rxjs_1.of(url)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((transactions) => transactions.data.map((dto) => CreateTransactionFromDTO_1.CreateTransactionFromDTO(dto))));
    }
    /**
     * Paginaged version of incomingTransactions request
     * @param address
     * @param params
     */
    incomingTransactionsPaginated(address, params) {
        if (params === undefined)
            params = {};
        return new IncomingTransactionsPageable_1.IncomingTransactionsPageable(this, address, params);
    }
    /**
     * Gets an array of transaction meta data pairs where the recipient has the address given as parameter to the request.
     * A maximum of 25 transaction meta data pairs is returned. For details about sorting and discussion of the second parameter see Incoming transactions.
     * @param address - The address of the account.
     * @param params
     */
    outgoingTransactions(address, params) {
        if (params == undefined)
            params = {};
        params.pageSize = params.pageSize && (params.pageSize >= 5 && params.pageSize <= 100) ? params.pageSize : 10;
        const url = "transfers/outgoing?address=" + address.plain() +
            (params.hash === undefined ? "" : "&hash=" + params.hash) +
            (params.id === undefined ? "" : "&id=" + params.id) +
            (params.pageSize === undefined ? "" : "&pageSize=" + params.pageSize);
        return rxjs_1.of(url)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((transactions) => transactions.data.map((dto) => CreateTransactionFromDTO_1.CreateTransactionFromDTO(dto))));
    }
    /**
     * Paginaged version of outgoingTransactions request
     * @param address
     * @param params
     * @param params
     */
    outgoingTransactionsPaginated(address, params) {
        if (params === undefined)
            params = {};
        return new OutgoingTransactionsPageable_1.OutgoingTransactionsPageable(this, address, params);
    }
    /**
     * Gets an array of transaction meta data pairs for which an account is the sender or receiver.
     * A maximum of 25 transaction meta data pairs is returned.
     * For details about sorting and discussion of the second parameter see Incoming transactions.
     * @param address - The address of the account.
     * @param params
     */
    allTransactions(address, params) {
        if (params == undefined)
            params = {};
        params.pageSize = params.pageSize && (params.pageSize >= 5 && params.pageSize <= 100) ? params.pageSize : 10;
        const url = "transfers/all?address=" + address.plain() +
            (params.hash === undefined ? "" : "&hash=" + params.hash) +
            (params.id === undefined ? "" : "&id=" + params.id) +
            (params.pageSize === undefined ? "" : "&pageSize=" + params.pageSize);
        return rxjs_1.of(url)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((transactions) => transactions.data.map((dto) => CreateTransactionFromDTO_1.CreateTransactionFromDTO(dto))));
    }
    /**
     * Paginaged version of allTransactions request
     * @param address
     * @param params
     */
    allTransactionsPaginated(address, params) {
        if (params === undefined)
            params = {};
        return new AllTransactionsPageable_1.AllTransactionsPageable(this, address, params);
    }
    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block
     * @param address - NEM Address
     * @return Observable<Transaction[]>
     */
    unconfirmedTransactions(address) {
        return rxjs_1.of("unconfirmedTransactions?address=" + address.plain())
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((unconfirmedTransactions) => {
            return unconfirmedTransactions.data.map((unconfirmedTransaction) => {
                return CreateUnconfirmedTransactionFromDTO_1.CreateUnconfirmedTransactionFromDTO(unconfirmedTransaction);
            });
        }));
    }
    /**
     * Gets an array of harvest info objects for an account.
     * @param address - Address
     * @param id - string (optional)
     * @return Observable<AccountHarvestInfo[]>
     */
    getHarvestInfoDataForAnAccount(address, id) {
        const url = "harvests?address=" + address.plain() +
            (id === undefined ? "" : "&id=" + id);
        return rxjs_1.of(url)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((harvestInfoData) => {
            return harvestInfoData.data.map((harvestInfoDTO) => {
                return AccountHarvestInfo_1.AccountHarvestInfo.createFromHarvestInfoDTO(harvestInfoDTO);
            });
        }));
    }
    /**
     * Paginaged version of allTransactions request
     * @param address
     * @param id
     * @returns {HarvestInfoPageable}
     */
    getHarvestInfoDataForAnAccountPaginated(address, id) {
        return new HarvestInfoPageable_1.HarvestInfoPageable(this, address, id);
    }
    /**
     * Gets an array of account importance view model objects.
     * @return Observable<AccountImportanceInfo[]>
     */
    getAccountImportances() {
        return rxjs_1.of("importances")
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((importanceData) => {
            return importanceData.data.map((accountImportanceViewModel) => {
                return AccountImportanceInfo_1.AccountImportanceInfo.createFromAccountImportanceViewModelDTO(accountImportanceViewModel);
            });
        }));
    }
    /**
     * Gets an array of namespace objects for a given account address.
     * The parent parameter is optional. If supplied, only sub-namespaces of the parent namespace are returned.
     * @param address - Address
     * @param parent - The optional parent namespace id.
     * @param id - The optional namespace database id up to which namespaces are returned.
     * @param pageSize - The (optional) number of namespaces to be returned.
     * @return Observable<Namespace[]>
     */
    getNamespaceOwnedByAddress(address, parent, pageSize, id) {
        const url = "namespace/page?address=" + address.plain() +
            (parent === undefined ? "" : "&parent=" + parent) +
            (id === undefined ? "" : "&id=" + id) +
            (pageSize === undefined ? "" : "&pageSize=" + pageSize);
        return rxjs_1.of(url)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((namespacesData) => {
            return namespacesData.data.map((namespaceDTO) => {
                return Namespace_1.Namespace.createFromNamespaceDTO(namespaceDTO);
            });
        }));
    }
    /**
     * Gets an array of asset definition objects for a given account address. The parent parameter is optional.
     * If supplied, only asset definitions for the given parent namespace are returned.
     * The id parameter is optional and allows retrieving asset definitions in batches of 25 asset definitions.
     * @param address - The address of the account.
     * @param parent - The optional parent namespace id.
     * @param id - The optional asset definition database id up to which asset definitions are returned.
     * @return Observable<AssetDefinition[]>
     */
    getAssetsCreatedByAddress(address, parent, id) {
        const url = "mosaic/definition/page?address=" + address.plain() +
            (parent === undefined ? "" : "&parent=" + parent) +
            (id === undefined ? "" : "&id=" + id);
        return rxjs_1.of(url)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((mosaicsData) => {
            return mosaicsData.data.map((mosaicDefinitionDTO) => {
                return AssetDefinition_1.AssetDefinition.createFromMosaicDefinitionDTO(mosaicDefinitionDTO);
            });
        }));
    }
    /**
     * Gets an array of asset objects for a given account address.
     * @param address - Address
     * @return Observable<Asset[]>
     */
    getAssetsOwnedByAddress(address) {
        return rxjs_1.of("mosaic/owned?address=" + address.plain())
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((mosaicsData) => {
            return mosaicsData.data.map((mosaicDTO) => {
                return Asset_1.Asset.createFromMosaicDTO(mosaicDTO);
            });
        }));
    }
    /**
     * Unlocks an account (starts harvesting).
     * @param host - string
     * @param privateKey - string
     * @return Observable<boolean>
     */
    unlockHarvesting(host, privateKey) {
        return rxjs_1.from(requestPromise.post({
            uri: "http://" + host + ":7890/account/unlock",
            body: {
                value: privateKey,
            },
            json: true,
        }).promise())
            .pipe(operators_1.map((x) => true));
    }
    /**
     * Locks an account (stops harvesting).
     * @param host - string
     * @param privateKey - string
     * @return Observable<boolean>
     */
    lockHarvesting(host, privateKey) {
        return rxjs_1.from(requestPromise.post({
            uri: "http://" + host + ":7890/account/lock",
            body: {
                value: privateKey,
            },
            json: true,
        }).promise())
            .pipe(operators_1.map((x) => true));
    }
    /**
     * Each node can allow users to harvest with their delegated key on that node.
     * The NIS configuration has entries for configuring the maximum number of allowed harvesters and optionally allow harvesting only for certain account addresses.
     * The unlock info gives information about the maximum number of allowed harvesters and how many harvesters are already using the node.
     * @return Observable<NodeHarvestInfo>
     */
    unlockInfo() {
        return rxjs_1.of("unlocked/info")
            .pipe(operators_1.flatMap((url) => requestPromise.post({
            uri: this.nextNode() + url,
            json: true,
        })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((nodeHarvestInfo) => {
            return new NodeHarvestInfo_1.NodeHarvestInfo(nodeHarvestInfo["max-unlocked"], nodeHarvestInfo["num-unlocked"]);
        }));
    }
    /**
     * Gets historical information for an account.
     * @param address - The address of the account.
     * @param startHeight - The block height from which on the data should be supplied.
     * @param endHeight - The block height up to which the data should be supplied. The end height must be greater than or equal to the start height.
     * @param increment - The value by which the height is incremented between each data point. The value must be greater than 0. NIS can supply up to 1000 data points with one request. Requesting more than 1000 data points results in an error.
     * @return Observable<AccountHistoricalInfo[]>
     */
    getHistoricalAccountData(address, startHeight, endHeight, increment) {
        return rxjs_1.of("historical/get?address=" + address.plain() + "&startHeight=" + startHeight + "&endHeight=" + endHeight + "&increment=" + increment)
            .pipe(operators_1.flatMap((url) => requestPromise.get(this.nextHistoricalNode() + url, { json: true })), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((historicalAccountData) => {
            return historicalAccountData.data.map((accountHistoricalDataViewModelDTO) => {
                return AccountHistoricalInfo_1.AccountHistoricalInfo.createFromAccountHistoricalDataViewModelDTO(accountHistoricalDataViewModelDTO);
            });
        }));
    }
    /**
     * Gets historical information for an array of accounts.
     * @param addresses - The addresses of the accounts as an array of addresses.
     * @param startHeight - The block height from which on the data should be supplied.
     * @param endHeight - The block height up to which the data should be supplied. The end height must be greater than or equal to the start height.
     * @param increment - The value by which the height is incremented between each data point. The value must be greater than 0. NIS can supply up to 1000 data points with one request. Requesting more than 1000 data points results in an error.
     * @return Observable<AccountHistoricalInfo[][]>
     */
    getBatchHistoricalAccountData(addresses, startHeight, endHeight, increment) {
        return rxjs_1.of("historical/get/batch")
            .pipe(operators_1.flatMap((url) => {
            return requestPromise.post({
                uri: this.nextHistoricalNode() + url,
                body: {
                    accounts: addresses.map((a) => {
                        return { account: a.plain() };
                    }),
                    startHeight: (startHeight),
                    endHeight: (endHeight),
                    incrementBy: increment,
                },
                json: true,
            });
        }), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((batchHistoricalAccountData) => {
            return batchHistoricalAccountData.data.map((historicalAccountData) => {
                return historicalAccountData.data.map((accountHistoricalDataViewModelDTO) => {
                    return AccountHistoricalInfo_1.AccountHistoricalInfo.createFromAccountHistoricalDataViewModelDTO(accountHistoricalDataViewModelDTO);
                });
            });
        }));
    }
    /**
     * Gets batch information for an array of accounts.
     * @param addresses - The addresses of the accounts as an array of addresses.
     * @return Observable<AccountInfoWithMetadata[]>
     */
    getBatchAccountData(addresses) {
        return rxjs_1.of("get/batch")
            .pipe(operators_1.flatMap((url) => {
            const options = {
                uri: this.nextNode() + url,
                body: {
                    data: addresses.map((a) => {
                        return { account: a.plain() };
                    }),
                },
                json: true,
            };
            return requestPromise.post(options);
        }), operators_1.retryWhen(this.replyWhenRequestError), operators_1.map((batchAccountData) => {
            return batchAccountData.data.map((accountMetaDataPairDTO) => {
                return AccountInfo_1.AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(accountMetaDataPairDTO);
            });
        }));
    }
}
exports.AccountHttp = AccountHttp;
//# sourceMappingURL=AccountHttp.js.map