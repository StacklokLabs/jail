export interface MultisigInfoDTO {
    /**
     * The number of cosignatories.
     */
    readonly cosignatoriesCount: number | undefined;
    /**
     * The number of minCosignatories.
     */
    readonly minCosignatories: number | undefined;
}
