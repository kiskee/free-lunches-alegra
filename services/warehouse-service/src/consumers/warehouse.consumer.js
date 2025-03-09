const { Kafka } = require("kafkajs");
const { InventoryService } = require("../services/inventory.service");

// Initialize Kafka client with the broker details
const kafka = new Kafka({
  clientId: "warehouse-service", // Unique identifier for this Kafka client
  brokers: ["kafka:9092"], // Address of the Kafka broker
});

// Kafka consumer configuration
const consumer = kafka.consumer({
  groupId: "warehouse-group", // Consumer group that will manage the messages
  sessionTimeout: 30000, // Maximum time (30s) before Kafka removes the consumer if no heartbeat is received
  heartbeatInterval: 400, // Heartbeat signal sent to Kafka every 400ms to maintain connection
});

/**
 * Connects the Kafka consumer and subscribes to the "warehouse" topic.
 * Processes incoming messages and passes them to the InventoryService.
 */
const connectConsumer = async () => {
  try {
    const inventoryService = new InventoryService();
    await consumer.connect(); // Establish connection with Kafka broker

    await consumer.subscribe({ topic: "warehouse", fromBeginning: false }); // Subscribe to the "warehouse" topic

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          // Process the incoming message with the inventory service
          inventoryService.newIngredients(message);
        } catch (error) {
          // Handle errors that occur while processing messages
          throw new Error("Error processing message: " + error.message);
        }
      },
    });
  } catch (error) {
    // If the consumer fails to connect, retry after 5 seconds
    setTimeout(connectConsumer, 5000);
    throw new Error("Error connecting consumer: " + error.message);
  }
};

// Export the consumer connection function for use in other parts of the application
module.exports = { connectConsumer };
