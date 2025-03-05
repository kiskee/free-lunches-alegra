const express = require('express');
const { supplyIngredients } = require('../controllers/warehouse.controller');

const warehouseRouter = express.Router();

warehouseRouter.post('/', supplyIngredients);

module.exports = { warehouseRouter };