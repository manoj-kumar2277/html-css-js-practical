/**
 * Experiment: Implement a basic Client-Server Architecture using Node.js.
 * Run: node 01-client-server-architecture.js
 * The SERVER listens on a port; the CLIENT sends a request and prints the response.
 */
const http = require('http');
const PORT = 3000;

// ---------- SERVER ----------
const server = http.createServer((req, res) => {
  console.log(`[SERVER] ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello from the server', time: new Date().toISOString() }));
});

server.listen(PORT, () => {
  console.log(`[SERVER] listening on http://localhost:${PORT}`);

  // ---------- CLIENT ----------
  http.get(`http://localhost:${PORT}/greeting`, (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log('[CLIENT] status :', res.statusCode);
      console.log('[CLIENT] body   :', body);
      server.close(() => console.log('[SERVER] closed'));
    });
  });
});
