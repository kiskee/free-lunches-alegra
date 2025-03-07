const RestaurantService = require("../services/restaurant.service"); // Import the restaurant service
const axios = require("axios");
const { connectProducer, sendMessage } = require("../kafka");
const crypto = require("crypto");

/**
 * Handles incoming order requests.
 * Selects a random recipe and sends it as a response.
 */
const placeOrder = async (req, res) => {
  try {
    await connectProducer();
    // sendMessage("kitchen", { orderId: 123, status: "pending" });
    const service = new RestaurantService(); // Instantiate the restaurant service
    const selectedRecipe = service.selectRandomRecipe(); // Select a random recipe
    const uuid = crypto.randomUUID();
    selectedRecipe["id"] = uuid;
    sendMessage("kitchen", selectedRecipe);

    service.sendeventToKitchen(selectedRecipe);
    res.json({
      success: true,
      message: "Orden enviada a la cocina",
      orderId: uuid,
    });
  } catch (error) {
    // Handle errors and send a 500 status response
    res.status(500).json({ error: error.message });
  }
};

module.exports = { placeOrder }; // Export the placeOrder function for use in routes
