/**
 * Experiment: Implement Authorization Middleware (roles + ownership).
 * Run  : node 04-authorization-middleware.js
 * Demo : send header  x-user-id: 1 | 2   and  x-role: user | admin
 *        curl -X PUT localhost:3000/posts/1 -H "x-user-id: 2" -H "x-role: user" -H "Content-Type: application/json" -d '{"title":"x"}'  -> 403
 */
const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {                                   // stand-in for real authentication
  req.user = { id: Number(req.headers['x-user-id']) || 0, role: req.headers['x-role'] || 'user' };
  next();
});

const posts = [{ id: 1, ownerId: 1, title: 'Post by user 1' }, { id: 2, ownerId: 2, title: 'Post by user 2' }];

// authorization middleware: admin OR owner of the resource
function authorizeOwnerOrAdmin(getOwnerId) {
  return (req, res, next) => {
    const ownerId = getOwnerId(req);
    if (ownerId === undefined) return res.status(404).json({ error: 'Resource not found' });
    if (req.user.role === 'admin' || req.user.id === ownerId) return next();
    res.status(403).json({ error: 'You are not allowed to modify this resource' });
  };
}
const postOwner = (req) => posts.find((p) => p.id === +req.params.id)?.ownerId;

app.get('/posts', (req, res) => res.json(posts));
app.put('/posts/:id', authorizeOwnerOrAdmin(postOwner), (req, res) => {
  const post = posts.find((p) => p.id === +req.params.id);
  post.title = req.body.title ?? post.title;
  res.json(post);
});
app.delete('/posts/:id', authorizeOwnerOrAdmin(postOwner), (req, res) => {
  posts.splice(posts.findIndex((p) => p.id === +req.params.id), 1);
  res.status(204).end();
});

app.listen(3000, () => console.log('http://localhost:3000'));
