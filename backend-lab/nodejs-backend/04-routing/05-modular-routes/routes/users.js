const router = require('express').Router();
const users = [{ id: 1, name: 'Asha' }, { id: 2, name: 'Ravi' }];

router.get('/', (req, res) => res.json(users));
router.get('/:id', (req, res) => {
  const u = users.find((x) => x.id === +req.params.id);
  u ? res.json(u) : res.status(404).json({ error: 'User not found' });
});
router.post('/', (req, res) => { const u = { id: users.length + 1, ...req.body }; users.push(u); res.status(201).json(u); });

module.exports = router;
