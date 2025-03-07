const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "kitchen-service",
  brokers: ["kafka:9092"],
});
//producer
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

// consumer
const consumer = kafka.consumer({ groupId: "kitchen-group" });

const connectConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "kitchen", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`📥 Mensaje recibido en ${topic}:`, message.value.toString());
    },
  });
};

module.exports = { connectConsumer, connectProducer, sendMessage };
