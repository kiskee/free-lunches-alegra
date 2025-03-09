const mongoose = require("mongoose");

// Define the MongoDB connection URI, using an environment variable if available.
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://mongodb:27017/restaurantDB";

/**
 * Establishes a connection to the MongoDB database.
 *
 * This function ensures a reliable connection using the latest MongoDB driver options.
 * If the connection fails, the application logs the error and exits to prevent further execution.
 */
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true, // Uses the new URL parser to avoid deprecation warnings
      useUnifiedTopology: true, // Enables the new Server Discovery and Monitoring engine
    });
    console.info("🟢 Successfully connected to MongoDB");
  } catch (error) {
    console.error("🔴 Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process if the database connection fails
  }
}

// Export the database connection function for use in other parts of the application
module.exports = { connectDB };
