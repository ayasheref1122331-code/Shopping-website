const express = require('express');
const router = express.Router();
const products = require('../../data/products.json');

router.get('/', (req, res) => {
    res.json(products);
});

router.get('/:id', (req, res) => {
    const product = products.products.find(p => p.id == req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ error: 'Product not found' });
});

module.exports = router;