import { LANDData } from './Ethereum';
import { IEthereumDataProvider } from './IEthereumDataProvider';
import { Coords } from '../utils/coordinateHelpers';
export declare class API implements IEthereumDataProvider {
    private readonly fetcher;
    getEstateIdOfLand({ x, y }: Coords): Promise<number>;
    getEstateData(estateId: number): Promise<LANDData>;
    getEstateOwner(estateId: number): Promise<string>;
    getEstateOperator(estateId: number): Promise<string>;
    getEstateUpdateOperator(estateId: number): Promise<string>;
    getLandOfEstate(estateId: number): Promise<Coords[]>;
    getLandData({ x, y }: Coords): Promise<LANDData>;
    getLandOwner({ x, y }: Coords): Promise<string>;
    getLandOperator({ x, y }: Coords): Promise<string>;
    getLandUpdateOperator({ x, y }: Coords): Promise<string>;
    getLandOf(owner: string): Promise<Coords[]>;
    getEstatesOf(owner: string): Promise<number[]>;
    /**
     * We are making paginated queries to the subgraph, sorting by id and asking for the next ones
     */
    private queryGraphPaginated;
}
//# sourceMappingURL=API.d.ts.map