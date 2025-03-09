const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    id: { type: String, required: true },
    recipeName: { type: String, required: true },
    date: { type: Date, required: false, default: Date.now } 
})

const History = mongoose.model("History", historySchema)

module.exports = History;