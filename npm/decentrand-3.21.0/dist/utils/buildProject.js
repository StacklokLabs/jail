"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const npm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
function buildProject(workingDir) {
    console.log(`Building project using "npm run build"`);
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)(npm, ['run', 'build'], {
            shell: true,
            cwd: workingDir,
            env: Object.assign(Object.assign({}, process.env), { NODE_ENV: '' })
        });
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error('Error while building the project'));
            }
            else {
                resolve();
            }
        });
    });
}
exports.default = buildProject;
//# sourceMappingURL=buildProject.js.map