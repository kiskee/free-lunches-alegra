const { Kafka } = require("kafkajs");

// Initialize Kafka instance
const kafka = new Kafka({
  clientId: "kitchen-service",
  brokers: ["kafka:9092"],
});

// Create a Kafka producer
const producer = kafka.producer();

/**
 * Connects the Kafka producer to the broker.
 */
const connectProducer = async () => {
  await producer.connect();
};

/**
 * Sends a message to a specified Kafka topic.
 * @param {string} topic - The Kafka topic to send the message to.
 * @param {Object} message - The message to send.
 */
const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

module.exports = { connectProducer, sendMessage };
