const { Kafka } = require("kafkajs");

// Create a Kafka instance with the client ID "warehouse-service" and specify the Kafka broker address
const kafka = new Kafka({
  clientId: "warehouse-service",
  brokers: ["kafka:9092"],
});

// Initialize a Kafka producer
const producer = kafka.producer();

/**
 * Connects the Kafka producer to the broker.
 */
const connectProducer = async () => {
  await producer.connect();
  //console.log("✅ Kafka Producer connected");
};

/**
 * Sends a message to a specified Kafka topic.
 * @param {string} topic - The name of the Kafka topic.
 * @param {Object} message - The message object to be sent.
 */
const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

module.exports = { connectProducer, sendMessage };
