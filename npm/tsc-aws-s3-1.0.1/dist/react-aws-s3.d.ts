import { IConfig, ListFileErrorResponse, ListFileResponse, UploadResponse } from './types';
declare class ReactS3Client {
    private config;
    constructor(config: IConfig);
    uploadFile(file: File, newFileName?: string): Promise<UploadResponse>;
    deleteFile(key: string): Promise<void>;
    listFiles(): Promise<ListFileResponse | ListFileErrorResponse>;
}
export default ReactS3Client;
