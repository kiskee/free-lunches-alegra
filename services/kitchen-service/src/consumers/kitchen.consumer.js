const { Kafka } = require("kafkajs");
const KitchenService = require("../services/kitchen.service");

// Kafka client configuration
const kafka = new Kafka({
  clientId: "kitchen-service", // Unique client ID for the service
  brokers: ["kafka:9092"], // List of Kafka broker addresses
  retry: {
    initialRetryTime: 300, // Initial wait time before the first retry
    retries: 10, // Maximum number of reconnection attempts
  },
});

// Kafka consumer configuration
const consumer = kafka.consumer({ groupId: "kitchen-group" });

/**
 * Connects the Kafka consumer and starts listening for messages.
 */
const connectConsumer = async () => {
  try {
    await consumer.connect();

    // Subscribing to topics
    await consumer.subscribe({
      topics: ["kitchen", "avalibleIngredients"],
      fromBeginning: false, // Only process new messages, not old ones
    });

    const service = new KitchenService();

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const messageValue = message.value.toString();

          switch (topic) {
            case "kitchen":
              await service.incomeOrderFromRest(message);
              break;
            case "avalibleIngredients":
              await service.sendCompleteOder(message);
              break;
            default:
              console.warn(`⚠️ Unhandled topic: ${topic}`);
          }
        } catch (error) {
          console.error(
            `❌ Error processing message on topic ${topic}:`,
            error
          );
        }
      },
    });
  } catch (error) {
    console.error("❌ Error connecting the consumer:", error);
    setTimeout(connectConsumer, 5000); // Retry after 5 seconds if connection fails
  }
};

module.exports = { connectConsumer };
