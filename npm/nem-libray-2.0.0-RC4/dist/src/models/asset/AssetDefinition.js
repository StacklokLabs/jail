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
const PublicAccount_1 = require("../account/PublicAccount");
const AssetId_1 = require("./AssetId");
const AssetLevy_1 = require("./AssetLevy");
/**
 * A asset definition describes an asset class. Some fields are mandatory while others are optional.
 * The properties of a asset definition always have a default value and only need to be supplied if they differ from the default value.
 */
class AssetDefinition {
    /**
     * constructor
     * @param creator
     * @param id
     * @param description
     * @param properties
     * @param levy
     * @param metaId
     */
    constructor(creator, id, description, properties, levy, metaId) {
        this.creator = creator;
        this.id = id;
        this.description = description;
        this.properties = properties;
        this.levy = levy;
        this.metaId = metaId;
    }
    /**
     * @internal
     * @param dto
     * @returns {AssetDefinition}
     */
    static createFromMosaicDefinitionDTO(dto) {
        const levy = dto.levy;
        return new AssetDefinition(PublicAccount_1.PublicAccount.createWithPublicKey(dto.creator), AssetId_1.AssetId.createFromMosaicIdDTO(dto.id), dto.description, AssetProperties.createFromMosaicProperties(dto.properties), levy.mosaicId === undefined ? undefined : AssetLevy_1.AssetLevy.createFromMosaicLevyDTO(levy));
    }
    /**
     * @internal
     * @param dto
     * @returns {AssetDefinition}
     */
    static createFromMosaicDefinitionMetaDataPairDTO(dto) {
        const levy = dto.mosaic.levy;
        return new AssetDefinition(PublicAccount_1.PublicAccount.createWithPublicKey(dto.mosaic.creator), AssetId_1.AssetId.createFromMosaicIdDTO(dto.mosaic.id), dto.mosaic.description, AssetProperties.createFromMosaicProperties(dto.mosaic.properties), levy.mosaicId === undefined ? undefined : AssetLevy_1.AssetLevy.createFromMosaicLevyDTO(levy), dto.meta.id);
    }
    /**
     * @internal
     * @returns {{description: string, id: AssetId, levy: (MosaicLevyDTO|{}), properties: MosaicProperty[], creator: string}}
     */
    toDTO() {
        return {
            description: this.description,
            id: this.id,
            levy: this.levy != undefined ? this.levy.toDTO() : null,
            properties: this.properties.toDTO(),
            creator: this.creator.publicKey,
        };
    }
}
exports.AssetDefinition = AssetDefinition;
/**
 * Each asset definition comes with a set of properties.
 * Each property has a default value which will be applied in case it was not specified.
 * Future release may add additional properties to the set of available properties
 */
class AssetProperties {
    /**
     * constructor
     * @param divisibility
     * @param initialSupply
     * @param supplyMutable
     * @param transferable
     */
    constructor(divisibility = 0, initialSupply = 1000, transferable = true, supplyMutable = false) {
        this.initialSupply = initialSupply;
        this.supplyMutable = supplyMutable;
        this.transferable = transferable;
        this.divisibility = divisibility;
    }
    /**
     * @internal
     */
    toDTO() {
        return [
            {
                name: "divisibility",
                value: this.divisibility.toString(),
            },
            {
                name: "initialSupply",
                value: this.initialSupply.toString(),
            },
            {
                name: "supplyMutable",
                value: this.supplyMutable.toString(),
            },
            {
                name: "transferable",
                value: this.transferable.toString(),
            },
        ];
    }
    /**
     * @internal
     * @param dto
     * @returns {AssetProperty}
     */
    static createFromMosaicProperties(mosaicProperties) {
        return new AssetProperties(Number(mosaicProperties[0].value), Number(mosaicProperties[1].value), (mosaicProperties[3].value == "true"), (mosaicProperties[2].value == "true"));
    }
}
exports.AssetProperties = AssetProperties;
//# sourceMappingURL=AssetDefinition.js.map