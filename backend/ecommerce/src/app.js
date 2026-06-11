import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './modules/auth/auth.routes.js';
import orderRoutes from './modules/orders/orders.routes.js';
import productRoutes from './modules/products/products.routes.js';
import userRoutes from './modules/users/users.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');
const pagesPath = path.join(projectRoot, 'pages');

app.use(cors());
app.use(express.json());
app.use(express.static(pagesPath));

app.get('/', (req, res) => {
  return res.sendFile(path.join(pagesPath, 'auth', 'login.html'));
});

app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Explosion API esta funcionando!',
  });
});

app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);

app.use(errorMiddleware);

export default app;
