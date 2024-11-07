import { NetworkTypes } from "../node/NetworkTypes";
/**
 * Address model
 */
export declare class Address {
    private readonly value;
    private readonly networkType;
    constructor(address: string);
    /**
     * Get address in plain format ex: TALICEROONSJCPHC63F52V6FY3SDMSVAEUGHMB7C
     * @returns {string}
     */
    plain(): string;
    /**
     * Get address in pretty format ex: TALICE-ROONSJ-CPHC63-F52V6F-Y3SDMS-VAEUGH-MB7C
     * @returns {string}
     */
    pretty(): string;
    /**
     * Address network
     * @returns {number}
     */
    network(): NetworkTypes;
    equals(otherAddress: Address): boolean;
}
