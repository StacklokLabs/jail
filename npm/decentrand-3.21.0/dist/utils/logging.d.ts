export declare function debug(...messages: any[]): void;
export declare function error(message: string): string;
export declare function warning(message: string): string;
export declare function tabulate(spaces?: number): string;
export declare function isEmpty(obj: Record<string, unknown>): boolean;
export declare function formatDictionary(obj: Record<string, unknown>, options: {
    spacing: number;
    padding: number;
}, level?: number, context?: 'array' | 'object'): string;
export declare function formatList(list: Array<any>, options: {
    spacing: number;
    padding: number;
}, level?: number, _context?: 'array' | 'object'): string;
export declare function formatOutdatedMessage(arg: {
    package: string;
    installedVersion: string;
    latestVersion: string;
}): string;
//# sourceMappingURL=logging.d.ts.map