// websocket.js
const WebSocket = require('ws');

// Function to attach WebSocket to the server
function attachWebSocket(server) {
  // Create a WebSocket server using the provided HTTP server
  const wss = new WebSocket.Server({ server });

  // Event handler when a WebSocket connection is established
  wss.on('connection', (ws) => {
    console.log('WebSocket connected');

    // Event handler for incoming WebSocket messages
    ws.on('message', (message) => {
      console.log(`Received: ${message}`);
      // Handle WebSocket messages here
    });

    // Event handler when a WebSocket connection is closed
    ws.on('close', () => {
      console.log('WebSocket closed');
    });
  });
}

// Export the function for use in other files
module.exports = attachWebSocket;
