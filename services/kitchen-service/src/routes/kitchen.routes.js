const express = require("express");
const {
  prepareRecipeController,
} = require("../controllers/kitchen.controller");

const router = express.Router();

// Define the route for preparing a recipe
router.post("/", prepareRecipeController);

module.exports = router;
