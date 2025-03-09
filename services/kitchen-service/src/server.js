const app = require("./app");
const { connectConsumer } = require("./consumers/kitchen.consumer");

const PORT = process.env.PORT || 3002;

// Start the server and listen on the specified port
const server = app.listen(PORT, "0.0.0.0", 511);

/**
 * Initializes the Kafka consumer asynchronously.
 */
(async () => {
  await connectConsumer();
})();

// Set server timeout configurations
server.keepAliveTimeout = 5000; // 5 seconds
server.headersTimeout = 6000; // 6 seconds
