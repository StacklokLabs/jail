/**
 *
 * divisibility: defines the smallest sub-unit that a asset can be divided into. A divisibility of 0 means that only entire units can be transferred while a divisibility of 3 means the asset can be transferred in milli-units.
 * initialSupply: defines how many units of the asset are initially created. These assets are credited to the creator of the asset. The initial supply has an upper limit of 9,000,000,000 units.
 * supplyMutable: determines whether or not the supply can be changed by the creator at a later point using a MosaicSupplyChangeTransaction. Possible values are "true" and "false", the former meaning the supply can be changed and the latter that the supply is fixed for all times.
 * transferable: determines whether or not the a mosaic can be transferred to a user other than the creator. In certain scenarios it is not wanted that user are able to trade the mosaic (for example when the mosaic represents bonus points which the company does not want to be tranferable to other users). Possible values are "true" and "false", the former meaning the mosaic can be arbitrarily transferred among users and the latter meaning the mosaic can only be transferred to and from the creator.
 */
export declare type MosaicPropertyName = "divisibility" | "initialSupply" | "supplyMutable" | "transferable";
