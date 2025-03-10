const RestaurantService = require("../services/restaurant.service");
const { connectProducer, sendMessage } = require("../kafka");
const crypto = require("crypto");
const { enviarOrdenFinalizada } = require("../services/ws.service");
const HistoryService = require("../db/db.service");
const StatusDBService = require("../db/statusDB.service");

let producerReady = null; // Global variable to maintain persistent producer connection

/**
 * Ensures the Kafka producer is connected before sending messages.
 */
const ensureProducerConnected = async () => {
  if (!producerReady) {
    producerReady = connectProducer()
      .then((producer) => producer)
      .catch((error) => {
        console.error("Error connecting Kafka Producer:", error);
        producerReady = null; // Reset to attempt reconnection in the next request
      });
  }
  return producerReady;
};

/**
 * Handles incoming order requests.
 * Selects a random recipe, assigns a unique ID, and sends it to Kafka and WebSocket.
 */
const placeOrder = async (req, res) => {
  try {
    await ensureProducerConnected(); // Ensure producer connection
    const service = new RestaurantService();
    const selectedRecipe = service.selectRandomRecipe();
    const uuid = crypto.randomUUID();
    selectedRecipe["id"] = uuid;
    selectedRecipe["status"] = "Sent"

    // Send the order to Kafka and notify via WebSocket
    await sendMessage("kitchen", selectedRecipe);
    await enviarOrdenFinalizada("orderCreated", selectedRecipe);

    // Save order history
   
    await HistoryService.createHistoryRecord(selectedRecipe);

    res.json({
      success: true,
      message: "Order sent to kitchen",
      orderId: uuid,
    });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves the total count of order history records.
 */
const getCountHistory = async (req, res) => {
  try {
    const items = await HistoryService.countRecords();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all order history records.
 */
const getAllItems = async (req, res) => {
  try {
    const items = await HistoryService.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes all order history records.
 */
const deleteAllHistory = async (req, res) => {
  try {
    await HistoryService.deleteAllRecords();
    res.status(200).json({ message: "All records were deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves the total count of status records.
 */
const getCountStatus = async (req, res) => {
  try {
    const items = await StatusDBService.countStatusRecords();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all status records.
 */
const getAllStatus = async (req, res) => {
  try {
    const items = await StatusDBService.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes all status records.
 */
const deleteAllStatus = async (req, res) => {
  try {
    await StatusDBService.deleteAllRecords();
    res.status(200).json({ message: "All records were deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  placeOrder,
  getCountHistory,
  getAllItems,
  deleteAllHistory,
  getCountStatus,
  getAllStatus,
  deleteAllStatus,
};
