// websocket.js
const WebSocket = require('ws');

// Function to attach WebSocket to the server
function attachWebSocket(server) {
  // Create a WebSocket server using the provided HTTP server
  const wss = new WebSocket.Server({ server });

  // Event handler when a WebSocket connection is established
  wss.on('connection', (ws) => {
    console.log('WebSocket connected');

    const data = `${'Hi, You are connected with Harish Rana and Ayush Jamwal'}`
    // Event handler for incoming WebSocket messages
    ws.on('message', (message) => {
      console.log(`Received: ${message}`);
      // Handle WebSocket messages here
      ws.send(`${data}`)
      console.log(`Your reply: ${data}`);

    });


    // Event handler when a WebSocket connection is closed
    ws.on('close', () => {
      console.log('WebSocket closed');

    }); 

    ws.send("Hi There You are now connected to BackEnd")
  });
}

// Export the function for use in other files
module.exports = attachWebSocket;
