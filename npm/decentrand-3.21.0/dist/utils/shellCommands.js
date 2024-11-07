"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadRepo = exports.runCommand = exports.FileDescriptorStandardOption = void 0;
const child_process_1 = require("child_process");
var FileDescriptorStandardOption;
(function (FileDescriptorStandardOption) {
    FileDescriptorStandardOption[FileDescriptorStandardOption["SILENT"] = 1] = "SILENT";
    FileDescriptorStandardOption[FileDescriptorStandardOption["PIPE"] = 2] = "PIPE";
    FileDescriptorStandardOption[FileDescriptorStandardOption["ONLY_IF_THROW"] = 3] = "ONLY_IF_THROW";
    FileDescriptorStandardOption[FileDescriptorStandardOption["SEND_TO_CALLBACK"] = 4] = "SEND_TO_CALLBACK";
})(FileDescriptorStandardOption = exports.FileDescriptorStandardOption || (exports.FileDescriptorStandardOption = {}));
function runCommand({ workingDir, command, args, fdStandards, cb }) {
    const standardOption = fdStandards || FileDescriptorStandardOption.SILENT;
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)(command, args, {
            shell: true,
            cwd: workingDir,
            env: Object.assign(Object.assign({}, process.env), { NODE_ENV: '' })
        });
        let stdOut = '';
        let stdErr = '';
        if (standardOption === FileDescriptorStandardOption.PIPE) {
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
        }
        else if (standardOption === FileDescriptorStandardOption.ONLY_IF_THROW) {
            child.stdout.on('data', (data) => {
                stdOut += data.toString();
            });
            child.stderr.on('data', (data) => {
                stdErr += data.toString();
            });
        }
        else if (standardOption === FileDescriptorStandardOption.SEND_TO_CALLBACK) {
            child.stdout.on('data', (data) => {
                if (cb === null || cb === void 0 ? void 0 : cb.onOutData) {
                    cb.onOutData(data.toString());
                }
            });
            child.stderr.on('data', (data) => {
                if (cb === null || cb === void 0 ? void 0 : cb.onErrorData) {
                    cb.onErrorData(data.toString());
                }
            });
        }
        child.on('close', (code) => {
            const errorMessage = `Command '${command}' with args '${args.join(' ')}' exited with code ${code}. \n
          > Working directory: ${workingDir} `;
            if (code !== 0) {
                if (standardOption === FileDescriptorStandardOption.ONLY_IF_THROW) {
                    reject(new Error(`${errorMessage} \n
            > Standard output: \n ${stdOut} \n
            > Error output: \n ${stdErr} \n`));
                }
                else {
                    reject(new Error(errorMessage));
                }
            }
            resolve();
        });
    });
}
exports.runCommand = runCommand;
function downloadRepo(workingDir, url, destinationPath) {
    return runCommand({
        workingDir,
        command: 'git',
        args: ['clone', '--depth', '1', url, destinationPath],
        fdStandards: FileDescriptorStandardOption.ONLY_IF_THROW
    });
}
exports.downloadRepo = downloadRepo;
//# sourceMappingURL=shellCommands.js.map