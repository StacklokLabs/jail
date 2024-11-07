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
const CreateTransactionFromDTO_1 = require("../../infrastructure/transaction/CreateTransactionFromDTO");
const PublicAccount_1 = require("../account/PublicAccount");
/**
 * 0x68 << 24 + 1 (1744830465 as 4 byte integer): the main network version
 * 0x98 << 24 + 1 (-1744830463 as 4 byte integer): the test network version
 */
var BlockVersion;
(function (BlockVersion) {
    BlockVersion[BlockVersion["MAIN_NET"] = 104] = "MAIN_NET";
    BlockVersion[BlockVersion["TEST_NET"] = 152] = "TEST_NET";
})(BlockVersion = exports.BlockVersion || (exports.BlockVersion = {}));
/**
 * -1: Only the nemesis blockchain has this type.
 * 1: Regular blockchain type.
 */
var BlockType;
(function (BlockType) {
    BlockType[BlockType["NEMESIS"] = -1] = "NEMESIS";
    BlockType[BlockType["REGULAR"] = 1] = "REGULAR";
})(BlockType = exports.BlockType || (exports.BlockType = {}));
/**
 * A blockchain is the structure that contains the transaction information. A blockchain can contain up to 120 transactions. Blocks are generated and signed by accounts and are the instrument by which information is spread in the network.
 */
class Block {
    /**
     * @internal
     * @param height
     * @param type
     * @param timeStamp
     * @param prevBlockHash
     * @param signature
     * @param signer
     * @param transactions
     * @param version
     */
    constructor(height, type, timeStamp, prevBlockHash, signature, signer, transactions, version) {
        this.height = height;
        this.type = type;
        this.timeStamp = timeStamp;
        this.prevBlockHash = prevBlockHash;
        this.signature = signature;
        this.signer = signer;
        this.transactions = transactions;
        this.version = version;
    }
    /**
     * @internal
     * @param dto
     * @returns {Block}
     */
    static createFromBlockDTO(dto) {
        return new Block(dto.height, dto.type, dto.timeStamp, dto.prevBlockHash, dto.signature, PublicAccount_1.PublicAccount.createWithPublicKey(dto.signer), dto.transactions.map((transaction) => CreateTransactionFromDTO_1.CreateSimpleTransactionFromDTO(transaction)), dto.version);
    }
}
exports.Block = Block;
//# sourceMappingURL=Block.js.map