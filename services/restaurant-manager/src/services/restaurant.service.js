const { RECIPES } = require("/app/shared/constants/ingredients"); // Import the list of recipes
const { enviarOrdenFinalizada } = require("./ws.service");

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

  async finalizedOder(topic, message) {
    try {
      let convertedMsg = JSON.parse(message.value.toString());

      if (typeof convertedMsg === "string") {
        convertedMsg = JSON.parse(convertedMsg);
      }
      await enviarOrdenFinalizada("ordenFinalizada", convertedMsg);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = RestaurantService; // Export the service for use in other parts of the application
