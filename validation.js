function validateOrder(req, res, next) {
    const { items, total, customer } = req.body;
    
    if (!items || !items.length) {
        return res.status(400).json({ error: 'Order must have items' });
    }
    
    if (!total || total <= 0) {
        return res.status(400).json({ error: 'Invalid total amount' });
    }
    
    if (!customer || !customer.name || !customer.email) {
        return res.status(400).json({ error: 'Customer information required' });
    }
    
    next();
}

module.exports = { validateOrder };