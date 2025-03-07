const { Kafka } = require("kafkajs");
const RestaurantService = require("./services/restaurant.service");

const kafka = new Kafka({
  clientId: "restaurant-manager",
  brokers: ["kafka:9092"], // Kafka corre en el servicio 'kafka'
});

// producer
const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Kafka Producer conectado");
};

const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log(`📩 Mensaje enviado a ${topic}:`, message);
};

//consumer
const consumer = kafka.consumer({ groupId: "restaurant-group" });

const connectConsumer = async () => {
  const service = new RestaurantService();
  await consumer.connect();
  await consumer.subscribe({ topic: "final-order", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await service.finalizedOder(topic, message);
    },
  });
};

module.exports = { connectProducer, sendMessage, connectConsumer };
