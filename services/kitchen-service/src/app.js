const express = require('express');
const kitchenRoutes = require('./routes/kitchen.routes');

const app = express();

// Enable JSON parsing for incoming requests
app.use(express.json());

// Register kitchen routes
app.use('/prepare', kitchenRoutes);

module.exports = app;