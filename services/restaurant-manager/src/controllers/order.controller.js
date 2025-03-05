const RestaurantService = require('../services/restaurant.service');

const placeOrder = async (req, res) => {
    try {
        const service = new RestaurantService();
        const selectedRecipe = service.selectRandomRecipe();

        console.log("aca esto sis si", selectedRecipe);
        
        // const kitchenResponse = await axios.post('http://kitchen-service:3002/prepare', { recipe: selectedRecipe });

        res.json({
            message: 'Order placed successfully',
            recipe: selectedRecipe,
            status: "active" // kitchenResponse.data.status
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { placeOrder };
