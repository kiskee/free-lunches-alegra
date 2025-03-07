const { RECIPES } = require("/app/shared/constants/ingredients"); // Import the list of recipes
const { enviarOrdenFinalizada, orderToKitchenEvent } = require("./ws.service");


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
    enviarOrdenFinalizada(message);
    return console.log(
      `📥 Mensaje recibido en ${topic}:`,
      message.value.toString()
    );
  }

  async sendeventToKitchen(order) {
    orderToKitchenEvent(order)
  }
}

module.exports = RestaurantService; // Export the service for use in other parts of the application
