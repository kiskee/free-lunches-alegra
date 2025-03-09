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
    return RECIPES[Math.floor(Math.random() * RECIPES.length)];
  }

  /**
   * Processes a finalized order.
   * @param {string} topic - The topic of the message.
   * @param {Object} message - The message containing order details.
   */
  async finalizedOder(topic, message) {
    try {
      let convertedMsg = JSON.parse(message.value.toString());

      if (typeof convertedMsg === "string") {
        convertedMsg = JSON.parse(convertedMsg);
      }

      await enviarOrdenFinalizada("ordenFinalizada", convertedMsg);

      const dataToSave = {
        id: convertedMsg.id,
        name: convertedMsg.name,
        status: convertedMsg.status,
      };

      await StatusDBService.createStatusRecord(dataToSave);
    } catch (error) {
      console.error("🔴 Error processing finalized order:", error);
    }
  }
}

module.exports = RestaurantService; // Export the service for use in other parts of the application
