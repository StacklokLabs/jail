import { TronWeb } from '../../tronweb.js';
import { Transaction, TransactionWrapper } from '../../types/Transaction.js';
import HttpProvider from '../providers/HttpProvider.js';
import { ContractParamter, ContractType } from '../../types/Contract.js';
import { TriggerConstantContractOptions } from '../../types/TransactionBuilder.js';
export declare function fromUtf8(value: string): string;
export declare function deepCopyJson<T = unknown>(json: object): T;
export declare function resultManager(transaction: TransactionWrapper, data: unknown, options: TriggerConstantContractOptions): TransactionWrapper;
export declare function resultManagerTriggerSmartContract(transaction: TransactionWrapper, data: unknown, options: TriggerConstantContractOptions): TransactionWrapper;
export declare function genContractAddress(ownerAddress: string, txID: string): string;
export declare function getHeaderInfo(node: HttpProvider): Promise<{
    ref_block_bytes: string;
    ref_block_hash: string;
    expiration: number;
    timestamp: number;
}>;
export declare function createTransaction<T extends ContractParamter>(tronWeb: TronWeb, type: ContractType, value: T, Permission_id?: number, options?: Partial<Omit<Transaction["raw_data"], "contract">>): Promise<Transaction<T>>;
export declare function getTransactionOptions(options?: {
    blockHeader?: Partial<Transaction['raw_data']>;
}): Partial<{
    contract: import("../../types/Transaction.js").TransactionContract<ContractParamter>[];
    ref_block_bytes: string;
    ref_block_hash: string;
    expiration: number;
    timestamp: number;
    data?: unknown;
    fee_limit?: unknown;
}>;
