import { PublicAccount } from "../account/PublicAccount";
import { AssetId } from "./AssetId";
import { AssetLevy } from "./AssetLevy";
/**
 * A asset definition describes an asset class. Some fields are mandatory while others are optional.
 * The properties of a asset definition always have a default value and only need to be supplied if they differ from the default value.
 */
export declare class AssetDefinition {
    /**
     * 	The public key of the asset definition creator.
     */
    readonly creator: PublicAccount;
    /**
     * The asset id
     */
    readonly id: AssetId;
    /**
     * The asset description. The description may have a length of up to 512 characters and cannot be empty.
     */
    readonly description: string;
    /**
     * Asset properties
     */
    readonly properties: AssetProperties;
    /**
     * The optional levy for the asset. A creator can demand that each asset transfer induces an additional fee
     */
    readonly levy?: AssetLevy;
    /**
     * The id for the asset definition object.
     */
    readonly metaId?: number;
    /**
     * constructor
     * @param creator
     * @param id
     * @param description
     * @param properties
     * @param levy
     * @param metaId
     */
    constructor(creator: PublicAccount, id: AssetId, description: string, properties: AssetProperties, levy?: AssetLevy, metaId?: number);
}
/**
 * Each asset definition comes with a set of properties.
 * Each property has a default value which will be applied in case it was not specified.
 * Future release may add additional properties to the set of available properties
 */
export declare class AssetProperties {
    /**
     * initialSupply: The creator can specify an initial supply of assets when creating the definition.
     * The supply is given in entire units of the asset, not in smallest sub-units.
     * The initial supply must be in the range of 0 and 9,000,000,000. The default value is "1000".
     */
    readonly initialSupply: number;
    /**
     * The creator can choose between a definition that allows a asset supply change at a later point or an immutable supply.
     * Allowed values for the property are "true" and "false". The default value is "false".
     */
    readonly supplyMutable: boolean;
    /**
     * The creator can choose if the asset definition should allow for transfers of the asset among accounts other than the creator.
     * If the property 'transferable' is set to "false", only transfer transactions having the creator as sender or as recipient can transfer assets of that type.
     * If set to "true" the assets can be transferred to and from arbitrary accounts.
     * Allowed values for the property are thus "true" and "false". The default value is "true".
     */
    readonly transferable: boolean;
    /**
     * The divisibility determines up to what decimal place the asset can be divided into.
     * Thus a divisibility of 3 means that a asset can be divided into smallest parts of 0.001 assets, i.e. milli assets is the smallest sub-unit.
     * When transferring assets via a transfer transaction the quantity transferred is given in multiples of those smallest parts.
     * The divisibility must be in the range of 0 and 6. The default value is "0".
     */
    readonly divisibility: number;
    /**
     * constructor
     * @param divisibility
     * @param initialSupply
     * @param supplyMutable
     * @param transferable
     */
    constructor(divisibility?: number, initialSupply?: number, transferable?: boolean, supplyMutable?: boolean);
}
