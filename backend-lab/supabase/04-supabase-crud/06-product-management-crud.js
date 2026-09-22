/**
 * Experiment: Create a Product Management CRUD application.
 * Run: node 04-supabase-crud/06-product-management-crud.js  -> http://localhost:3000
 */
require('../config/crudApp')({
  table: 'products',
  title: 'Product Management (Supabase)',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'price', type: 'number' },
    { name: 'stock', type: 'number' },
    { name: 'category', type: 'text' },
  ],
});
