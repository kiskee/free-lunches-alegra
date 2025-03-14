const RestaurantService = require("../services/restaurant.service");
const { connectProducer, sendMessage } = require("../kafka");
const crypto = require("crypto");
const { enviarOrdenFinalizada } = require("../services/ws.service");
const HistoryService = require("../db/db.service");
const StatusDBService = require("../db/statusDB.service");
const logger = require("../logger");

let producerReady = null; // Global variable to maintain persistent producer connection

/**
 * Ensures the Kafka producer is connected before sending messages.
 */
const ensureProducerConnected = async () => {
  if (!producerReady) {
    logger.info("Connecting Kafka Producer...");
    producerReady = connectProducer()
      .then((producer) => {
        logger.info("Kafka Producer connected successfully.");
        return producer;
      })
      .catch((error) => {
        logger.error("Error connecting Kafka Producer", {
          meta: { error: error.message },
        });
        producerReady = null; // Reset to attempt reconnection in the next request
      });
  }
  return producerReady;
};

/**
 * Handles incoming order requests.
 */
const placeOrder = async (req, res) => {
  try {
    logger.info("Received request to prepare recipe.");
    await ensureProducerConnected();

    const service = new RestaurantService();
    const selectedRecipe = service.selectRandomRecipe();
    const uuid = crypto.randomUUID();
    selectedRecipe["id"] = uuid;
    selectedRecipe["status"] = "Sent";

    logger.debug("Selected recipe", { meta: selectedRecipe });

    await sendMessage("kitchen", selectedRecipe);
    await enviarOrdenFinalizada("orderCreated", selectedRecipe);

    await HistoryService.createHistoryRecord(selectedRecipe);

    logger.info("Recipe successfully prepared and saved", {
      meta: { orderId: uuid },
    });

    res.json({
      success: true,
      message: "Order sent to kitchen",
      orderId: uuid,
    });
  } catch (error) {
    logger.error("Error sending the recipe", {
      meta: { error: error.message },
    });
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves the total count of order history records.
 */
const getCountHistory = async (req, res) => {
  try {
    logger.info("Fetching count of order history records.");
    const items = await HistoryService.countRecords();
    logger.debug("History count retrieved", { meta: { count: items } });
    res.status(200).json(items);
  } catch (error) {
    logger.error("Error fetching history count", {
      meta: { error: error.message },
    });
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all order history records.
 */
const getAllItems = async (req, res) => {
  try {
    logger.info("Fetching all order history records.");
    const items = await HistoryService.getAllItems();
    logger.debug("Order history retrieved", {
      meta: { totalRecords: items.length },
    });
    res.status(200).json(items);
  } catch (error) {
    logger.error("Error fetching order history", {
      meta: { error: error.message },
    });
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes all order history records.
 */
const deleteAllHistory = async (req, res) => {
  try {
    logger.warn("Deleting all order history records.");
    await HistoryService.deleteAllRecords();
    logger.info("All order history records deleted.");
    res.status(200).json({ message: "All records were deleted" });
  } catch (error) {
    logger.error("Error deleting history records", {
      meta: { error: error.message },
    });
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves the total count of status records.
 */
const getCountStatus = async (req, res) => {
  try {
    logger.info("Fetching count of status records.");
    const items = await StatusDBService.countStatusRecords();
    logger.debug("Status count retrieved", { meta: { count: items } });
    res.status(200).json(items);
  } catch (error) {
    logger.error("Error fetching status count", {
      meta: { error: error.message },
    });
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all status records.
 */
const getAllStatus = async (req, res) => {
  try {
    logger.info("Fetching all status records.");
    const items = await StatusDBService.getAllItems();
    logger.debug("Status records retrieved", {
      meta: { totalRecords: items.length },
    });
    res.status(200).json(items);
  } catch (error) {
    logger.error("Error fetching status records", {
      meta: { error: error.message },
    });
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes all status records.
 */
const deleteAllStatus = async (req, res) => {
  try {
    logger.warn("Deleting all status records.");
    await StatusDBService.deleteAllRecords();
    logger.info("All status records deleted.");
    res.status(200).json({ message: "All records were deleted" });
  } catch (error) {
    logger.error("Error deleting status records", {
      meta: { error: error.message },
    });
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
