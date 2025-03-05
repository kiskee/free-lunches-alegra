const { RECIPES } = require('../../../../shared/constants/ingredients');

class RestaurantService {
    selectRandomRecipe() {
        return RECIPES[Math.floor(Math.random() * RECIPES.length)];
    }
}

module.exports = RestaurantService;
