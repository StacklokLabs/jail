import { Subject } from "rxjs";
/**
 * Pageable class
 */
export declare class Pageable<T> extends Subject<T> {
    /**
     * Execute next page
     */
    nextPage(): void;
}
