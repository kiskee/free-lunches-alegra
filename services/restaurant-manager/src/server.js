const app = require("./app"); // Import the configured Express application
const { connectConsumer } = require("./kafka");
const { connectDB } = require("./db/mongo.service");

// Define the server port
const PORT = 3004;

// Start the server
const server = app.listen(PORT, "0.0.0.0", 511);

// Initialize Kafka consumer
(async () => {
  await connectConsumer();
})();

// Connect to MongoDB
connectDB();

// Configure server timeouts
server.keepAliveTimeout = 5000; // 5 seconds
server.headersTimeout = 6000; // 6 seconds
