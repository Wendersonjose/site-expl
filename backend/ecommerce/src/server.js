import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './modules/products/products.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Explosion API está funcionando!"
    })
})

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
