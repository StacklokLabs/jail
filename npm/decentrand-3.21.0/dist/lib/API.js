"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const config_1 = require("../config");
const dcl_catalyst_commons_1 = require("dcl-catalyst-commons");
const dclApiUrl = (0, config_1.getConfig)().dclApiUrl;
class API {
    constructor() {
        this.fetcher = new dcl_catalyst_commons_1.Fetcher();
    }
    async getEstateIdOfLand({ x, y }) {
        const query = `query GetEstateIdOfLand($x: Int!, $y: Int!) {
      parcels(where: { x: $x, y: $y }) {
        estate {
          id
        }
      }
    }`;
        const response = await this.fetcher.queryGraph(dclApiUrl, query, { x, y });
        const estate = response.parcels[0].estate;
        if (!estate)
            throw new Error('No estate provided');
        return parseInt(estate.id, 10);
    }
    async getEstateData(estateId) {
        const query = `query GetEstateData($estateId: String!) {
      estates(where:{ id: $estateId }) {
        data {
          name
          description
        }
      }
    }`;
        const response = await this.fetcher.queryGraph(dclApiUrl, query, {
            estateId: `${estateId}`
        });
        return response.estates[0].data ? response.estates[0].data : { name: '', description: '' };
    }
    async getEstateOwner(estateId) {
        const query = `query GetEstateOwner($estateId: String!) {
      estates(where:{ id: $estateId }) {
        owner {
          address
        }
      }
    }`;
        const response = await this.fetcher.queryGraph(dclApiUrl, query, {
            estateId: `${estateId}`
        });
        return response.estates[0].owner.address;
    }
    async getEstateOperator(estateId) {
        const query = `query GetEstateOperator($estateId: String!) {
      estates(where:{ id: $estateId }) {
        operator
      }
    }`;
        const response = await this.fetcher.queryGraph(dclApiUrl, query, {
            estateId: `${estateId}`
        });
        return response.estates[0].operator;
    }
    async getEstateUpdateOperator(estateId) {
        const query = `query GetEstateUpdateOperator($estateId: String!) {
      estates(where:{ id: $estateId }) {
        updateOperator
      }
    }`;
        const response = await this.fetcher.queryGraph(dclApiUrl, query, {
            estateId: `${estateId}`
        });
        return response.estates[0].updateOperator;
    }
    // This is a special case, because some estates have +10000 parcels, and TheGraph doesn't support offsets of more than 5000
    async getLandOfEstate(estateId) {
        const query = `query GetLandOfEstate($estateId: String!, $first: Int!, $lastId: String!) {
      estates(where: { id: $estateId }) {
        parcels (where:{ id_gt: $lastId }, first: $first, orderBy: id) {
          x
          y
          id
        }
      }
    }`;
        const response = await this.queryGraphPaginated(query, { estateId: `${estateId}` }, (result) => result.estates[0].parcels);
        return response.map((parcel) => ({
            x: parseInt(parcel.x, 10),
            y: parseInt(parcel.y, 10)
        }));
    }
    async getLandData({ x, y }) {
        const query = `query GetLandOwner($x: Int!, $y: Int!) {
      parcels(where: { x: $x, y: $y }) {
        data {
          name
          description
          version
        }
      }
    }`;
        const response = await this.fetcher.queryGraph(dclApiUrl, query, { x, y });
        return response.parcels[0].data ? response.parcels[0].data : { name: '', description: '' };
    }
    async getLandOwner({ x, y }) {
        const query = `query GetLandOwner($x: Int!, $y: Int!) {
      parcels(where: { x: $x, y: $y }) {
        owner {
          address
        }
      }
    }`;
        const response = await this.fetcher.queryGraph(dclApiUrl, query, { x, y });
        return response.parcels[0].owner.address;
    }
    async getLandOperator({ x, y }) {
        const query = `query GetLandOperator($x: Int!, $y: Int!) {
      parcels(where: { x: $x, y: $y }) {
        operator
      }
    }`;
        const response = await this.fetcher.queryGraph(dclApiUrl, query, { x, y });
        return response.parcels[0].operator;
    }
    async getLandUpdateOperator({ x, y }) {
        const query = `query GetLandUpdateOperator($x: Int!, $y: Int!) {
      parcels(where: { x: $x, y: $y }) {
        updateOperator
      }
    }`;
        const response = await this.fetcher.queryGraph(dclApiUrl, query, { x, y });
        return response.parcels[0].updateOperator;
    }
    async getLandOf(owner) {
        const query = `query GetLandOf($owner: String!, $first: Int!, $lastId: String!) {
      parcels(where: { owner: $owner, id_gt: $lastId }, first: $first, orderBy: id) {
        id
        x
        y
      }
    }`;
        const response = await this.queryGraphPaginated(query, { owner: owner.toLowerCase() }, (result) => result.parcels);
        return response.map(({ x, y }) => ({
            x: parseInt(x, 10),
            y: parseInt(y, 10)
        }));
    }
    async getEstatesOf(owner) {
        const query = `query GetEstatesOf($owner: String!, $first: Int!, $lastId: String!) {
      estates(where: { owner: $owner, id_gt: $lastId }, first: $first, orderBy: id) {
        id
      }
    }`;
        const response = await this.queryGraphPaginated(query, { owner: owner.toLowerCase() }, (result) => result.estates);
        return response.map(({ id }) => parseInt(id, 10));
    }
    /**
     * We are making paginated queries to the subgraph, sorting by id and asking for the next ones
     */
    async queryGraphPaginated(query, variables, extractArray) {
        const pageSize = 1000;
        let lastId = '';
        let keepGoing = true;
        const finalResult = [];
        while (keepGoing) {
            const result = await this.fetcher.queryGraph(dclApiUrl, query, Object.assign(Object.assign({}, variables), { first: pageSize, lastId }));
            const array = extractArray(result);
            keepGoing = array.length === pageSize;
            lastId = array.length > 0 ? array[array.length - 1].id : undefined;
            finalResult.push(...array);
        }
        return finalResult;
    }
}
exports.API = API;
//# sourceMappingURL=API.js.map