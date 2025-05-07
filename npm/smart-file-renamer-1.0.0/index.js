const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");

/**
 * Batch rename files in a directory with pattern matching and sequential numbering.
 * @param {string} dir - Target directory containing files to rename.
 * @param {string} pattern - Glob pattern to match files (e.g., "*.txt").
 * @param {string} newName - New base name for files.
 * @param {string} ext - File extension for renamed files.
 */
function renameFiles(dir, pattern, newName, ext) {
    const files = glob.sync(pattern, { cwd: dir });

    if (files.length === 0) {
        console.log("No files matched the given pattern.");
        return;
    }

    files.forEach((file, index) => {
        const oldPath = path.join(dir, file);
        const newFileName = `${newName}_${index + 1}.${ext}`;
        const newPath = path.join(dir, newFileName);

        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${file} -> ${newFileName}`);
    });
}

if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length !== 4) {
        console.log("Usage: node index.js <directory> <pattern> <newName> <extension>");
        process.exit(1);
    }
    renameFiles(args[0], args[1], args[2], args[3]);
}

module.exports = renameFiles;
