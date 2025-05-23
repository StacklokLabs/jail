import { JsonRpcPayload, JsonRpcResponse, JsonRpcResponseWithResult, JsonRpcResponseWithError, JsonRpcOptionalRequest, JsonRpcBatchRequest, JsonRpcNotification, JsonRpcRequest, JsonRpcBatchResponse, JsonRpcSubscriptionResult } from 'web3-types';
export declare const isResponseRpcError: (rpcError: JsonRpcResponseWithError) => boolean;
export declare const isResponseWithResult: <Result = unknown, Error_1 = unknown>(response: JsonRpcResponse<Result, Error_1>) => response is JsonRpcResponseWithResult<Result>;
export declare const isResponseWithError: <Error_1 = unknown, Result = unknown>(response: JsonRpcResponse<Result, Error_1>) => response is JsonRpcResponseWithError<Error_1>;
export declare const isResponseWithNotification: <Result>(response: JsonRpcNotification<Result> | JsonRpcSubscriptionResult) => response is JsonRpcNotification<Result>;
export declare const isSubscriptionResult: <Result>(response: JsonRpcSubscriptionResult | JsonRpcNotification<Result>) => response is JsonRpcSubscriptionResult;
export declare const validateResponse: <Result = unknown, Error_1 = unknown>(response: JsonRpcResponse<Result, Error_1>) => boolean;
export declare const isValidResponse: <Result = unknown, Error_1 = unknown>(response: JsonRpcResponse<Result, Error_1>) => boolean;
export declare const isBatchResponse: <Result = unknown, Error_1 = unknown>(response: JsonRpcResponse<Result, Error_1>) => response is JsonRpcBatchResponse<Result, Error_1>;
/**
 * Optionally use to make the jsonrpc `id` start from a specific number.
 * Without calling this function, the `id` will be filled with a Uuid.
 * But after this being called with a number, the `id` will be a number starting from the provided `start` variable.
 * However, if `undefined` was passed to this function, the `id` will be a Uuid again.
 * @param start - a number to start incrementing from.
 * 	Or `undefined` to use a new Uuid (this is the default behavior)
 */
export declare const setRequestIdStart: (start: number | undefined) => void;
export declare const toPayload: <ParamType = unknown[]>(request: JsonRpcOptionalRequest<ParamType>) => JsonRpcPayload<ParamType>;
export declare const toBatchPayload: (requests: JsonRpcOptionalRequest<unknown>[]) => JsonRpcBatchRequest;
export declare const isBatchRequest: (request: JsonRpcBatchRequest | JsonRpcRequest<unknown> | JsonRpcOptionalRequest<unknown>) => request is JsonRpcBatchRequest;
//# sourceMappingURL=json_rpc.d.ts.map