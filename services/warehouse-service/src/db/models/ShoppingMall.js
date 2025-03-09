const mongoose = require("mongoose");

/**
 * Defines the schema for the Shopping Mall collection in MongoDB.
 * 
 * This schema stores information about ingredients and their associated response values.
 */
const shoppingMallSchema = new mongoose.Schema({
  ingredient: { 
    type: String, 
    required: true, // Ensures the ingredient field is mandatory
  },
  response: { 
    type: Number, 
    required: true, // Ensures the response field is mandatory
  },
});

// Create the ShoppingMall model using the defined schema
const ShoppingMall = mongoose.model("ShoppingMall", shoppingMallSchema);

module.exports = ShoppingMall;
