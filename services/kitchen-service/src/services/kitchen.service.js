const logger = require("../logger");
const axios = require("axios");
const { connectProducer, sendMessage } = require("../kafka");

/**
 * Service responsible for kitchen-related operations.
 */
class KitchenService {
  constructor() {
    this.producerReady = this.initializeProducer(); // Store the Kafka producer connection promise
  }

  /**
   * Establishes a connection to the Kafka producer, if not already connected.
   * The producer will be used to send messages to Kafka topics.
   */
  async initializeProducer() {
    if (!this.producer) { // Ensures that only one Kafka connection is established
      try {
        logger.info("Initializing Kafka producer connection...");
        this.producer = await connectProducer();
        logger.info("🟢 Kafka Producer connected successfully");
      } catch (error) {
        logger.error("🔴 Error connecting Kafka Producer:", error);
      }
    }
  }

  /**
   * Handles recipe preparation.
   * @param {Object} recipe - The recipe to prepare.
   * @returns {Promise<Object>} - The preparation result.
   */
  async prepareRecipe(recipe) {
    try {
      logger.info(`Preparing recipe: ${recipe.recipe.name}`);
      await this.requestIngredientsFromWarehouse(recipe.recipe.ingredients);
      logger.info(`Recipe prepared successfully: ${recipe.recipe.name}`);

      return {
        status: "PREPARED",
        recipe: recipe.recipe.name,
      };
    } catch (error) {
      logger.error("Error preparing recipe:", error);
      throw new Error(error.message);
    }
  }

  /**
   * Requests ingredients from the warehouse service.
   * @param {Array} ingredients - List of ingredients required.
   * @returns {Promise<Object>} - Warehouse response.
   */
  async requestIngredientsFromWarehouse(ingredients) {
    logger.info("Requesting ingredients from warehouse", { ingredients });
    const warehouseResponse = await axios.post(
      "http://warehouse-service:3003/supply",
      { ingredients }
    );
    logger.info("Received warehouse response", warehouseResponse.data);
    return warehouseResponse.data;
  }

  /**
   * Processes incoming orders from the restaurant.
   * @param {Object} message - Kafka message received.
   */
  async incomeOrderFromRest(message) {
    const convertedMsg = message.value.toString();
    try {
      logger.info("Processing incoming order from restaurant", { message: convertedMsg });
      await this.producerReady;
      sendMessage("warehouse", convertedMsg);
      logger.info("Order sent to warehouse topic");
    } catch (error) {
      logger.error("Error processing restaurant order:", error);
      throw new Error(`Error processing restaurant order: ${error.message}`);
    }
  }

  /**
   * Sends the completed order to the final destination.
   * @param {Object} message - Kafka message received.
   */
  async sendCompleteOder(message) {
    try {
      logger.info("Processing completed order");
      let convertedMsg = JSON.parse(message.value.toString());

      if (typeof convertedMsg === "string") {
        convertedMsg = JSON.parse(convertedMsg);
        logger.debug("Re-parsed message (string detected):", convertedMsg);
      }
      
      convertedMsg.status = "PREPARED";

      await this.producerReady;
      sendMessage("final-order", convertedMsg);
      logger.info("Completed order sent to final-order topic", { order: convertedMsg });
    } catch (error) {
      logger.error("Error sending completed order:", error);
      throw new Error(`Error sending completed order: ${error.message}`);
    }
  }
}

module.exports = KitchenService;