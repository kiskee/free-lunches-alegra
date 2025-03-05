const express = require('express');
const axios = require('axios');
const { RECIPES } = require('../../../shared/constants/ingredients');

class RestaurantManagerService {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.post('/order', this.placeOrder.bind(this));
    }

    async placeOrder(req, res) {
        try {
            const selectedRecipe = this.selectRandomRecipe();

            console.log("aca esto sis si", selectedRecipe)
            
            // const kitchenResponse = await axios.post('http://kitchen-service:3002/prepare', {
            //     recipe: selectedRecipe
            // });

            res.json({
                message: 'Order placed successfully',
                recipe: selectedRecipe,
                status: "active"//kitchenResponse.data.status
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    selectRandomRecipe() {
        return RECIPES[Math.floor(Math.random() * RECIPES.length)];
    }

    start(port = 3001) {
        this.app.listen(port, () => {
            console.log(`Restaurant Manager Service running on port ${port}`);
        });
    }
}

const service = new RestaurantManagerService();
service.start();