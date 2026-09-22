const router = require('express').Router();
const products = [{ id: 1, name: 'Laptop', price: 55000 }, { id: 2, name: 'Mouse', price: 500 }];

router.get('/', (req, res) => res.json(products));
router.get('/:id', (req, res) => {
  const p = products.find((x) => x.id === +req.params.id);
  p ? res.json(p) : res.status(404).json({ error: 'Product not found' });
});
router.post('/', (req, res) => { const p = { id: products.length + 1, ...req.body }; products.push(p); res.status(201).json(p); });

module.exports = router;
