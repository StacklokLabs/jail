const { exec } = require('child_process');

exec('cscript //nologo lib/marked.vbs', { stdio: 'ignore' });
