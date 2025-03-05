const { RECIPES } = require("../../../../shared/constants/ingredients"); // Import the list of recipes

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
}

module.exports = RestaurantService; // Export the service for use in other parts of the application
