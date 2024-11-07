export declare enum FileDescriptorStandardOption {
    SILENT = 1,
    PIPE = 2,
    ONLY_IF_THROW = 3,
    SEND_TO_CALLBACK = 4
}
export declare type FDCallback = {
    onErrorData?: (data: string) => void;
    onOutData?: (data: string) => void;
};
export declare function runCommand({ workingDir, command, args, fdStandards, cb }: {
    workingDir: string;
    command: string;
    args: string[];
    fdStandards?: FileDescriptorStandardOption;
    cb?: FDCallback;
}): Promise<void>;
export declare function downloadRepo(workingDir: string, url: string, destinationPath: string): Promise<void>;
//# sourceMappingURL=shellCommands.d.ts.map