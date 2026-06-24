const express = require('express');
const router = express.Router();
let orders = require('../../data/orders.json');

router.get('/', (req, res) => {
    res.json(orders);
});

router.post('/', (req, res) => {
    const newOrder = {
        id: Date.now(),
        ...req.body,
        date: new Date().toISOString()
    };
    orders.orders.push(newOrder);
    res.json({ success: true, order: newOrder });
});

module.exports = router;