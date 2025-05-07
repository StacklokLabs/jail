const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.resolve(__dirname, 'src/index.js');

const subprocess = spawn('node', [scriptPath], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
