# Node.js Backend Lab

Setup: `npm install` (Node 18+). Every experiment is one file; run with `node <folder>/<file>.js`
(all servers use http://localhost:3000, so run one at a time). Each file's header comment lists the aim and test commands.

| Folder | Experiments |
|---|---|
| 01-server-side-architecture | client-server, HTTP server, request-response cycle |
| 02-nodejs-fundamentals | built-in modules, fs, path, custom modules, npm, async patterns, error handling |
| 03-express-framework | basic app, GET/POST, static files, HTML/JSON, modular structure |
| 04-routing | routing, route/query params, Router, 404, modular routes |
| 05-middleware | custom, logging, validation, authentication, error handling, execution order |
| 06-session-and-cookie-management | cookies, read/delete, sessions, login/logout, protected routes |
| 07-database-connectivity | connect, create tables, insert, retrieve, update, delete (SQLite) |
| 08-crud-operations | CRUD, Student/User/Product apps, DB CRUD, validation |
| 09-authentication | register, login/logout, hashing, verification, JWT, protected API |
| 10-authorization | RBAC, admin/user roles, restricted routes, authorization middleware |
| 11-restful-api-development | GET/POST/PUT/PATCH/DELETE, status codes, errors, validation, Postman, Student/Product/User APIs |

`common/` holds the shared SQLite connection, CRUD router factory and validators.
Files ending `04a-`/`09-postman-collection.json` are helpers for the experiment with the same number.
