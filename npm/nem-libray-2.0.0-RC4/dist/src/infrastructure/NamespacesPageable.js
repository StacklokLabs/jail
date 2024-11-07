"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pageable_1 = require("./Pageable");
/**
 * @internal
 */
class NamespacesPageable extends Pageable_1.Pageable {
    constructor(source, params) {
        super();
        this.resource = source;
        this.params = params;
    }
    nextPage() {
        this.resource.getRootNamespaces(this.params.id, this.params.pageSize).subscribe((next) => {
            if (next.length != 0) {
                this.params.id = next[next.length - 1].id;
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
exports.NamespacesPageable = NamespacesPageable;
//# sourceMappingURL=NamespacesPageable.js.map