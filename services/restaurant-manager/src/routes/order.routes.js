const express = require("express");
const {
  placeOrder,
  getCountHistory,
  getAllItems,
  deleteAllHistory,
} = require("../controllers/order.controller");

const router = express.Router();

// 🔹 Ruta para colocar una orden
router.post("/", placeOrder);

// 🔹 Ruta para obtener el conteo del historial
router.get("/history", getCountHistory);

// 🔹 Ruta para todos los resgistro
router.get("/history-records", getAllItems);

router.delete("/delete-history", deleteAllHistory)

module.exports = router;
