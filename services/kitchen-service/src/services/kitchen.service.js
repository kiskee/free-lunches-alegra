const axios = require('axios');

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
            await this.requestIngredientsFromWarehouse(recipe.ingredients);

            return {
                status: 'PREPARED',
                recipe: recipe.name
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
        const warehouseResponse = await axios.post('http://localhost:3003/supply', { ingredients });
        return warehouseResponse.data;
    }
}

module.exports = KitchenService;
