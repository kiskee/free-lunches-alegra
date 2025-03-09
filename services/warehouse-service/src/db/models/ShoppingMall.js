const mongoose = require("mongoose");

const shoppingMallSchema = new mongoose.Schema({
    ingredient: { type: String, required: true },
    response: { type: Number, required: true },
});

const ShoppingMall = mongoose.model("ShoppingMall", shoppingMallSchema);

module.exports = ShoppingMall;
