const express = require("express"); // Import Express framework
const { placeOrder } = require("../controllers/order.controller"); // Import the placeOrder controller

const router = express.Router(); // Create a new router instance

// Define a POST route for placing an order
router.post("/", placeOrder);

module.exports = router; // Export the router for use in the main application
