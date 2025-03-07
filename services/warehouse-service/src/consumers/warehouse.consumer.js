const { Kafka } = require("kafkajs");
const { InventoryService } = require("../services/inventory.service");

const kafka = new Kafka({
  clientId: "warehouse-service",
  brokers: ["kafka:9092"],
});

// consumer
//consumer
const consumer = kafka.consumer({ groupId: "warehouse-group" });

const connectConsumer = async () => {
  const inventoryService = new InventoryService();
  await consumer.connect();
  await consumer.subscribe({ topic: "warehouse", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await inventoryService.newIngredients(message);
    },
  });
};

module.exports = { connectConsumer };
