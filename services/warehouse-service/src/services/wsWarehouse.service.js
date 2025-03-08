const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8084 });

// Manejar nuevas conexiones de clientes
wss.on("connection", (ws) => {
  console.log("Cliente conectado al WebSocket de la warehouse");
});


function goToMall(data){
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ evento: "goToMall", data: data }));
        }
      });
}


module.exports = { goToMall };
