const express = require('express');
const { supplyIngredients, getCountTripsMall, getAllTrips, deleteAllTrips } = require('../controllers/warehouse.controller'); //

const warehouseRouter = express.Router();

warehouseRouter.post('/', supplyIngredients);

warehouseRouter.get("/trips", getCountTripsMall);


warehouseRouter.get("/trips-records", getAllTrips);

warehouseRouter.delete("/delete-trips", deleteAllTrips)

module.exports = { warehouseRouter };