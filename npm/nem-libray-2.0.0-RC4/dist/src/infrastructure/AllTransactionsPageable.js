"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pageable_1 = require("./Pageable");
/**
 * @internal
 */
class AllTransactionsPageable extends Pageable_1.Pageable {
    /**
     * @param source
     * @param address
     * @param params
     */
    constructor(source, address, params) {
        super();
        this.resource = source;
        this.address = address;
        this.params = params;
    }
    nextPage() {
        this.resource.allTransactions(this.address, this.params)
            .subscribe((next) => {
            if (next.length != 0) {
                this.params.id = next[next.length - 1].getTransactionInfo().id;
                this.next(next);
            }
            else {
                this.complete();
            }
        }, (err) => {
            this.error(err);
        });
    }
}
exports.AllTransactionsPageable = AllTransactionsPageable;
//# sourceMappingURL=AllTransactionsPageable.js.map