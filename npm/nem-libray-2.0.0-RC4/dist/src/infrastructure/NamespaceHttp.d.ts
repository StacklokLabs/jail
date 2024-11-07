import { Observable } from "rxjs";
import { QueryParams } from "./AccountHttp";
import { Namespace } from "../models/namespace/Namespace";
import { HttpEndpoint, ServerConfig } from "./HttpEndpoint";
import { Pageable } from "./Pageable";
export declare class NamespaceHttp extends HttpEndpoint {
    constructor(nodes?: ServerConfig[]);
    /**
     * Paginaged version of incomingTransactions request
     * @param address
     * @param params
     */
    getRootNamespacesPaginated(params?: QueryParams): Pageable<Namespace[]>;
    /**
     * Gets the root namespaces. The requests supports paging, i.e. retrieving the root namespaces in batches of a specified size.
     * @param id - The topmost namespace database id up to which root namespaces are returned. The parameter is optional. If not supplied the most recent rented root namespaces are returned.
     * @param pageSize - (Optional) The number of namespace objects to be returned for each request. The parameter is optional. The default value is 25, the minimum value is 5 and the maximum value is 100.
     * @returns Observable<Namespace[]>
     */
    getRootNamespaces(id?: number, pageSize?: number): Observable<Namespace[]>;
    /**
     * Gets the namespace with given id.
     * @param namespace - The namespace id.
     * @returns Observable<Namespace>
     */
    getNamespace(namespace: string): Observable<Namespace>;
}
