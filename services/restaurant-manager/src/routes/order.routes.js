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

// 🔹 Route to place an order
router.post("/", placeOrder);

// 🔹 Route to get the history count
router.get("/history", getCountHistory);

// 🔹 Route to get all history records
router.get("/history-records", getAllItems);

// 🔹 Route to delete all history records
router.delete("/delete-history", deleteAllHistory);

// 🔹 Route to get the status count
router.get("/status", getCountStatus);

// 🔹 Route to get all status records
router.get("/status-records", getAllStatus);

// 🔹 Route to delete all status records
router.delete("/delete-status", deleteAllStatus);

module.exports = router;
