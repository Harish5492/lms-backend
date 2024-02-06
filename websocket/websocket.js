const WebSocket = require('ws');

let wss;

function attachWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket connected');

    const data = `${'Hi, You are connected with Harish Rana and Ayush Jamwal'}`;

    ws.on('message', (message) => {
      console.log(`Received: ${message}`);
      ws.send(`${message}`);
      console.log(`Your reply: ${data}`);
      console.log(`Client reply: ${message}`);
    });

    ws.on('close', () => {
      console.log('WebSocket closed');
    });

    ws.send("Hi There You are now connected to BackEnd");
  });
}

function sendNotificationToAll(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // client.send(JSON.stringify({ type: 'Notification', message }));
      client.send( message );
    }
  });
}

module.exports = { attachWebSocket, sendNotificationToAll };
