import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Explosion API está funcionando!"
    })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
