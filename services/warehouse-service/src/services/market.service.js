const axios = require("axios");
const { goToMall } = require("./wsWarehouse.service");
const ShoppingMallDBService = require('../db/shoppingMall.service')

class MarketService {
  async buyFromMarket(ingredient) {
    try {
      const response = await axios.get(
        `https://recruitment.alegra.com/api/farmers-market/buy?ingredient=${ingredient}`
      );
      const dataToEvent = {
        ingredient,
        response: response.data.quantitySold,
      };
      goToMall(dataToEvent);
      await ShoppingMallDBService.createShoppingMallRecord(dataToEvent)
      return response.data.quantitySold || 0;
    } catch (error) {
      console.error(`Market purchase error for ${ingredient}`);
      return 0;
    }
  }
}

module.exports = { MarketService };
