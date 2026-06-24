const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/products', (req, res) => {
    const products = require('../data/products.json');
    res.json(products);
});

app.post('/api/orders', (req, res) => {
    const order = req.body;
    order.id = Date.now();
    order.date = new Date().toISOString();
    res.json({ success: true, order });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});