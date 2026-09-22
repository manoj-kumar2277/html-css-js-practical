/**
 * Experiment: Create multiple routes using Express Router.
 * Run: node 03-express-router.js  -> /api/users , /api/products , /api/orders
 */
const express = require('express');
const app = express();

const userRouter = express.Router();
userRouter.get('/', (req, res) => res.json(['Asha', 'Ravi']));
userRouter.get('/:id', (req, res) => res.json({ user: req.params.id }));

const productRouter = express.Router();
productRouter.get('/', (req, res) => res.json(['Laptop', 'Phone']));

const orderRouter = express.Router();
orderRouter.get('/', (req, res) => res.json([{ id: 1, total: 500 }]));

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

app.listen(3000, () => console.log('http://localhost:3000'));
