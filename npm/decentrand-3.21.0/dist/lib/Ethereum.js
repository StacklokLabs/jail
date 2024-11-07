"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ethereum = exports.NETWORKS = exports.providerInstance = void 0;
const events_1 = require("events");
const eth_connect_1 = require("eth-connect");
const errors_1 = require("../utils/errors");
const coordinateHelpers_1 = require("../utils/coordinateHelpers");
const land_1 = require("../utils/land");
const env_1 = require("../utils/env");
const config_1 = require("../config");
const MANAToken_json_1 = require("../../abi/MANAToken.json");
const LANDRegistry_json_1 = require("../../abi/LANDRegistry.json");
const EstateRegistry_json_1 = require("../../abi/EstateRegistry.json");
const { provider } = (0, config_1.getConfig)();
exports.providerInstance = new eth_connect_1.HTTPProvider(provider);
const requestManager = new eth_connect_1.RequestManager(exports.providerInstance);
exports.providerInstance.debug = (0, env_1.isDebug)();
const manaFactory = new eth_connect_1.ContractFactory(requestManager, MANAToken_json_1.abi);
const landFactory = new eth_connect_1.ContractFactory(requestManager, LANDRegistry_json_1.abi);
const estateFactory = new eth_connect_1.ContractFactory(requestManager, EstateRegistry_json_1.abi);
const factories = new Map();
factories.set('MANAToken', manaFactory);
factories.set('LANDRegistry', landFactory);
factories.set('EstateRegistry', estateFactory);
var NETWORKS;
(function (NETWORKS) {
    NETWORKS["mainnet"] = "mainnet";
    NETWORKS["sepolia"] = "sepolia";
})(NETWORKS = exports.NETWORKS || (exports.NETWORKS = {}));
/**
 * Events emitted by this class:
 *
 */
class Ethereum extends events_1.EventEmitter {
    static async getContract(name) {
        const contract = this.contracts.get(name);
        if (contract) {
            return contract;
        }
        const config = (0, config_1.getConfig)();
        const address = config[name];
        const factory = factories.get(name);
        const factoryContract = (await factory.at(address));
        this.contracts.set(name, factoryContract);
        return factoryContract;
    }
    async getLandOf(address) {
        const contract = await Ethereum.getContract('LANDRegistry');
        try {
            const [x, y] = (await contract['landOf'](address.toUpperCase()));
            return x.map(($, i) => ({
                x: $.toNumber(),
                y: y[i].toNumber()
            }));
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch LANDs: ${e.message}`);
            throw e;
        }
    }
    async getEstatesOf(address) {
        const contract = await Ethereum.getContract('EstateRegistry');
        try {
            const balance = (await contract['balanceOf'](address));
            const requests = [];
            for (let i = 0; i < balance; i++) {
                const request = contract['tokenOfOwnerByIndex'](address, i);
                requests.push(request);
            }
            return Promise.all(requests);
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch Estate IDs of owner: ${e.message}`);
            throw e;
        }
        return [];
    }
    async getLandData({ x, y }) {
        const contract = await Ethereum.getContract('LANDRegistry');
        try {
            const landData = (await contract['landData'](x, y));
            return (0, land_1.filterAndFillEmpty)(this.decodeLandData(landData));
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch LAND data: ${e.message}`);
            throw e;
        }
    }
    async getEstateData(estateId) {
        const contract = await Ethereum.getContract('EstateRegistry');
        try {
            const landData = (await contract['getMetadata'](estateId));
            return (0, land_1.filterAndFillEmpty)(this.decodeLandData(landData));
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch LAND data: ${e.message}`);
            throw e;
        }
    }
    async getLandOwner({ x, y }) {
        const contract = await Ethereum.getContract('LANDRegistry');
        try {
            return contract['ownerOfLand'](x, y);
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch LAND owner: ${e.message}`);
            throw e;
        }
    }
    async getLandOperator({ x, y }) {
        const contract = await Ethereum.getContract('LANDRegistry');
        try {
            const assetId = (await contract['encodeTokenId'](x, y));
            return contract['getApproved'](assetId);
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch LAND operator: ${e.message}`);
            throw e;
        }
    }
    async getLandUpdateOperator({ x, y }) {
        const contract = await Ethereum.getContract('LANDRegistry');
        try {
            const assetId = (await contract['encodeTokenId'](x, y));
            return contract['updateOperator'](assetId);
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch LAND update operator: ${e.message}`);
            throw e;
        }
    }
    async getEstateOwner(estateId) {
        const contract = await Ethereum.getContract('EstateRegistry');
        try {
            return contract['ownerOf'](estateId);
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch LAND owner: ${e.message}`);
            throw e;
        }
    }
    async getEstateOperator(estateId) {
        const contract = await Ethereum.getContract('EstateRegistry');
        try {
            return contract['getApproved'](estateId);
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch Estate operator: ${e.message}`);
            throw e;
        }
    }
    async getEstateUpdateOperator(estateId) {
        const contract = await Ethereum.getContract('EstateRegistry');
        try {
            return contract['updateOperator'](estateId);
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch Estate update operator: ${e.message}`);
            throw e;
        }
    }
    async validateAuthorization(owner, parcels) {
        const validations = parcels.map((parcel) => this.validateAuthorizationOfParcel(owner, parcel));
        return Promise.all(validations);
    }
    /**
     * It fails if the owner address isn't able to update given parcel (as an owner or operator)
     */
    async validateAuthorizationOfParcel(owner, parcel) {
        const isLandOperator = await this.isLandOperator(parcel, owner);
        if (!isLandOperator) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Provided address ${owner} is not authorized to update LAND ${parcel.x},${parcel.y}`);
        }
    }
    async getLandOfEstate(estateId) {
        const contract = await Ethereum.getContract('EstateRegistry');
        const landContract = await Ethereum.getContract('LANDRegistry');
        try {
            const estateSize = (await contract['getEstateSize'](estateId));
            const promiseParcels = [];
            for (let i = 0; i < estateSize; i++) {
                const request = contract['estateLandIds'](estateId, i).then((p) => {
                    return landContract['decodeTokenId']([p]);
                });
                promiseParcels.push(request);
            }
            const parcels = (await Promise.all(promiseParcels)).map(coordinateHelpers_1.getObject);
            return parcels;
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch LANDs of Estate: ${e.message}`);
            throw e;
        }
    }
    async getEstateIdOfLand({ x, y }) {
        const contract = await Ethereum.getContract('EstateRegistry');
        const landContract = await Ethereum.getContract('LANDRegistry');
        try {
            const assetId = (await landContract['encodeTokenId'](x, y));
            return contract['getLandEstateId'](assetId);
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch Estate ID of LAND: ${e.message}`);
            throw e;
        }
    }
    async isLandOperator(coords, owner) {
        const contract = await Ethereum.getContract('LANDRegistry');
        const estate = await this.getEstateIdOfLand(coords);
        if (estate && estate > 0) {
            return this.isEstateOperator(estate, owner);
        }
        try {
            const { x, y } = coords;
            const assetId = (await contract['encodeTokenId'](x, y));
            return contract['isUpdateAuthorized'](owner.toLowerCase(), assetId.toString());
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch LAND authorization: ${JSON.stringify(e)}`);
            throw e;
        }
    }
    async isEstateOperator(estateId, owner) {
        const contract = await Ethereum.getContract('EstateRegistry');
        try {
            return contract['isUpdateAuthorized'](owner, estateId);
        }
        catch (e) {
            (0, errors_1.fail)(errors_1.ErrorType.ETHEREUM_ERROR, `Unable to fetch Estate authorization: ${e.message}`);
            throw e;
        }
    }
    decodeLandData(data = '') {
        if (data === '') {
            return null;
        }
        const [, name, description] = data.split(',').map((field) => {
            return field.slice(1, -1);
        });
        return { version: 0, name: name || null, description: description || null };
    }
}
exports.Ethereum = Ethereum;
Ethereum.contracts = new Map();
//# sourceMappingURL=Ethereum.js.map