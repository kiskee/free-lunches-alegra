const { Kafka } = require("kafkajs");
const KitchenService = require("../services/kitchen.service");

const kafka = new Kafka({
    clientId: "kitchen-service",
    brokers: ["kafka:9092"],
  });

// consumer
const consumer = kafka.consumer({ groupId: "kitchen-group" });

const connectConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topics: ["kitchen", "avalibleIngredients"], // Lista de topics a los que suscribirse
    fromBeginning: false, // Opcional: comienza a consumir desde el principio de los topics
  }); //fromBeginning: true
  const service = new KitchenService();
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      //console.log(`📥 Mensaje recibido en ${topic}:`, message.value.toString());

      switch (topic) {
        case "kitchen":
          await service.incomeOrderFromRest(message);
          break;
        case "avalibleIngredients":
          console.log("este mensaje me lelgo devuelta a la cocian ********************", message.value.toString())
          break
        default:
          console.warn(`Unhandled topic: ${topic} with message: ${message.value.toString()}`);
      }
    },
  });
};



module.exports = { connectConsumer };