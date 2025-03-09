const WebSocket = require("ws");

// Initialize a WebSocket server on port 8082 for kitchen communication.
const wss = new WebSocket.Server({ port: 8082 });

// Initialize another WebSocket server on port 8083 (reserved for future use).
const wssOne = new WebSocket.Server({ port: 8083 });

// Handle new client connections to the WebSocket server.
wss.on("connection", (ws) => {
  // Connection established, no log needed.
});

/**
 * Sends an event to all connected WebSocket clients.
 *
 * @param {string} event - The event name.
 * @param {Object} order - The order data to send.
 */
async function enviarOrdenFinalizada(event, orden) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ evento: event, data: orden }));
    }
  });
}

// Export the function for use in other parts of the application.
module.exports = { enviarOrdenFinalizada };
