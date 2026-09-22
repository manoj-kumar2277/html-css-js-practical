/**
 * Experiment: Demonstrate the Request-Response Cycle in a server-side application.
 * Run: node 03-request-response-cycle.js
 * Test: curl -X POST "http://localhost:3000/echo?x=1" -H "Content-Type: application/json" -d '{"a":1}'
 */
const http = require('http');

http.createServer((req, res) => {
  const started = Date.now();
  console.log('\n1) REQUEST RECEIVED');
  console.log('   method :', req.method);
  console.log('   url    :', req.url);
  console.log('   headers:', req.headers['content-type'] || '(none)');

  let body = '';
  req.on('data', (chunk) => (body += chunk));            // 2) body arrives in chunks
  req.on('end', () => {
    console.log('2) BODY COMPLETE  :', body || '(empty)');

    const payload = {                                     // 3) server processes the request
      method: req.method,
      path: new URL(req.url, 'http://localhost').pathname,
      query: Object.fromEntries(new URL(req.url, 'http://localhost').searchParams),
      body: body ? JSON.parse(body) : null,
    };

    res.writeHead(200, { 'Content-Type': 'application/json', 'X-Powered-By': 'NodeLab' }); // 4) response
    res.end(JSON.stringify(payload, null, 2));
    console.log(`3) RESPONSE SENT in ${Date.now() - started} ms`);
  });
}).listen(3000, () => console.log('Listening on http://localhost:3000'));
