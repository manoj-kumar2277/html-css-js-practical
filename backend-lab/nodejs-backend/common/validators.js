// Small reusable validators for crudFactory (each returns an error message or null).
exports.string = (min = 1) => (v) => (typeof v === 'string' && v.trim().length >= min ? null : `must be a string (min ${min} chars)`);
exports.email = () => (v) => (typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'must be a valid email');
exports.int = (min = 0) => (v) => (Number.isInteger(v) && v >= min ? null : `must be an integer >= ${min}`);
exports.number = (min = 0) => (v) => (typeof v === 'number' && v >= min ? null : `must be a number >= ${min}`);
exports.oneOf = (list) => (v) => (list.includes(v) ? null : `must be one of ${list.join(', ')}`);
