# 💥 Explosion E-commerce

> Plataforma de loja virtual desenvolvida como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas (disciplina de Banco de Dados). Reúne uma **API REST**, uma **loja para clientes** e um **painel administrativo**.

---

## 📋 Visão geral

O sistema tem três partes que conversam entre si:

| Parte | O que é | Tecnologia | Porta (dev) |
|-------|---------|------------|-------------|
| **Backend** (`backend/ecommerce`) | API REST com as regras de negócio | Node.js + Express + MySQL | `3000` |
| **Loja** (`frontend/ecommerce`) | Site onde o cliente compra | React + Vite | `5173` |
| **Admin** (`frontend/admin`) | Painel de gestão (produtos, pedidos, relatórios) | React + Vite | `5174` |

Toda persistência fica em um único banco **MySQL relacional**, hospedado no **Railway**.

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Para quê |
|------------|----------|
| **Node.js + Express 5** | Servidor HTTP e roteamento da API |
| **MySQL** (driver `mysql2`) | Banco de dados relacional (pool de conexões) |
| **JWT** (`jsonwebtoken`) | Autenticação stateless por token |
| **bcrypt** | Hash das senhas |
| **Swagger** (`swagger-jsdoc` + `swagger-ui-express`) | Documentação interativa em `/docs` |
| **pdfkit** | Exportação de relatórios em PDF |
| **dotenv** | Variáveis de ambiente fora do código |

### Frontends (loja e admin)
| Tecnologia | Para quê |
|------------|----------|
| **React 19 + Vite** | Interface e build |
| **React Router** | Navegação entre páginas |
| **Fetch API** | Comunicação com o backend |

---

## 📁 Estrutura do projeto

```
site-expl/
├── backend/
│   └── ecommerce/                 # API REST (Node + Express + MySQL)
│       ├── src/
│       │   ├── app.js             # Express: CORS, JSON, rotas, Swagger, erros
│       │   ├── server.js          # Sobe o servidor e checa o banco
│       │   ├── config/            # env, database (pool MySQL), swagger
│       │   ├── middlewares/       # auth (JWT), authorize, error, notFound
│       │   ├── shared/            # AppError, asyncHandler, httpResponse,
│       │   │                      #   password (bcrypt), withTransaction
│       │   └── modules/           # um módulo por domínio (ver abaixo)
│       │       ├── auth/          # registro, login, /me
│       │       ├── users/         # CRUD de usuários (admin)
│       │       ├── products/      # CRUD de produtos
│       │       ├── categories/    # CRUD de categorias
│       │       ├── orders/        # criação e consulta de pedidos
│       │       └── reports/       # relatórios gerenciais + export CSV/PDF
│       ├── database/schema.sql    # Subconjunto MySQL usado pela API
│       ├── postman/               # Collection do Postman
│       └── scripts/create-admin.js# Cria um usuário admin com senha hasheada
│
├── frontend/
│   ├── ecommerce/                 # Loja do cliente (React/Vite)
│   └── admin/                     # Painel administrativo (React/Vite)
│
└── database/Explo_DB.sql          # Modelo relacional completo (fonte da verdade)
```

### Arquitetura do backend (camadas)

Cada módulo segue o fluxo: **routes → controller → service → repository**, com
`validation` e `mapper` de apoio.

```
HTTP → routes → controller → service → repository → MySQL
                   (thin)    (regras)    (SQL)
```

- **routes** — define endpoints e middlewares (auth/authorize).
- **controller** — fino; só recebe a requisição e devolve a resposta (`asyncHandler` cuida do try/catch).
- **service** — regras de negócio, validações e orquestração (ex.: pedido em transação).
- **repository** — única camada que fala SQL (queries parametrizadas).
- **mapper** — traduz linhas do banco (colunas em PT) para o DTO da API.

Respostas seguem o formato `{ success, data }` (e `{ success, message, details? }` em erros).

---

## 🚀 Como rodar

### Pré-requisitos
- **Node.js 18+**
- Acesso a um banco **MySQL** (o projeto usa uma instância no Railway; o schema está em `database/Explo_DB.sql`).

### 1) Backend
```bash
cd backend/ecommerce
npm install
cp .env.example .env     # depois edite o .env com suas credenciais
npm run dev              # http://localhost:3000  (docs em /docs)
```

`.env` (nunca versionar):
```env
PORT=3000
NODE_ENV=development
DB_HOST=...            # host do MySQL
DB_PORT=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=railway
JWT_SECRET=<chave_aleatoria_forte>
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173,http://localhost:5174
```

> Gere um `JWT_SECRET` forte com:
> `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

Para criar um usuário **admin** (o registro público cria só `cliente`):
```bash
node scripts/create-admin.js
```

### 2) Loja (cliente)
```bash
cd frontend/ecommerce
npm install
npm run dev              # http://localhost:5173
```

### 3) Admin
```bash
cd frontend/admin
npm install
npm run dev              # http://localhost:5174
```

---

## 🔌 Endpoints principais

Base: `http://localhost:3000` · Documentação interativa: `http://localhost:3000/docs`

### 🔐 Autenticação — `/auth`
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Registra um **cliente** (retorna token) |
| POST | `/auth/login` | Login por e-mail e senha (retorna token) |
| GET | `/auth/me` | Dados do usuário autenticado |

### 📦 Produtos — `/products`
| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/products` | público (filtros: `search`, `categoria`, `ativo`) |
| GET | `/products/:id` | público |
| POST | `/products` | admin |
| PUT | `/products/:id` | admin |
| DELETE | `/products/:id` | admin |

### 🏷️ Categorias — `/categories`
| GET `/categories` (público) · POST (admin) · DELETE `/:id` (admin) |
|---|

### 🛒 Pedidos — `/orders` (cliente autenticado)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/orders` | Cria pedido (endereço + itens; baixa estoque em transação) |
| GET | `/orders` | Lista os pedidos do usuário |
| GET | `/orders/:id` | Detalhe do pedido |

### 💳 Pagamentos — `/payments`
| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/payments/methods` | público (formas de pagamento ativas) |
| POST | `/payments` | cliente autenticado (paga um pedido → status `pago`) |
| GET | `/payments/order/:idPedido` | dono do pedido / admin |

### ⭐ Avaliações — `/reviews`
| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/reviews/product/:idProduto` | público (média + total + comentários) |
| POST | `/reviews` | cliente autenticado (só avalia produto que comprou) |

### 📊 Relatórios — `/reports` (admin)
`/dashboard`, `/faturamento-total`, `/ticket-medio`, `/produtos-mais-vendidos`,
`/clientes-com-mais-compras`, `/estoque-baixo` — cada um com `…/export/csv` e `…/export/pdf`.

### 👤 Usuários — `/users` (admin)
CRUD completo (`GET`, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id`).

> Há uma collection pronta em `backend/ecommerce/postman/explosion-api.postman_collection.json`
> (o login salva o token automaticamente).

---

## 🗄️ Banco de dados

Modelo relacional em **MySQL**, definido em [`database/Explo_DB.sql`](database/Explo_DB.sql) — 15 tabelas com chaves estrangeiras e integridade referencial, incluindo `usuarios`, `categorias`, `produtos`, `imagens_produto`, `enderecos`, `pedidos`, `itens_pedido`, `cupons`, `promocoes`, `transacoes_financeiras`, `avaliacoes`, `carrinho` e `audit_logs`.

As queries usam **parâmetros** (`?`) — proteção contra SQL Injection — e os pedidos são criados em **transação** com bloqueio de linha para garantir a baixa de estoque consistente.

---

## ✅ Estado atual

| Módulo | Backend | Loja | Admin |
|--------|:------:|:----:|:-----:|
| Autenticação (JWT) | ✅ | ✅ | ✅ |
| Produtos (CRUD) | ✅ | ✅ (catálogo) | ✅ (gestão) |
| Categorias | ✅ | — | ✅ |
| Pedidos | ✅ | ✅ (checkout + "Meus Pedidos") | — |
| Pagamentos | ✅ | ✅ (paga pedido pendente) | — |
| Avaliações | ✅ | ✅ (avalia compra / vê notas) | — |
| Relatórios + export CSV/PDF | ✅ | — | ✅ (dashboard) |
| Usuários | ✅ | — | ✅ |

**Próximos passos:** carrinho persistido no banco, cupons de desconto e promoções.

---

## 👥 Equipe

| Frente | Integrantes |
|--------|-------------|
| Backend E-commerce | Wenderson José da Silva · Emerson Cardoso Fialho · Gabriel Moreira Freire |
| Frontend E-commerce | Italo Candido Gouveia · Erick Matheus Gonçalves |
| Backend Gerencial | Túlio Henrique Santos Gonçalves · Thiago Anthony Alves Pereira · Rodrigo Pinheiro |
| Frontend Gerencial | Eduardo do Prado · Bruno Lucas dos Santos |
| Banco de Dados | Gabriel Haykonen Cortês · Antonio Carlos Camargo Fernandes |

---

## 🌿 Fluxo de trabalho (Git)

- Branches principais: **`main`** (estável) e **`develop`** (integração).
- Trabalhe sempre em uma branch de feature: `feat/<seu-nome>/<funcionalidade>`.
- Abra Pull Request para **`develop`** e peça revisão.
- **Nunca** comite o arquivo `.env` nem credenciais.

```bash
git checkout develop && git pull upstream develop
git checkout -b feat/seu-nome/sua-feature
# ... trabalhe, commite ...
git push origin feat/seu-nome/sua-feature   # abra o PR para develop
```

---

<p align="center"><strong>Explosion E-commerce</strong> — do código ao carrinho 🚀</p>
