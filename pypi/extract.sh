#!/bin/bash
# Loop through all .whl files in the current directory
for file in *.whl; do
    # Get the base name of the file (without extension)
    dirname="${file%-py3-none-any.whl}"
    
    # Create a directory with the base name
    mkdir -p "$dirname"
    
    # Extract the .whl file into the created directory
    unzip -q "$file" -d "$dirname"
    rm -f "$file"
done
# Loop through all .tgz files in the current directory
for file in *.gz; do
    # Get the base name of the file (without extension)
    dirname="${file%.tar.gz}"
    
    # Create a directory with the base name
    mkdir -p "$dirname"
    
    # Extract the .tgz file into the created directory, stripping the first component
    tar -xzf "$file" --strip-components=1 -C "$dirname"
    rm -f "$file"
done