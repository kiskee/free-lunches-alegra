const { INGREDIENTS } = require('../../../../shared/constants/ingredients');
const { MarketService } = require('./market.service');

class InventoryService {
    constructor() {
        this.inventory = this.initializeInventory();
        this.marketService = new MarketService();
    }

    initializeInventory() {
        return INGREDIENTS.reduce((acc, ingredient) => {
            acc[ingredient] = 5;
            return acc;
        }, {});
    }

    getInventory() {
        return this.inventory;
    }

    async ensureIngredientsAvailable(ingredients) {
        for (const [ingredient, quantity] of Object.entries(ingredients)) {
            while (this.inventory[ingredient] < quantity) {
                const marketResponse = await this.marketService.buyFromMarket(ingredient);
                if (marketResponse > 0) {
                    this.inventory[ingredient] += marketResponse;
                }
            }
            this.inventory[ingredient] -= quantity;
        }
    }
}

module.exports = { InventoryService };
