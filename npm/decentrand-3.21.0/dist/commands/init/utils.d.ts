import { InitOption } from './types';
export declare function getProjectTypes(): string;
export declare function getInitOption(type?: string): Promise<InitOption>;
export declare function getRepositoryUrl(choice: InitOption): string | void;
export declare function isValidTemplateUrl(url: string): boolean;
//# sourceMappingURL=utils.d.ts.map