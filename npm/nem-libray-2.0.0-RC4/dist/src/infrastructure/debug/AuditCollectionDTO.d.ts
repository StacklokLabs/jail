export interface AuditCollectionInfoDTO {
    /**
     * 	The relative URL path.
     */
    readonly path: string;
    /**
     * The number of seconds elapsed since the creation of the nemesis block.
     */
    readonly starttime: number;
    /**
     * The host which initiated the request.
     */
    readonly host: string;
    /**
     * The time in seconds that has elapsed since the request was received.
     */
    readonly elapsetime: number;
    /**
     * The unique id of the request.
     */
    readonly id: number;
}
