const { Kafka } = require("kafkajs");
const { InventoryService } = require("../services/inventory.service");

const kafka = new Kafka({
  clientId: "warehouse-service",
  brokers: ["kafka:9092"],
});

// consumer
//consumer
const consumer = kafka.consumer({
  groupId: "warehouse-group",
  sessionTimeout: 30000, // Tiempo máximo antes de que Kafka expulse al consumidor (30s)
  heartbeatInterval: 400, // Enviar un heartbeat cada 5s
});

const connectConsumer = async () => {
  try {
    const inventoryService = new InventoryService();
    await consumer.connect();
    console.log("Consumidor Kafka conectado.");

    await consumer.subscribe({ topic: "warehouse", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          inventoryService.newIngredients(message);
        } catch (error) {
          console.error("Error procesando mensaje:", error);
        }
      },
    });
  } catch (error) {
    console.error("Error conectando consumidor:", error);
    setTimeout(connectConsumer, 5000); // Reintentar después de 5s
  }
};

module.exports = { connectConsumer };
