# Smart File Renamer

A smart file renaming tool that supports batch renaming, pattern matching, and sequential numbering.

## Features
- Rename multiple files in a directory
- Support for glob pattern matching
- Auto-generate sequential numbers for renamed files

## Installation
```sh
npm install
```

## Usage
Run the following command to rename files:
```sh
node index.js <directory> <pattern> <newName> <extension>
```
Example:
```sh
node index.js ./test "*.txt" new_name txt
```
This will rename `file1.txt`, `file2.txt`, etc., to `new_name_1.txt`, `new_name_2.txt`, etc.

## Testing
To run tests, execute:
```sh
npm test
```
