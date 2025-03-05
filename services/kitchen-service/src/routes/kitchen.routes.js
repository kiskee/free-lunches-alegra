const express = require('express');
const { prepareRecipe } = require('../controllers/kitchen.controller');

const router = express.Router();

// Define the route for preparing a recipe
router.post('/', prepareRecipe);

module.exports = router;
