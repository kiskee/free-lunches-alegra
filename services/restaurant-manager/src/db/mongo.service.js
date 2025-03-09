const mongoose = require("mongoose");

// MongoDB connection URI, fallback to default if not provided in environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://mongodb:27017/restaurantDB";

/**
 * Establishes a connection to the MongoDB database.
 * Exits the process if the connection fails.
 */
async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("🟢 Successfully connected to MongoDB");
    } catch (error) {
        console.error("🔴 Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

module.exports = { connectDB };