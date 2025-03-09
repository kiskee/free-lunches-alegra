const express = require("express");
const {
  supplyIngredients,
  getCountTripsMall,
  getAllTrips,
  deleteAllTrips,
} = require("../controllers/warehouse.controller"); // Importamos los controladores

const warehouseRouter = express.Router();

/**
 * @route   POST /
 * @desc    Suministra ingredientes al inventario
 * @access  Public
 */
warehouseRouter.post("/", supplyIngredients);

/**
 * @route   GET /trips
 * @desc    Obtiene la cantidad de viajes registrados en el shopping mall
 * @access  Public
 */
warehouseRouter.get("/trips", getCountTripsMall);

/**
 * @route   GET /trips-records
 * @desc    Obtiene todos los registros de viajes (máximo 500)
 * @access  Public
 */
warehouseRouter.get("/trips-records", getAllTrips);

/**
 * @route   DELETE /delete-trips
 * @desc    Elimina todos los registros de viajes
 * @access  Public
 */
warehouseRouter.delete("/delete-trips", deleteAllTrips);

module.exports = { warehouseRouter };
