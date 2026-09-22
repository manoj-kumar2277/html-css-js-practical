/**
 * Experiment: Demonstrate the execution order of middleware.
 * Run: node 06-middleware-execution-order.js -> GET /  and watch the console order
 * Rule: middleware runs in the order it is registered; next() moves on; a response ends the chain.
 */
const express = require('express');
const app = express();

app.use((req, res, next) => { console.log('1. first global middleware'); next(); });
app.use((req, res, next) => { console.log('2. second global middleware'); next(); });

app.get('/', (req, res, next) => { console.log('3. route middleware A'); next(); },
               (req, res, next) => { console.log('4. route middleware B'); next(); },
               (req, res) => { console.log('5. final route handler -> response sent'); res.send('Check the console order'); });

app.use((req, res, next) => { console.log('6. NEVER printed for "/" (response already sent)'); next(); });

app.get('/stop', (req, res, next) => { console.log('/stop handler'); res.send('stopped'); });
app.use((req, res) => { console.log('7. fallback (404) middleware'); res.status(404).send('Not found'); });

app.listen(3000, () => console.log('http://localhost:3000'));
