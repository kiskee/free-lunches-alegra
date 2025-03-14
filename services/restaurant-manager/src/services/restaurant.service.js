const logger = require("../logger");
const { RECIPES } = require("/app/shared/constants/ingredients"); // Import the list of recipes
const { enviarOrdenFinalizada } = require("./ws.service");
const StatusDBService = require("../db/statusDB.service");

/**
 * Service responsible for restaurant-related operations.
 */
class RestaurantService {
  /**
   * Selects a random recipe from the available recipes.
   * @returns {Object} A randomly selected recipe.
   */
  selectRandomRecipe() {
    const recipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    logger.debug("Selected random recipe:", recipe);
    return recipe;
  }

  /**
   * Processes a finalized order.
   * @param {string} topic - The topic of the message.
   * @param {Object} message - The message containing order details.
   */
  async finalizedOder(topic, message) {
    logger.info(`Processing finalized order for topic: ${topic}`);
    try {
      let convertedMsg = JSON.parse(message.value.toString());
      logger.debug("Parsed message:", convertedMsg);

      if (typeof convertedMsg === "string") {
        convertedMsg = JSON.parse(convertedMsg);
        logger.debug("Re-parsed message (string detected):", convertedMsg);
      }

      logger.info("Sending finalized order to WebSocket service");
      await enviarOrdenFinalizada("ordenFinalizada", convertedMsg);

      const dataToSave = {
        id: convertedMsg.id,
        name: convertedMsg.name,
        status: convertedMsg.status,
      };

      logger.info("Saving order status to database", dataToSave);
      await StatusDBService.createStatusRecord(dataToSave);
      logger.info("Order status saved successfully");
    } catch (error) {
      logger.error("Error processing finalized order:", error);
    }
  }
}

module.exports = RestaurantService; // Export the service for use in other parts of the application
