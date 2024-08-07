export declare type DateISOString = string;
export declare type XAmzDate = string;
export declare type DateYMD = string;
export interface IConfig {
    bucketName: string;
    dirName?: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    s3Url?: string;
}
declare type GenericType = {
    [key: string]: string;
};
declare type Conditions = [
    GenericType,
    GenericType,
    string[],
    string[],
    string[],
    GenericType,
    GenericType,
    GenericType,
    GenericType,
    GenericType
];
export declare type Policy = {
    conditions: Conditions;
    expiration: DateISOString;
};
export declare type UploadResponse = {
    bucket: string;
    key: string;
    location: string;
    status: number;
};
export declare type DeleteResponse = {
    ok: boolean;
    status: number;
    message: string;
    fileName: string;
};
export declare type ListFileResponse = {
    message: string;
    data: AWS.S3.ListObjectsOutput;
};
export declare type ListFileErrorResponse = {
    err: string;
    errMessage: string;
    data: any;
};
export {};
