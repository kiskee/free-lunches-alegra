const express = require('express');
const { warehouseRouter } = require('./routes/supply.routes');

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Register the warehouse router under the "/supply" endpoint
app.use('/supply', warehouseRouter);

module.exports = app;
