const router = require('express').Router();
const students = [{ id: 1, name: 'Meena', course: 'CSE' }];

router.get('/', (req, res) => res.json(students));
router.get('/:id', (req, res) => {
  const s = students.find((x) => x.id === +req.params.id);
  s ? res.json(s) : res.status(404).json({ error: 'Student not found' });
});
router.post('/', (req, res) => { const s = { id: students.length + 1, ...req.body }; students.push(s); res.status(201).json(s); });

module.exports = router;
