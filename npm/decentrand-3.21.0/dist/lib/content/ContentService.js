"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const events_1 = require("events");
const dcl_catalyst_client_1 = require("dcl-catalyst-client");
const fetch_component_1 = require("@well-known-components/fetch-component");
const errors_1 = require("../../utils/errors");
class ContentService extends events_1.EventEmitter {
    constructor(catalystServerUrl) {
        super();
        this.client = (0, dcl_catalyst_client_1.createCatalystClient)({
            url: catalystServerUrl,
            fetcher: (0, fetch_component_1.createFetchComponent)()
        });
    }
    /**
     * Retrives the uploaded content information by a given Parcel (x y coordinates)
     * @param x
     * @param y
     */
    async getParcelStatus(coordinates) {
        const entity = await this.fetchEntity(coordinates);
        const content = entity.content ? entity.content.map((entry) => ({ name: entry.file, cid: entry.hash })) : [];
        return { cid: entity.id, files: content };
    }
    /**
     * Retrives the content of the scene.json file from the content-server
     * @param x
     * @param y
     */
    async getSceneData(coordinates) {
        try {
            const entity = await this.fetchEntity(coordinates);
            return entity.metadata;
        }
        catch (e) {
            throw e;
        }
    }
    async fetchEntity(coordinates) {
        const pointer = `${coordinates.x},${coordinates.y}`;
        try {
            if (!this.contentClient) {
                this.contentClient = await this.client.getContentClient();
            }
            const entities = await this.contentClient.fetchEntitiesByPointers([pointer]);
            const entity = entities[0];
            if (!entity) {
                (0, errors_1.fail)(errors_1.ErrorType.CONTENT_SERVER_ERROR, `Error retrieving parcel ${coordinates.x},${coordinates.y} information`);
            }
            return entity;
        }
        catch (error) {
            (0, errors_1.fail)(errors_1.ErrorType.CONTENT_SERVER_ERROR, error.message);
            throw error;
        }
    }
}
exports.ContentService = ContentService;
//# sourceMappingURL=ContentService.js.map