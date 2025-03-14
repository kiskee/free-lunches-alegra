const express = require("express");
const {
  prepareRecipeController,
  healthCheck,
} = require("../controllers/kitchen.controller");

const router = express.Router();

// Define the route for preparing a recipe
router.post("/", prepareRecipeController);

router.get("/health", healthCheck);

module.exports = router;
