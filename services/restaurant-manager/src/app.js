const express = require("express");
const orderRoutes = require("./routes/order.routes");

const app = express();

// Enable JSON parsing for incoming requests
app.use(express.json());

// Register order routes under the "/order" endpoint
app.use("/order", orderRoutes);

// Export the configured Express application
module.exports = app;
