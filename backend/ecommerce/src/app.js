import express from 'express';
import cors from 'cors';

import productRoutes from './modules/products/products.routes.js';
import userRoutes from './modules/users/users.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Explosion API está funcionando!',
  });
});

app.use('/products', productRoutes);
app.use('/users', userRoutes);

app.use(errorMiddleware);

export default app;