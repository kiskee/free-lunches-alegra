const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
});

const Status = mongoose.model("Status", statusSchema);

module.exports = Status;
