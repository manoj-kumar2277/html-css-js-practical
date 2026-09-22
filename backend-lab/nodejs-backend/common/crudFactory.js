// Builds an Express Router with full CRUD + validation for any SQLite table.
const express = require('express');

/**
 * @param {object} db      better-sqlite3 database
 * @param {string} table   table name
 * @param {object} fields  { column: (value) => errorMessage | null }  (validators)
 * @param {string[]} hide  columns never returned (e.g. password)
 */
module.exports = function crudFactory(db, table, fields, hide = []) {
  const router = express.Router();
  const cols = Object.keys(fields);
  const strip = (row) => { if (row) hide.forEach((h) => delete row[h]); return row; };

  const validate = (body, partial = false) => {
    const errors = [];
    for (const c of cols) {
      if (body[c] === undefined) { if (!partial) errors.push(`${c} is required`); continue; }
      const msg = fields[c](body[c]);
      if (msg) errors.push(`${c}: ${msg}`);
    }
    return errors;
  };

  router.get('/', (req, res) => {
    res.json(db.prepare(`SELECT * FROM ${table}`).all().map(strip));
  });

  router.get('/:id', (req, res) => {
    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: `${table} record not found` });
    res.json(strip(row));
  });

  router.post('/', (req, res) => {
    const errors = validate(req.body);
    if (errors.length) return res.status(400).json({ errors });
    try {
      const info = db.prepare(
        `INSERT INTO ${table} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`
      ).run(...cols.map((c) => req.body[c]));
      res.status(201).json(strip(db.prepare(`SELECT * FROM ${table} WHERE id=?`).get(info.lastInsertRowid)));
    } catch (e) { res.status(409).json({ error: e.message }); }
  });

  router.put('/:id', (req, res) => {
    const errors = validate(req.body, true);
    if (errors.length) return res.status(400).json({ errors });
    const keys = cols.filter((c) => req.body[c] !== undefined);
    if (!keys.length) return res.status(400).json({ error: 'nothing to update' });
    try {
      const info = db.prepare(`UPDATE ${table} SET ${keys.map((k) => `${k}=?`).join(',')} WHERE id=?`)
        .run(...keys.map((k) => req.body[k]), req.params.id);
      if (!info.changes) return res.status(404).json({ error: 'record not found' });
      res.json(strip(db.prepare(`SELECT * FROM ${table} WHERE id=?`).get(req.params.id)));
    } catch (e) { res.status(409).json({ error: e.message }); }
  });

  router.delete('/:id', (req, res) => {
    const info = db.prepare(`DELETE FROM ${table} WHERE id=?`).run(req.params.id);
    if (!info.changes) return res.status(404).json({ error: 'record not found' });
    res.status(204).end();
  });

  return router;
};
