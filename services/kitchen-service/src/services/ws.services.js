const WebSocket = require("ws");

// Initialize WebSocket server on port 8082
const wss = new WebSocket.Server({ port: 8082 });

/**
 * Handles new client connections.
 */
wss.on("connection", (ws) => {
  // Connection established with a new client
});

/**
 * Sends an order completion event to all connected clients.
 * @param {Object} order - The completed order data.
 */
function enviarOrdenFinalizada(order) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event: "orderCompleted", data: order }));
    }
  });
}

module.exports = { enviarOrdenFinalizada };
