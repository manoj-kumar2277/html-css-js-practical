const items = [{ id: 1, name: 'Notebook' }, { id: 2, name: 'Pen' }];

exports.list = (req, res) => res.json(items);

exports.get = (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  item ? res.json(item) : res.status(404).json({ error: 'Item not found' });
};

exports.create = (req, res) => {
  const item = { id: items.length + 1, name: req.body.name };
  items.push(item);
  res.status(201).json(item);
};
