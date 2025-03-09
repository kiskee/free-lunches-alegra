const app = require("./app"); // Import the configured Express application
const { connectConsumer } = require("./consumers/warehouse.consumer");
const { connectDB } = require("./db/mongo.service");

const PORT = 3003; // Server port, can be replaced with process.env.PORT if needed

// Start the Express server and listen on the specified port
const server = app.listen(PORT, "0.0.0.0", 511, () => {
  console.log(`Warehouse running on port ${PORT}`);
});

// Initialize Kafka consumer asynchronously
(async () => {
  await connectConsumer();
})();

// Connect to MongoDB when starting the server
connectDB();

// Configure server timeouts
server.keepAliveTimeout = 5000; // 5 seconds
server.headersTimeout = 6000; // 6 seconds
