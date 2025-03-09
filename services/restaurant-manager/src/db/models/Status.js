const mongoose = require("mongoose");

/**
 * Defines the schema for storing status records.
 */
const statusSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Unique identifier for the status entry
  name: { type: String, required: true }, // Name associated with the status
  status: { type: String, required: true } // Status description
});

/**
 * Mongoose model for interacting with the status collection.
 */
const Status = mongoose.model("Status", statusSchema);

module.exports = Status;
