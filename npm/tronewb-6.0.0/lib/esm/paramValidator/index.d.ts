export type ValidatorParamType = {
    value?: string | number | boolean | Record<string, unknown> | unknown[];
    type: unknown;
    name?: string;
    msg?: string;
    names?: string[];
    gt?: number;
    lt?: number;
    gte?: number;
    lte?: number;
    se?: number;
    optional?: boolean;
};
export declare class Validator {
    invalid(param: ValidatorParamType): string;
    notPositive(param: ValidatorParamType): string;
    notEqual(param: ValidatorParamType): string;
    notValid(params: ValidatorParamType[]): boolean;
}
