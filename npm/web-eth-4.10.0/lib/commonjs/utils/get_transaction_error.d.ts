import { Web3Context } from 'web3-core';
import { TransactionRevertedWithoutReasonError, TransactionRevertInstructionError, TransactionRevertWithCustomError } from 'web3-errors';
import { DataFormat, FormatType, ContractAbi, TransactionCall, TransactionReceipt } from 'web3-types';
import { RevertReason, RevertReasonWithCustomError } from '../types.js';
export declare function getTransactionError<ReturnFormat extends DataFormat>(web3Context: Web3Context, transactionFormatted?: TransactionCall, transactionReceiptFormatted?: FormatType<TransactionReceipt, ReturnFormat>, receivedError?: unknown, contractAbi?: ContractAbi, knownReason?: string | RevertReason | RevertReasonWithCustomError): Promise<TransactionRevertedWithoutReasonError<{
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
}> | TransactionRevertInstructionError<{
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
}> | TransactionRevertWithCustomError<{
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
}>>;
