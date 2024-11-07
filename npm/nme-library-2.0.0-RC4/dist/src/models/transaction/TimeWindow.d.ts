import { ChronoUnit, LocalDateTime } from "js-joda";
export declare class TimeWindow {
    static timestampNemesisBlock: number;
    /**
     * The deadline of the transaction. The deadline is given as the number of seconds elapsed since the creation of the nemesis block.
     * If a transaction does not get included in a block before the deadline is reached, it is deleted.
     */
    deadline: LocalDateTime;
    /**
     * The number of seconds elapsed since the creation of the nemesis block.
     */
    timeStamp: LocalDateTime;
    /**
     * @param deadline - LocalDateTime
     * @param timeStamp - LocalDateTime
     */
    constructor(timeStamp: LocalDateTime, deadline: LocalDateTime);
    /**
     * @param deadline
     * @param chronoUnit
     * @returns {TimeWindow}
     */
    static createWithDeadline(deadline?: number, chronoUnit?: ChronoUnit): TimeWindow;
}
