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
const Address_1 = require("../../models/account/Address");
const PublicAccount_1 = require("../../models/account/PublicAccount");
const Asset_1 = require("../../models/asset/Asset");
const AssetDefinition_1 = require("../../models/asset/AssetDefinition");
const AssetId_1 = require("../../models/asset/AssetId");
const AssetLevy_1 = require("../../models/asset/AssetLevy");
const XEM_1 = require("../../models/asset/XEM");
const EncryptedMessage_1 = require("../../models/transaction/EncryptedMessage");
const ImportanceTransferTransaction_1 = require("../../models/transaction/ImportanceTransferTransaction");
const AssetDefinitionCreationTransaction_1 = require("../../models/transaction/AssetDefinitionCreationTransaction");
const AssetSupplyChangeTransaction_1 = require("../../models/transaction/AssetSupplyChangeTransaction");
const MultisigAggregateModificationTransaction_1 = require("../../models/transaction/MultisigAggregateModificationTransaction");
const MultisigSignatureTransaction_1 = require("../../models/transaction/MultisigSignatureTransaction");
const MultisigTransaction_1 = require("../../models/transaction/MultisigTransaction");
const PlainMessage_1 = require("../../models/transaction/PlainMessage");
const ProvisionNamespaceTransaction_1 = require("../../models/transaction/ProvisionNamespaceTransaction");
const TimeWindow_1 = require("../../models/transaction/TimeWindow");
const TransactionInfo_1 = require("../../models/transaction/TransactionInfo");
const TransactionTypes_1 = require("../../models/transaction/TransactionTypes");
const TransferTransaction_1 = require("../../models/transaction/TransferTransaction");
/**
 * @internal
 * @param dto
 * @returns {any}
 * @constructor
 */
exports.CreateTransactionFromDTO = (dto) => {
    if (dto.transaction.type == TransactionTypes_1.TransactionTypes.MULTISIG) {
        const transaction = dto.transaction;
        return new MultisigTransaction_1.MultisigTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, exports.CreateTransactionFromDTO({
            meta: {
                height: dto.meta.height,
                id: dto.meta.id,
                hash: dto.meta.hash,
                innerHash: {},
            },
            transaction: transaction.otherTrans,
        }), transaction.fee, transaction.signatures.map((signature) => {
            return new MultisigSignatureTransaction_1.MultisigSignatureTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(signature.timeStamp, signature.deadline), signature.version, new Address_1.Address(signature.otherAccount), new TransactionInfo_1.HashData(signature.otherHash.data), signature.fee, signature.signature, PublicAccount_1.PublicAccount.createWithPublicKey(signature.signer));
        }), transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.MultisigTransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data), new TransactionInfo_1.HashData(dto.meta.innerHash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.TRANSFER) {
        const transaction = dto.transaction;
        let message;
        if (transaction.message.type == 1) {
            message = PlainMessage_1.PlainMessage.createFromDTO(transaction.message.payload);
        }
        else if (transaction.message.type == 2) {
            message = EncryptedMessage_1.EncryptedMessage.createFromDTO(transaction.message.payload);
        }
        else {
            message = PlainMessage_1.EmptyMessage;
        }
        return new TransferTransaction_1.TransferTransaction(new Address_1.Address(transaction.recipient), XEM_1.XEM.fromAbsolute(transaction.amount), TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.fee, message, transaction.signature, transaction.mosaics === undefined ? undefined : transaction.mosaics.map((mosaicDTO) => Asset_1.Asset.createFromMosaicDTO(mosaicDTO)), PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.IMPORTANCE_TRANSFER) {
        const transaction = dto.transaction;
        return new ImportanceTransferTransaction_1.ImportanceTransferTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.mode, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.remoteAccount), transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.PROVISION_NAMESPACE) {
        const transaction = dto.transaction;
        return new ProvisionNamespaceTransaction_1.ProvisionNamespaceTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, new Address_1.Address(transaction.rentalFeeSink), transaction.rentalFee, transaction.newPart, transaction.fee, transaction.signature, transaction.parent == null ? undefined : transaction.parent, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.MULTISIG_AGGREGATE_MODIFICATION) {
        const transaction = dto.transaction;
        return new MultisigAggregateModificationTransaction_1.MultisigAggregateModificationTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.modifications.map((modification) => {
            return new MultisigAggregateModificationTransaction_1.CosignatoryModification(PublicAccount_1.PublicAccount.createWithPublicKey(modification.cosignatoryAccount), modification.modificationType);
        }), transaction.fee, transaction.signature, transaction.minCosignatories === undefined ? undefined : transaction.minCosignatories.relativeChange, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.MOSAIC_DEFINITION_CREATION) {
        const transaction = dto.transaction;
        const levy = transaction.mosaicDefinition.levy.mosaicId === undefined ?
            undefined : AssetLevy_1.AssetLevy.createFromMosaicLevyDTO(transaction.mosaicDefinition.levy);
        const mosaicDefinition = new AssetDefinition_1.AssetDefinition(PublicAccount_1.PublicAccount.createWithPublicKey(transaction.mosaicDefinition.creator), new AssetId_1.AssetId(transaction.mosaicDefinition.id.namespaceId, transaction.mosaicDefinition.id.name), transaction.mosaicDefinition.description, AssetDefinition_1.AssetProperties.createFromMosaicProperties(transaction.mosaicDefinition.properties), levy);
        return new AssetDefinitionCreationTransaction_1.AssetDefinitionCreationTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.creationFee, new Address_1.Address(transaction.creationFeeSink), mosaicDefinition, transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.MOSAIC_SUPPLY_CHANGE) {
        const transaction = dto.transaction;
        return new AssetSupplyChangeTransaction_1.AssetSupplyChangeTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, new AssetId_1.AssetId(transaction.mosaicId.namespaceId, transaction.mosaicId.name), transaction.supplyType, transaction.delta, transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    throw new Error("Unimplemented transaction with type " + dto.transaction.type);
};
/**
 * @internal
 * @param dto
 * @returns {any}
 * @constructor
 */
exports.CreateSimpleTransactionFromDTO = (dto) => {
    if (dto.type == TransactionTypes_1.TransactionTypes.TRANSFER) {
        const transaction = dto;
        let message;
        if (transaction.message.type == 1) {
            message = PlainMessage_1.PlainMessage.createFromDTO(transaction.message.payload);
        }
        else if (transaction.message.type == 2) {
            message = EncryptedMessage_1.EncryptedMessage.createFromDTO(transaction.message.payload);
        }
        else {
            message = PlainMessage_1.EmptyMessage;
        }
        return new TransferTransaction_1.TransferTransaction(new Address_1.Address(transaction.recipient), XEM_1.XEM.fromAbsolute(transaction.amount), TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.fee, message, transaction.signature, transaction.mosaics === undefined ? undefined : transaction.mosaics.map((mosaicDTO) => Asset_1.Asset.createFromMosaicDTO(mosaicDTO)), PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), undefined);
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.IMPORTANCE_TRANSFER) {
        const transaction = dto;
        return new ImportanceTransferTransaction_1.ImportanceTransferTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.mode, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.remoteAccount), transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.MULTISIG_AGGREGATE_MODIFICATION) {
        const transaction = dto;
        return new MultisigAggregateModificationTransaction_1.MultisigAggregateModificationTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.modifications.map((modification) => {
            return new MultisigAggregateModificationTransaction_1.CosignatoryModification(PublicAccount_1.PublicAccount.createWithPublicKey(modification.cosignatoryAccount), modification.modificationType);
        }), transaction.fee, transaction.signature, transaction.minCosignatories === undefined ? undefined : transaction.minCosignatories.relativeChange, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.PROVISION_NAMESPACE) {
        const transaction = dto;
        return new ProvisionNamespaceTransaction_1.ProvisionNamespaceTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, new Address_1.Address(transaction.rentalFeeSink), transaction.rentalFee, transaction.newPart, transaction.fee, transaction.signature, transaction.parent == null ? undefined : transaction.parent, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.MOSAIC_DEFINITION_CREATION) {
        const transaction = dto;
        const levy = transaction.mosaicDefinition.levy.mosaicId === undefined ?
            undefined : AssetLevy_1.AssetLevy.createFromMosaicLevyDTO(transaction.mosaicDefinition.levy);
        const mosaicDefinition = new AssetDefinition_1.AssetDefinition(PublicAccount_1.PublicAccount.createWithPublicKey(transaction.mosaicDefinition.creator), new AssetId_1.AssetId(transaction.mosaicDefinition.id.namespaceId, transaction.mosaicDefinition.id.name), transaction.mosaicDefinition.description, AssetDefinition_1.AssetProperties.createFromMosaicProperties(transaction.mosaicDefinition.properties), levy);
        return new AssetDefinitionCreationTransaction_1.AssetDefinitionCreationTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.creationFee, new Address_1.Address(transaction.creationFeeSink), mosaicDefinition, transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.MOSAIC_SUPPLY_CHANGE) {
        const transaction = dto;
        return new AssetSupplyChangeTransaction_1.AssetSupplyChangeTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, new AssetId_1.AssetId(transaction.mosaicId.namespaceId, transaction.mosaicId.name), transaction.supplyType, transaction.delta, transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.MULTISIG) {
        const transaction = dto;
        return new MultisigTransaction_1.MultisigTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, exports.CreateSimpleTransactionFromDTO(transaction.otherTrans), transaction.fee, transaction.signatures.map((signature) => {
            return new MultisigSignatureTransaction_1.MultisigSignatureTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(signature.timeStamp, signature.deadline), signature.version, new Address_1.Address(signature.otherAccount), new TransactionInfo_1.HashData(signature.otherHash.data), signature.fee, signature.signature, PublicAccount_1.PublicAccount.createWithPublicKey(signature.signer));
        }), transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    throw new Error("Unimplemented other transaction with type " + dto.type);
};
//# sourceMappingURL=CreateTransactionFromDTO.js.map