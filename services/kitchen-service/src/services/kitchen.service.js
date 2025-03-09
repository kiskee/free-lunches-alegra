const axios = require("axios");
const { connectProducer, sendMessage } = require("../kafka");

/**
 * Service responsible for kitchen-related operations.
 */
class KitchenService {
  /**
   * Handles recipe preparation.
   * @param {Object} recipe - The recipe to prepare.
   * @returns {Promise<Object>} - The preparation result.
   */
  async prepareRecipe(recipe) {
    try {
      // Request ingredients from the warehouse
      await this.requestIngredientsFromWarehouse(recipe.recipe.ingredients);

      return {
        status: "PREPARED",
        recipe: recipe.recipe.name,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Requests ingredients from the warehouse service.
   * @param {Array} ingredients - List of ingredients required.
   * @returns {Promise<Object>} - Warehouse response.
   */
  async requestIngredientsFromWarehouse(ingredients) {
    const warehouseResponse = await axios.post(
      "http://warehouse-service:3003/supply",
      { ingredients }
    );
    return warehouseResponse.data;
  }

  /**
   * Processes incoming orders from the restaurant.
   * @param {Object} message - Kafka message received.
   */
  async incomeOrderFromRest(message) {
    const convertedMsg = message.value.toString();
    try {
      await connectProducer();
      sendMessage("warehouse", convertedMsg);
    } catch (error) {
      throw new Error(`Error processing restaurant order: ${error.message}`);
    }
  }

  /**
   * Sends the completed order to the final destination.
   * @param {Object} message - Kafka message received.
   */
  async sendCompleteOder(message) {
    try {
      let convertedMsg = JSON.parse(message.value.toString());

      if (typeof convertedMsg === "string") {
        convertedMsg = JSON.parse(convertedMsg);
      }

      convertedMsg.status = "PREPARED";

      await connectProducer();
      sendMessage("final-order", convertedMsg);
    } catch (error) {
      throw new Error(`Error sending completed order: ${error.message}`);
    }
  }
}

module.exports = KitchenService;
