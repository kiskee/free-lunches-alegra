const { Kafka } = require("kafkajs");
const RestaurantService = require("./services/restaurant.service");

// Kafka configuration
const kafka = new Kafka({
  clientId: "restaurant-manager",
  brokers: ["kafka:9092"], // Kafka runs on the 'kafka' service
});

// Kafka producer
const producer = kafka.producer();

/**
 * Establishes a connection to the Kafka producer.
 */
const connectProducer = async () => {
  await producer.connect();
};

/**
 * Sends a message to a specified Kafka topic.
 *
 * @param {string} topic - The Kafka topic.
 * @param {Object} message - The message to send.
 */
const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

// Kafka consumer
const consumer = kafka.consumer({ groupId: "restaurant-group" });

/**
 * Establishes a connection to the Kafka consumer and subscribes to topics.
 */
const connectConsumer = async () => {
  const service = new RestaurantService();
  await consumer.connect();
  await consumer.subscribe({ topic: "final-order", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await service.finalizedOder(topic, message);
    },
  });
};

// Export functions for external use
module.exports = { connectProducer, sendMessage, connectConsumer };
