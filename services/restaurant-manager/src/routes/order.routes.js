

const express = require('express');
const { placeOrder } = require('../controllers/order.controller');

const router = express.Router();

router.post('/', placeOrder);

module.exports = router;