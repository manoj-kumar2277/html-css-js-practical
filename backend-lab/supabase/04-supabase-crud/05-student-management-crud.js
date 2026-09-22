/**
 * Experiment: Create a Student Management CRUD application.
 * Run: node 04-supabase-crud/05-student-management-crud.js  -> http://localhost:3000
 * API: GET/POST /api/students , GET/PUT/DELETE /api/students/:id
 */
require('../config/crudApp')({
  table: 'students',
  title: 'Student Management (Supabase)',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'course', type: 'text' },
    { name: 'age', type: 'number' },
  ],
});
