const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8082 }); // Inicia WebSocket en el puerto 8080
const wssOne =  new WebSocket.Server({ port: 8083 });

// Manejar nuevas conexiones de clientes
wss.on("connection", (ws) => {
  console.log("Cliente conectado al WebSocket de la cocina");
});

// Función para enviar eventos a todos los clientes conectados
function enviarOrdenFinalizada(event, orden) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ evento: event, data: orden }));
    }
  });
}

module.exports = { enviarOrdenFinalizada };
