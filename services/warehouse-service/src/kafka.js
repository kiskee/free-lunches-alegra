const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "warehouse-service",
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
  //console.log(`📩 Mensaje enviado a ${topic}:`, message);
};

module.exports = { connectProducer, sendMessage };
