const WebSocket = require("ws");

// Create WebSocket servers for different functionalities
const wss = new WebSocket.Server({ port: 8084 }); // Server for handling warehouse events
const wssOne = new WebSocket.Server({ port: 8085 }); // Server for sending inventory updates

/**
 * Handles new client connections to the warehouse WebSocket server.
 */
wss.on("connection", (ws) => {
  console.log("🟢 Client connected to the warehouse WebSocket server");
});

/**
 * Sends a message to all connected WebSocket clients on port 8084,
 * notifying them about a shopping mall event.
 * 
 * @param {Object} data - The data object containing event details.
 */
function goToMall(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ evento: "goToMall", data: data }));
    }
  });
}

/**
 * Sends a message to all connected WebSocket clients on port 8085,
 * notifying them about inventory changes.
 * 
 * @param {Object} data - The inventory data update.
 */
function sendInventory(data) {
  wssOne.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ evento: "invChange", data: data }));
    }
  });
}

module.exports = { goToMall, sendInventory };
