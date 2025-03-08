const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8084 });
const wssOne = new WebSocket.Server({ port: 8085 });

// Manejar nuevas conexiones de clientes
wss.on("connection", (ws) => {
  console.log("Cliente conectado al WebSocket de la warehouse");
});

function goToMall(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ evento: "goToMall", data: data }));
    }
  });
}

function sendInventory(data) {
  wssOne.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ evento: "invChange", data: data }));
    }
  });
}

module.exports = { goToMall, sendInventory };
