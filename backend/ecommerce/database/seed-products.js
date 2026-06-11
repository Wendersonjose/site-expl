// Cadastra produtos de exemplo (energeticos) no banco configurado no .env
// Uso: node database/seed-products.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  {
    name: 'Explosion Original',
    description: 'Energetico classico com cafeina, taurina e sabor intenso para energia imediata.',
    price: 8.9,
    stock: 50,
    category: 'Classico',
    image_url: '/assets/images/products/explosion-original.svg',
  },
  {
    name: 'Explosion Tropical',
    description: 'Mistura de manga, maracuja e citricos para um impulso refrescante.',
    price: 9.9,
    stock: 40,
    category: 'Frutado',
    image_url: '/assets/images/products/explosion-tropical.svg',
  },
  {
    name: 'Explosion Zero Sugar',
    description: 'Toda a energia sem acucar, ideal para treino, estudos e rotina corrida.',
    price: 10.5,
    stock: 35,
    category: 'Zero',
    image_url: '/assets/images/products/explosion-zero.svg',
  },
  {
    name: 'Explosion Berry Blast',
    description: 'Explosao de frutas vermelhas com morango, framboesa e amora.',
    price: 9.9,
    stock: 45,
    category: 'Frutado',
    image_url: '/assets/images/products/explosion-berry.svg',
  },
  {
    name: 'Explosion Citrus Lime',
    description: 'Limao e lima acidos com toque de hortela para refrescancia extrema.',
    price: 9.5,
    stock: 38,
    category: 'Citrico',
    image_url: '/assets/images/products/explosion-citrus.svg',
  },
  {
    name: 'Explosion Acai Power',
    description: 'Acai amazonico com guarana nativo, a combinacao premium de energia.',
    price: 11.9,
    stock: 30,
    category: 'Premium',
    image_url: '/assets/images/products/explosion-acai.svg',
  },
];

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

try {
  for (const product of products) {
    const [existing] = await connection.query(
      'SELECT id FROM products WHERE name = ?',
      [product.name],
    );

    if (existing.length > 0) {
      await connection.query(
        `
          UPDATE products
          SET description = ?, price = ?, category = ?, image_url = ?, active = TRUE
          WHERE id = ?
        `,
        [product.description, product.price, product.category, product.image_url, existing[0].id],
      );
      console.log(`Atualizado: ${product.name}`);
    } else {
      await connection.query(
        `
          INSERT INTO products (name, description, price, stock, category, image_url, active)
          VALUES (?, ?, ?, ?, ?, ?, TRUE)
        `,
        [product.name, product.description, product.price, product.stock, product.category, product.image_url],
      );
      console.log(`Criado: ${product.name}`);
    }
  }

  const [rows] = await connection.query('SELECT id, name, price, stock FROM products ORDER BY id');
  console.log('\nProdutos no banco:');
  for (const row of rows) {
    console.log(`- [${row.id}] ${row.name} | R$ ${row.price} | estoque ${row.stock}`);
  }
} finally {
  await connection.end();
}
