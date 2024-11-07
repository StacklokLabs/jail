import { HashData } from "../../infrastructure/transaction/HashData";
/**
 * 1: The result is a validation result.
 * 2: The result is a heart beat result.
 * 4: The result indicates a status.
 */
export declare enum TypeNemAnnounceResult {
    Validation = 1,
    HeartBeat = 2,
    Status = 4,
}
/**
 * The meaning of the code is dependent on the type.
 * For type 1 (validation result) only 0 and 1 mean there was no failure.
 * 0: Neutral result. A typical example would be that a node validates an incoming transaction and realizes that it already knows about the transaction. In this case it is neither a success (meaning the node has a new transaction) nor a failure (because the transaction itself is valid).
 * 1: Success result. A typical example would be that a node validates a new valid transaction.
 * 2: Unknown failure. The validation failed for unknown reasons.
 * 3: The entity that was validated has already past its deadline.
 * 4: The entity used a deadline which lies too far in the future.
 * 5: There was an account involved which had an insufficient balance to perform the operation.
 * 6: The message supplied with the transaction is too large.
 * 7: The hash of the entity which got validated is already in the database.
 * 8: The signature of the entity could not be validated.
 * 9: The entity used a timestamp that lies too far in the past.
 * 10: The entity used a timestamp that lies in the future which is not acceptable.
 * 11: The entity is unusable.
 * 12: The score of the remote block chain is inferior (although a superior score was promised).
 * 13: The remote block chain failed validation.
 * 14: There was a conflicting importance transfer detected.
 * 15: There were too many transaction in the supplied block.
 * 16: The block contains a transaction that was signed by the harvester.
 * 17: A previous importance transaction conflicts with a new transaction.
 * 18: An importance transfer activation was attempted while previous one is active.
 * 19: An importance transfer deactivation was attempted but is not active.
 *
 * For type 2 the following codes are supported:
 *
 * 1: Successful heart beat detected.
 *
 * For type 3 the following codes are supported:
 *
 * 0: Unknown status.
 * 1: NIS is stopped.
 * 2: NIS is starting.
 * 3: NIS is running.
 * 4: NIS is booting the local node (implies NIS is running).
 * 5: The local node is booted (implies NIS is running).
 * 6: The local node is synchronized (implies NIS is running and the local node is booted).
 * 7: There is no remote node available (implies NIS is running and the local node is booted).
 * 8: NIS is currently loading the block chain.
 */
export declare type CodeNemAnnounceResult = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;
/**
 * The NemAnnounceResult extends the NemRequestResult by supplying the additional fields 'transactionHash' and in case of a multisig transaction 'innerTransactionHash'.
 */
export declare class NemAnnounceResult {
    /**
     * The type is dependent on the request which was answered.
     */
    readonly type: TypeNemAnnounceResult;
    /**
     * The meaning of the code is dependent on the type.
     */
    readonly code: CodeNemAnnounceResult;
    /**
     * Error or success message
     */
    readonly message: string;
    /**
     * The JSON hash object of the transaction.
     */
    readonly transactionHash: HashData;
    /**
     * The JSON hash object of the inner transaction or null if the transaction is not a multisig transaction.
     */
    readonly innerTransactionHash: HashData;
}
