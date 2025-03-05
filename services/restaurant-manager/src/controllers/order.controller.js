const RestaurantService = require("../services/restaurant.service"); // Import the restaurant service
const axios = require("axios");

/**
 * Handles incoming order requests.
 * Selects a random recipe and sends it as a response.
 */
const placeOrder = async (req, res) => {
  try {
    const service = new RestaurantService(); // Instantiate the restaurant service
    const selectedRecipe = service.selectRandomRecipe(); // Select a random recipe

    console.log("Selected recipe:", selectedRecipe);

    // Simulate sending the order to the kitchen service (uncomment to enable)
    const kitchenResponse = await axios.post("http://localhost:3002/prepare", {
      recipe: selectedRecipe,
    });
    // Send a response confirming the order placement
    res.json({
      message: "Order placed successfully",
      recipe: selectedRecipe,
      status: kitchenResponse.data.status,
    });
  } catch (error) {
    // Handle errors and send a 500 status response
    res.status(500).json({ error: error.message });
  }
};

module.exports = { placeOrder }; // Export the placeOrder function for use in routes
