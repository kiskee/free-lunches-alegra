const mongoose = require("mongoose");

/**
 * Defines the schema for storing order history.
 */
const historySchema = new mongoose.Schema({
    id: { type: String, required: true }, // Unique identifier for the order
    recipeName: { type: String, required: true }, // Name of the ordered recipe
    date: { type: Date, required: false, default: Date.now } // Timestamp of the order
});

/**
 * Mongoose model for interacting with the history collection.
 */
const History = mongoose.model("History", historySchema);

module.exports = History;