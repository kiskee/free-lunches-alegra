const express = require('express');
const { warehouseRouter } = require('./routes/supply.routes');

const app = express();

app.use(express.json());

// Registrar rutas
app.use('/supply', warehouseRouter);

module.exports = app;
