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
const Address_1 = require("../account/Address");
/**
 * A namespace is the NEM version of a domain. You can rent a namespace for the duration of a year by paying a fee.
 * The naming of the parts of a namespace has certain restrictions, see the corresponding chapter on namespaces.
 */
class Namespace {
    /**
     * constructor
     * @internal
     * @param name
     * @param owner
     * @param height
     * @param id
     */
    constructor(name, owner, height, id) {
        this.name = name;
        this.owner = owner;
        this.height = height;
        this.id = id;
    }
    /**
     * @internal
     * @param dto
     * @returns {Namespace}
     */
    static createFromNamespaceMetaDataPairDTO(dto) {
        return new Namespace(dto.namespace.fqn, new Address_1.Address(dto.namespace.owner), dto.namespace.height, dto.meta.id);
    }
    /**
     * @internal
     * @param dto
     * @returns {Namespace}
     */
    static createFromNamespaceDTO(dto) {
        return new Namespace(dto.fqn, new Address_1.Address(dto.owner), dto.height);
    }
}
exports.Namespace = Namespace;
//# sourceMappingURL=Namespace.js.map