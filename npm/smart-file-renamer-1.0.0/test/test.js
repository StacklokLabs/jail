const fs = require("fs-extra");
const path = require("path");
const chai = require("chai");
const renameFiles = require("../index");

const expect = chai.expect;
const testDir = path.join(__dirname, "test_files");

// Setup and cleanup test directory
before(() => {
    fs.ensureDirSync(testDir);
    fs.writeFileSync(path.join(testDir, "file1.txt"), "Test file 1");
    fs.writeFileSync(path.join(testDir, "file2.txt"), "Test file 2");
    fs.writeFileSync(path.join(testDir, "file3.txt"), "Test file 3");
});

after(() => {
    fs.removeSync(testDir);
});

describe("File Renaming Tool", () => {
    it("should rename files with sequential numbering", () => {
        renameFiles(testDir, "*.txt", "renamed", "txt");

        const files = fs.readdirSync(testDir);
        expect(files).to.include("renamed_1.txt");
        expect(files).to.include("renamed_2.txt");
        expect(files).to.include("renamed_3.txt");
    });
});
