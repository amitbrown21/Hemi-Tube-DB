// cppClient.js
const net = require('net');

// Function to send a message to the C++ server
function notifyCppServer(message) {
  const client = new net.Socket();
  client.connect(5557, '127.0.0.1', () => {
    console.log('Connected to C++ server');
    client.write(message);
  });

  client.on('data', (data) => {
    console.log('Received from C++ server: ' + data);
    client.destroy(); // Close client after server's response
  });

  client.on('close', () => {
    console.log('Connection to C++ server closed');
  });

  client.on('error', (err) => {
    console.error('Error connecting to C++ server:', err.message);
  });
}

// Export the function for use in other files
module.exports = {
  notifyCppServer
};
