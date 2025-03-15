const axios = require("axios");
const { goToMall } = require("./wsWarehouse.service");
const ShoppingMallDBService = require("../db/shoppingMall.service");
const logger = require("../logger");

class MarketService {
  /**
   * Purchases an ingredient from an external farmers' market API.
   * If the purchase is successful, the acquired quantity is stored in the database and sent to an event handler.
   *
   * @param {string} ingredient - The name of the ingredient to purchase.
   * @returns {Promise<number>} The quantity of the ingredient successfully purchased, or 0 if the request fails.
   */
  async buyFromMarket(ingredient) {
    try {
      logger.info(`Attempting to buy ${ingredient} from the market.`);
      const response = await axios.get(
        `https://recruitment.alegra.com/api/farmers-market/buy?ingredient=${ingredient}`
      );

      const quantitySold = response.data.quantitySold || 0;
      logger.info(`Successfully purchased ${quantitySold} of ${ingredient}.`);

      const dataToEvent = {
        ingredient,
        response: response.data.quantitySold, // Amount of ingredient obtained from the market
      };

      goToMall(dataToEvent); // Notify the warehouse about the purchase
      await ShoppingMallDBService.createShoppingMallRecord(dataToEvent); // Store the purchase record in the database

      return quantitySold; // Return the purchased quantity, defaulting to 0 if undefined
    } catch (error) {
      logger.error(`🔴 Market purchase error for ${ingredient}:`, error);
      return 0; // Return 0 in case of failure to indicate no ingredient was obtained
    }
  }
}

module.exports = { MarketService };
