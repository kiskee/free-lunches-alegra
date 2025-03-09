const express = require("express");
const {
  placeOrder,
  getCountHistory,
  getAllItems,
  deleteAllHistory,
  getCountStatus,
  getAllStatus,
  deleteAllStatus,
} = require("../controllers/order.controller");

const router = express.Router();

// 🔹 Ruta para colocar una orden
router.post("/", placeOrder);

// 🔹 Ruta para obtener el conteo del historial
router.get("/history", getCountHistory);

// 🔹 Ruta para todos los resgistro
router.get("/history-records", getAllItems);

router.delete("/delete-history", deleteAllHistory)

router.get("/status", getCountStatus);

// 🔹 Ruta para todos los resgistro
router.get("/status-records", getAllStatus);

router.delete("/delete-status", deleteAllStatus)

module.exports = router;
