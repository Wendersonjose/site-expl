import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './modules/auth/auth.routes.js';
import categoryRoutes from './modules/categories/categories.routes.js';
import orderRoutes from './modules/orders/orders.routes.js';
import productRoutes from './modules/products/products.routes.js';
import reportRoutes from './modules/reports/reports.routes.js';
import userRoutes from './modules/users/users.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/notFound.middleware.js';

const app = express();

app.use(cors({ origin: env.frontendUrls }));
app.use(express.json());

// Health check / raiz.
app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'Explosion API está funcionando!' });
});

// Documentação interativa.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas de domínio.
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/reports', reportRoutes);
app.use('/users', userRoutes);

// 404 e tratamento central de erros (sempre por último).
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
