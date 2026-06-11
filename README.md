# EXPLOSION E-commerce

Projeto academico de uma loja virtual para a empresa ficticia **EXPLOSION**, focada na venda de energeticos.

O sistema agora possui um fluxo basico completo de frontend e backend:

- cadastro de usuario;
- login com validacao no backend;
- senha criptografada no banco;
- sessao salva no navegador;
- home page protegida;
- vitrine de produtos;
- pesquisa de produtos;
- carrinho local;
- pedidos registrados no MySQL;
- baixa automatica de estoque;
- painel para administradores gerenciarem produtos, pedidos, estoque e clientes.

## Como o Sistema Funciona

O projeto esta dividido em duas partes principais.

### Frontend

As telas ficam na pasta `pages`.

Arquivos principais:

- `pages/auth/login.html`: tela de login.
- `pages/auth/cadastro.html`: tela de cadastro.
- `pages/home.html`: home page da EXPLOSION depois do login.
- `pages/assets/css/styles.css`: estilos visuais das telas.
- `pages/assets/js/api.js`: funcoes de comunicacao com o backend e controle de sessao.
- `pages/assets/js/auth.js`: logica de login e cadastro.
- `pages/assets/js/home.js`: logica da home, busca, carrinho e painel admin.

Fluxo do usuario:

1. O usuario abre a tela de login.
2. Se nao tiver conta, acessa a tela de cadastro.
3. O cadastro envia nome, email e senha para o backend.
4. Depois do cadastro, o usuario volta para o login.
5. O login valida email e senha no backend.
6. Ao entrar, o usuario e levado para a home.
7. Na home, clientes podem pesquisar produtos, adicionar ao carrinho e criar pedidos reais.
8. O checkout registra pedido, itens e reduz o estoque em uma transacao.
9. Administradores tambem veem indicadores e ferramentas de gestao.

### Backend

O backend fica em `backend/ecommerce` e usa Node.js com Express.

Arquivos principais:

- `src/server.js`: inicia o servidor.
- `src/app.js`: configura Express, CORS, JSON, arquivos estaticos e rotas.
- `src/config/database.js`: conecta com MySQL.
- `src/middlewares/error.middleware.js`: padroniza respostas de erro.
- `src/modules/auth`: rotas e regras de login/cadastro.
- `src/modules/users`: CRUD basico de usuarios.
- `src/modules/products`: CRUD basico de produtos.
- `src/modules/orders`: criacao, listagem e atualizacao de pedidos.
- `database/schema.sql`: estrutura das tabelas MySQL usadas pelo backend.

Rotas principais:

- `GET /`: abre a tela de login.
- `GET /api/health`: verifica se a API esta no ar.
- `POST /auth/register`: cria um usuario.
- `POST /auth/login`: autentica um usuario.
- `GET /products`: lista produtos.
- `GET /products/:id`: busca produto por ID.
- `POST /products`: cria produto.
- `PUT /products/:id`: atualiza produto.
- `DELETE /products/:id`: remove produto.
- `GET /orders`: lista pedidos do usuario ou todos os pedidos para administradores.
- `POST /orders`: cria pedido e reduz o estoque.
- `PUT /orders/:id/status`: altera o status do pedido como administrador.
- `GET /users`: lista usuarios.
- `GET /users/:id`: busca usuario por ID.
- `POST /users`: cria usuario.
- `PUT /users/:id`: atualiza usuario.
- `DELETE /users/:id`: remove usuario.

## Banco de Dados

O backend atual usa **MySQL** (hospedado no Railway).

O arquivo `backend/ecommerce/database/schema.sql` cria:

- tabela `products`, usada na vitrine e no CRUD de produtos;
- tabela `users`, usada no cadastro, login e CRUD de usuarios.
- tabela `orders`, usada para registrar pedidos.
- tabela `order_items`, usada para registrar os produtos de cada pedido.

Tambem existe o arquivo `database/Explo_DB.sql`, que e um modelo maior em **MySQL** com tabelas de pedidos, carrinho, pagamentos, cupons e outras partes do e-commerce. Ele serve como referencia de modelagem, mas nao e usado diretamente pelo backend atual.

## Como Rodar o Projeto

### 1. Instalar requisitos

Voce precisa ter instalado:

- Node.js 18 ou superior;
- Git.

O banco MySQL ja esta hospedado no Railway, entao nao e preciso instalar banco localmente. Se quiser usar um MySQL local, instale o MySQL 8 e ajuste o `.env`.

### 2. Criar as tabelas no banco

Com o `.env` configurado (passo 3), execute dentro de `backend/ecommerce`:

```bash
node database/apply-schema.js
```

Isso aplica o arquivo `backend/ecommerce/database/schema.sql` no banco configurado. Tambem e possivel executar o schema manualmente pelo MySQL Workbench ou pela CLI `mysql`.

### 3. Configurar variaveis de ambiente

Dentro de `backend/ecommerce`, crie um arquivo `.env` baseado em `.env.example`.

Exemplo:

```env
PORT=3000
NODE_ENV=development

DB_HOST=acela.proxy.rlwy.net
DB_PORT=29604
DB_USER=root
DB_PASSWORD=senha_do_railway
DB_NAME=railway

JWT_SECRET=uma_chave_secreta_para_desenvolvimento
JWT_EXPIRES_IN=7d
```

### 4. Instalar dependencias

Entre na pasta do backend:

```bash
cd backend/ecommerce
npm install
```

No PowerShell, se o comando `npm` for bloqueado por politica de execucao, use:

```bash
npm.cmd install
```

### 5. Rodar o servidor

Modo desenvolvimento:

```bash
npm run dev
```

Ou modo normal:

```bash
npm start
```

Depois acesse:

```text
http://localhost:3000
```

## Como Testar o Fluxo

1. Acesse `http://localhost:3000`.
2. Clique em `Criar cadastro`.
3. Preencha nome, email e senha.
4. Finalize o cadastro.
5. Volte para o login.
6. Entre com o email e senha criados.
7. Navegue pela home, pesquise produtos e adicione itens ao carrinho.
8. Finalize o carrinho para criar um pedido.

Cadastros publicos sao sempre criados como cliente. Para transformar uma conta de teste em administrador, execute no MySQL:

```sql
UPDATE users
SET perfil = 'admin'
WHERE email = 'email-do-administrador@exemplo.com';
```

Depois, saia e entre novamente para o token receber o novo perfil.

Se o banco nao tiver produtos cadastrados, a home exibe alguns produtos de exemplo para manter a vitrine visivel.

## Status Atual

Implementado:

- backend Express;
- conexao com PostgreSQL;
- schema de usuarios e produtos;
- cadastro de usuario;
- login de usuario;
- criptografia de senha com bcrypt;
- token JWT retornado no login;
- protecao de rotas administrativas com JWT;
- telas separadas em HTML, CSS e JavaScript;
- home da EXPLOSION;
- busca de produtos;
- carrinho local;
- pedidos reais no banco;
- baixa automatica de estoque;
- painel administrativo de produtos, estoque, pedidos e clientes.

Ainda planejado:

- integracao de pagamento;
- testes automatizados.

## Fluxo Git Recomendado

Este trabalho deve ser enviado em branch de feature para revisao, sem merge direto na `main`.

Branch sugerida:

```bash
feat/seunome/restruturacao-login-homepage
```

Depois de revisar localmente:

```bash
git add .
git commit -m "feat: reestrutura login cadastro e homepage"
git push origin feat/seunome/restruturacao-login-homepage
```

Depois disso, abra um Pull Request para que o senior aprove antes de integrar na branch principal.
