# 💥 Explosion E-commerce

> Plataforma completa de loja virtual desenvolvida como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas. Este projeto transforma um site institucional simples em um e-commerce profissional.

---

## 📋 O Que é Este Projeto?

O **Explosion E-commerce** é uma **loja virtual completa** que permite:
- **Para Clientes**: Navegar, pesquisar produtos, adicionar ao carrinho e realizar compras
- **Para Administradores**: Gerenciar produtos, pedidos, estoque e clientes através de um painel administrativo

### 🎯 Objetivos do Projeto

Este projeto foi criado para:
- ✅ Aprender a desenvolver uma aplicação web completa (do zero até a publicação)
- ✅ Trabalhar em equipe usando ferramentas profissionais (Git, GitHub)
- ✅ Entender como funciona uma loja virtual "por dentro"
- ✅ Aplicar conhecimentos de programação, banco de dados e design de software

---

## 🏗️ Como o Sistema Funciona?

Imagine o sistema dividido em **3 partes principais**:

### 1️⃣ **Frontend** (A parte que você vê)
É a **interface visual** do site - tudo que aparece na tela do navegador:
- Páginas de produtos
- Carrinho de compras
- Formulários de cadastro
- Painel administrativo

**Tecnologia usada**: React (biblioteca JavaScript para criar interfaces)

### 2️⃣ **Backend** (O cérebro do sistema)
É o **servidor** que processa todas as requisições e regras de negócio:
- Valida se o usuário está logado
- Processa pagamentos
- Calcula preços e descontos
- Gerencia o estoque
- Envia e-mails

**Tecnologia usada**: Node.js + Express (servidor JavaScript)

### 3️⃣ **Banco de Dados** (A memória do sistema)
É onde ficam **armazenados todos os dados**:
- Produtos cadastrados
- Informações dos usuários
- Pedidos realizados
- Histórico de compras

**Tecnologia usada**: PostgreSQL (banco de dados relacional)

---

## 🛠️ Tecnologias Utilizadas (Explicadas)

### 🎨 Frontend (Interface Visual)

| Tecnologia | O que faz | Por que usamos |
|------------|-----------|----------------|
| **React** | Biblioteca para criar interfaces | Facilita criar páginas interativas e reutilizar componentes |
| **Vite** | Ferramenta de desenvolvimento | Deixa o projeto mais rápido durante o desenvolvimento |
| **React Router** | Gerenciador de páginas | Permite navegar entre páginas sem recarregar o site |
| **Axios** | Cliente HTTP | Facilita a comunicação entre frontend e backend |

### ⚙️ Backend (Servidor)

| Tecnologia | O que faz | Por que usamos |
|------------|-----------|----------------|
| **Node.js** | Ambiente JavaScript | Permite usar JavaScript no servidor (não só no navegador) |
| **Express** | Framework web | Simplifica a criação de APIs e rotas |
| **JWT** | Autenticação | Cria tokens seguros para login de usuários |
| **Bcrypt** | Criptografia | Protege senhas dos usuários |
| **CORS** | Segurança | Controla quem pode acessar a API |
| **dotenv** | Variáveis de ambiente | Gerencia configurações sensíveis (senhas, chaves) |
| **Swagger** | Documentação | Cria documentação automática da API |

### 💾 Banco de Dados

| Tecnologia | O que faz | Por que usamos |
|------------|-----------|----------------|
| **PostgreSQL** | Banco de dados | Armazena dados de forma organizada e segura |
| **pg** | Conector Node.js | Permite o Node.js se comunicar com o PostgreSQL |

---

## 📁 Estrutura do Projeto (Explicada)

```
site-expl/
│
├── 📂 frontend/                    
│   ├── 📂 ecommerce/              # Site da loja (onde clientes fazem compras)
│   │   └── [Em desenvolvimento]   
│   └── 📂 admin/                  # Painel administrativo (gerenciar loja)
│       └── [Em desenvolvimento]
│
├── 📂 backend/                    
│   ├── 📂 ecommerce/              # Servidor da loja (já estruturado!)
│   │   ├── 📂 src/                # Código-fonte principal
│   │   │   │
│   │   │   ├── 📂 config/         # Configurações gerais
│   │   │   │   └── database.js   # ✅ Conexão com PostgreSQL configurada
│   │   │   │
│   │   │   ├── 📂 middlewares/    # Interceptadores de requisições
│   │   │   │   └── error.middleware.js  # ✅ Tratamento de erros
│   │   │   │
│   │   │   ├── 📂 modules/        # Funcionalidades organizadas por módulo
│   │   │   │   ├── 📁 auth/       # Autenticação (login/registro)
│   │   │   │   ├── 📁 users/      # Gerenciamento de usuários
│   │   │   │   ├── 📁 products/   # Produtos do e-commerce
│   │   │   │   ├── 📁 cart/       # Carrinho de compras
│   │   │   │   ├── 📁 orders/     # Pedidos realizados
│   │   │   │   └── 📁 payments/   # Processamento de pagamentos
│   │   │   │
│   │   │   ├── 📂 docs/           # Documentação da API
│   │   │   │   └── [Aguardando Swagger]
│   │   │   │
│   │   │   └── 📄 server.js       # ✅ Servidor Express funcionando!
│   │   │
│   │   ├── 📄 package.json        # ✅ Dependências instaladas
│   │   └── 📄 .env               # Variáveis de ambiente (criar)
│   │
│   └── 📂 admin/                  # API administrativa
│       └── [Planejado]
│
├── 📂 database/                   # Scripts do banco de dados
│   └── [Aguardando schemas SQL]
│
├── 📂 docs/                       # Documentação adicional
│
├── 📄 .gitignore                 # ✅ Configurado
└── 📄 README.md                  # ✅ Este arquivo
```

### 🟢 Legenda de Status
- ✅ **Implementado e funcionando**
- 📁 **Estrutura criada, aguardando implementação**
- [Texto] **Status ou observação**

---

## 🚀 Como Rodar o Projeto (Passo a Passo)

### 📦 Pré-requisitos (Programas Necessários)

Antes de começar, você precisa instalar:

1. **Node.js** (versão 18 ou superior)
   - O que é: Ambiente que executa JavaScript fora do navegador
   - Download: https://nodejs.org/
   - Como verificar se está instalado: Abra o terminal e digite `node --version`

2. **PostgreSQL** (versão 12 ou superior)
   - O que é: Sistema de banco de dados onde os dados serão armazenados
   - Download: https://www.postgresql.org/download/
   - Como verificar: Digite `psql --version` no terminal

3. **Git**
   - O que é: Sistema de controle de versão para gerenciar o código
   - Download: https://git-scm.com/
   - Como verificar: Digite `git --version` no terminal

4. **Editor de Código** (recomendado)
   - Visual Studio Code: https://code.visualstudio.com/

---

## 🔧 Configuração do Backend (Passo a Passo)

### Passo 1: Clone o Repositório

```bash
git clone <url-do-repositorio>
cd site-expl
```

### Passo 2: Configure o Banco de Dados

1. **Abra o PostgreSQL** (pode usar pgAdmin ou terminal)

2. **Crie um banco de dados novo:**
   ```sql
   CREATE DATABASE explosion_ecommerce;
   ```

3. **Anote as credenciais:**
   - Nome do banco: `explosion_ecommerce`
   - Usuário: seu usuário PostgreSQL (geralmente `postgres`)
   - Senha: a senha que você definiu na instalação
   - Host: `localhost`
   - Porta: `5432` (padrão do PostgreSQL)

### Passo 3: Configure o Backend

1. **Entre na pasta do backend:**
   ```bash
   cd backend/ecommerce
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```
   
   **O que isso faz?** Baixa todas as bibliotecas necessárias listadas no `package.json`

3. **Crie o arquivo de configuração `.env`:**
   
   Na pasta `backend/ecommerce`, crie um arquivo chamado `.env` e adicione:

   ```env
   # Configurações do Servidor
   PORT=3000
   NODE_ENV=development

   # Configurações do Banco de Dados PostgreSQL
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=explosion_ecommerce
   DB_PASSWORD=sua_senha_aqui
   DB_PORT=5432

   # Configuração JWT (para autenticação)
   JWT_SECRET=coloque_uma_chave_secreta_aleatoria_aqui
   JWT_EXPIRES_IN=7d
   ```

   **⚠️ IMPORTANTE:** 
   - Substitua `sua_senha_aqui` pela senha real do PostgreSQL
   - Substitua `coloque_uma_chave_secreta_aleatoria_aqui` por uma string aleatória longa
   - **NUNCA** compartilhe este arquivo ou envie para o GitHub!

### Passo 4: Execute o Servidor

**Modo desenvolvimento** (recarrega automaticamente ao salvar arquivos):
```bash
npm run dev
```

**Modo produção** (apenas rodar):
```bash
npm start
```

### Passo 5: Teste se Está Funcionando

1. Abra seu navegador
2. Acesse: `http://localhost:3000`
3. Você deve ver a mensagem:
   ```json
   {
     "message": "Explosion API está funcionando!"
   }
   ```

✅ **Pronto! O backend está rodando!**

---

## 🎨 Configuração do Frontend (Aguardando)

O frontend ainda está em desenvolvimento. Esta seção será atualizada quando estiver pronto.

**Passos planejados:**
1. Instalar dependências do React
2. Configurar variáveis de ambiente (URL da API)
3. Executar servidor de desenvolvimento
4. Acessar no navegador

---

## 📚 Glossário (Termos Técnicos Explicados)

Aqui estão os principais termos usados no projeto, explicados de forma simples:

### Termos Gerais

| Termo | Significado |
|-------|-------------|
| **API** | Interface que permite diferentes sistemas conversarem entre si. No nosso caso, o frontend pede dados para o backend através da API |
| **Full Stack** | Desenvolvedor que trabalha tanto no frontend (visual) quanto no backend (servidor) |
| **Deploy** | Colocar o sistema no ar, disponível na internet |
| **Repository** | Local onde o código fica armazenado (GitHub) |
| **Commit** | Salvar alterações no código com uma mensagem descritiva |

### Frontend

| Termo | Significado |
|-------|-------------|
| **Component** | Pedaço reutilizável de interface (ex: botão, card de produto) |
| **State** | Estado/dados que podem mudar na tela |
| **Props** | Propriedades passadas de um componente para outro |
| **Routing** | Sistema de navegação entre páginas |

### Backend

| Termo | Significado |
|-------|-------------|
| **Endpoint** | URL específica da API (ex: `/api/products`) |
| **Middleware** | Função que intercepta requisições antes de chegar ao destino |
| **Controller** | Função que processa uma requisição específica |
| **Service** | Camada com regras de negócio |
| **Model** | Representação de uma tabela do banco de dados |
| **JWT** | Token de autenticação (prova de que você está logado) |
| **CORS** | Configuração que permite o frontend acessar o backend |

### Banco de Dados

| Termo | Significado |
|-------|-------------|
| **Schema** | Estrutura das tabelas (quais colunas existem) |
| **Migration** | Script que altera a estrutura do banco de dados |
| **Query** | Consulta para buscar dados |
| **Relational** | Banco que usa tabelas com relacionamentos entre elas |

### Comandos npm

| Comando | O que faz |
|---------|-----------|
| `npm install` | Instala todas as dependências do projeto |
| `npm start` | Inicia o servidor em modo produção |
| `npm run dev` | Inicia em modo desenvolvimento (recarrega automaticamente) |
| `npm test` | Executa testes automatizados |

---

## 📊 Status do Desenvolvimento

### ✅ Concluído

- [x] Estrutura base do projeto
- [x] Configuração do backend com Express
- [x] Conexão com PostgreSQL funcionando
- [x] Sistema de módulos organizado
- [x] Middleware de tratamento de erros
- [x] Configuração de variáveis de ambiente
- [x] Dependências instaladas (bcrypt, JWT, CORS, etc.)

### 🚧 Em Desenvolvimento

- [ ] **Módulo de Autenticação** (auth)
  - [ ] Registro de usuários
  - [ ] Login com JWT
  - [ ] Recuperação de senha
  
- [ ] **Módulo de Usuários** (users)
  - [ ] CRUD de usuários
  - [ ] Perfil do usuário
  - [ ] Endereços de entrega

- [ ] **Módulo de Produtos** (products)
  - [ ] Listagem de produtos
  - [ ] Detalhes do produto
  - [ ] Filtros e busca
  - [ ] Categorias

- [ ] **Módulo de Carrinho** (cart)
  - [ ] Adicionar ao carrinho
  - [ ] Atualizar quantidades
  - [ ] Remover itens

- [ ] **Módulo de Pedidos** (orders)
  - [ ] Criação de pedidos
  - [ ] Histórico de pedidos
  - [ ] Status do pedido

- [ ] **Módulo de Pagamentos** (payments)
  - [ ] Integração com gateway
  - [ ] Processamento de pagamentos

### 📋 Planejado

- [ ] Frontend E-commerce (React)
- [ ] Frontend Admin (React)
- [ ] Backend Admin (API separada)
- [ ] Documentação Swagger/OpenAPI
- [ ] Testes automatizados
- [ ] Deploy em produção
- [ ] Sistema de notificações por e-mail
- [ ] Painel de métricas e analytics

---

## 👥 Como Contribuir

Este é um projeto acadêmico colaborativo. Para contribuir:

### 1. Entenda o Fluxo de Trabalho Git

```bash
# 1. Atualize sua branch principal
git checkout main
git pull origin main

# 2. Crie uma nova branch para sua feature
git checkout -b feat/seu-nome/nome-da-funcionalidade

# 3. Faça suas alterações e commits
git add .
git commit -m "feat: descrição clara do que foi feito"

# 4. Envie para o GitHub
git push origin feat/seu-nome/nome-da-funcionalidade

# 5. Abra um Pull Request no GitHub
```

### 2. Padrões de Commit

Use prefixos claros nas mensagens de commit:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alteração em documentação
- `style:` - Formatação de código
- `refactor:` - Refatoração de código
- `test:` - Adição de testes
- `chore:` - Tarefas gerais

**Exemplos:**
```bash
git commit -m "feat: adiciona rota de login"
git commit -m "fix: corrige erro na validação de email"
git commit -m "docs: atualiza README com instruções"
```

### 3. Estrutura de Branches

- `main` - Código estável e aprovado
- `develop` - Código em desenvolvimento
- `feat/nome/funcionalidade` - Novas funcionalidades
- `fix/nome/correcao` - Correções de bugs
- `docs/nome/documentacao` - Alterações em documentação

### 4. Boas Práticas

✅ **Faça:**
- Teste seu código antes de enviar
- Escreva mensagens de commit claras
- Documente funções complexas
- Peça revisão de código (Code Review)
- Mantenha commits pequenos e focados

❌ **Evite:**
- Commitar código que não funciona
- Enviar senhas ou dados sensíveis
- Fazer commits gigantes com muitas mudanças
- Trabalhar direto na branch `main`

---

## 🆘 Problemas Comuns e Soluções

### Erro: "Cannot find module"

**Causa:** Dependências não instaladas  
**Solução:**
```bash
cd backend/ecommerce
npm install
```

### Erro: "Port 3000 is already in use"

**Causa:** Já existe algo rodando na porta 3000  
**Solução 1:** Mude a porta no arquivo `.env`:
```env
PORT=3001
```
**Solução 2:** Encerre o processo que está usando a porta

### Erro de Conexão com PostgreSQL

**Causa:** Credenciais erradas ou banco não rodando  
**Soluções:**
1. Verifique se o PostgreSQL está rodando
2. Confirme usuário e senha no arquivo `.env`
3. Certifique-se de que o banco `explosion_ecommerce` existe

### Git: "Your branch is behind"

**Causa:** Existem alterações no GitHub que você não tem localmente  
**Solução:**
```bash
git pull origin main
```

---

## 🔗 Links Úteis

### Documentação Oficial

- [Node.js](https://nodejs.org/docs)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Git](https://git-scm.com/doc)

### Tutoriais Recomendados

- [Curso de Git e GitHub](https://www.youtube.com/watch?v=UBAX-13g8OM)
- [Node.js para Iniciantes](https://www.youtube.com/watch?v=fm4_EuCsQwg)
- [React do Zero](https://react.dev/learn)
- [SQL e PostgreSQL](https://www.postgresql.org/docs/tutorial/)

### Ferramentas Úteis

- [Postman](https://www.postman.com/) - Testar APIs
- [pgAdmin](https://www.pgadmin.org/) - Interface visual para PostgreSQL
- [VS Code Extensions](https://marketplace.visualstudio.com/) - Extensões úteis

---

## 📝 Notas Importantes

### Segurança

⚠️ **NUNCA commit arquivos sensíveis:**
- `.env` (configurações e senhas)
- `node_modules/` (dependências)
- Logs com informações sensíveis
- Chaves de API ou tokens

Estes já estão no `.gitignore`, mas sempre verifique!

### Organização

- Mantenha o código limpo e comentado
- Siga a estrutura de pastas estabelecida
- Use nomes descritivos para variáveis e funções
- Teste suas alterações antes de commitar

### Comunicação

- Use Issues no GitHub para reportar bugs
- Discuta grandes mudanças antes de implementar
- Ajude colegas com dúvidas
- Documente decisões importantes

---

## 🎓 Aprendizados do Projeto

Trabalhando neste projeto, você aprenderá:

- ✅ Estruturar uma aplicação web completa
- ✅ Trabalhar com APIs RESTful
- ✅ Gerenciar banco de dados relacional
- ✅ Autenticação e autorização
- ✅ Trabalho em equipe com Git
- ✅ Boas práticas de programação
- ✅ Arquitetura de software
- ✅ Deploy e devops básico

---

## 📞 Contato e Suporte

Tendo dúvidas? Entre em contato com a equipe:

- **Issues**: Use a aba "Issues" do GitHub para reportar problemas
- **Discussões**: Use "Discussions" para tirar dúvidas gerais
- **Pull Requests**: Para contribuir com código

---

## 📄 Licença

Este é um projeto acadêmico desenvolvido para fins educacionais.

---

<p align="center">
  Desenvolvido com 💙 por estudantes de ADS
</p>

<p align="center">
  <strong>Explosion E-commerce</strong> - Do código ao carrinho! 🚀
</p>

```bash
cd frontend/ecommerce
npm install
npm run dev
```

### Frontend Admin *(Em desenvolvimento)*

```bash
cd frontend/admin
npm install
npm run dev
```

### Backend Admin *(Em desenvolvimento)*

```bash
cd backend/admin
npm install
npm run dev
```

---

## 👥 Equipe e Responsabilidades

### Frontend E-commerce
- **Italo Candido Gouveia**
- **Erick Matheus Gonçalves**

### Backend E-commerce
- **Wenderson José da Silva**
- **Emerson Cardoso Fialho**
- **Gabriel Moreira Freire**

### Frontend Gerencial
- **Eduardo do Prado**
- **Bruno Lucas dos Santos**

### Backend Gerencial
- **Túlio Henrique Santos Gonçalves**
- **Thiago Anthony Alves Pereira**
- **Rodrigo Pinheiro**

### Banco de Dados
- **Gabriel Haykonen Cortês**
- **Antonio Carlos Camargo Fernandes**

---

## 🌿 Workflow Git

Este projeto segue um fluxo de trabalho Git colaborativo. **Siga estas regras rigorosamente** para evitar conflitos e manter o histórico organizado.

### Branches Principais

- **`main`** - Código em produção (estável)
- **`develop`** - Código em desenvolvimento (integração)

### ⚠️ Regras Importantes

1. **NUNCA faça commit diretamente na `main` ou `develop`**
2. **SEMPRE trabalhe em branches de feature** (`feat/*`)
3. **NUNCA envie o arquivo `.env` para o GitHub**
4. Sempre atualize sua branch antes de começar a trabalhar
5. Faça commits descritivos e em português
6. Abra Pull Requests para integrar seu código

### Fluxo de Trabalho Passo a Passo

#### 1️⃣ Antes de Começar a Programar

Sempre atualize sua máquina com as últimas alterações da branch `develop`:

```bash
# Vá para a branch develop
git checkout develop

# Baixe as últimas alterações do repositório remoto
git pull upstream develop
```

> **Nota:** Se você não tem o remote `upstream` configurado, use `git pull origin develop`

#### 2️⃣ Criar uma Branch de Feature

Crie uma nova branch para a funcionalidade que você vai desenvolver:

```bash
# Crie e mude para uma nova branch de feature
git checkout -b feat/nome-da-sua-feature
```

**Exemplos de nomes de branches:**
- `feat/adicionar-login`
- `feat/criar-cadastro-produtos`
- `feat/implementar-carrinho`
- `feat/pagina-checkout`

#### 3️⃣ Durante o Desenvolvimento

Faça commits frequentes com mensagens claras:

```bash
# Veja quais arquivos foram modificados
git status

# Adicione os arquivos modificados
git add .

# Faça um commit com mensagem descritiva
git commit -m "feat: adiciona validação de email no formulário de login"
```

**Padrões de mensagens de commit:**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alterações na documentação
- `style:` - Formatação, ponto e vírgula, etc
- `refactor:` - Refatoração de código
- `test:` - Adição de testes

#### 4️⃣ Enviar Alterações para o GitHub

Quando terminar sua funcionalidade, envie para o repositório remoto:

```bash
# Envie sua branch para o GitHub
git push origin feat/nome-da-sua-feature
```

#### 5️⃣ Abrir Pull Request

1. Acesse o repositório no GitHub
2. Clique em "Compare & pull request"
3. **Importante:** Selecione `develop` como branch de destino (não `main`)
4. Descreva as alterações realizadas
5. Solicite revisão de um colega da equipe
6. Aguarde aprovação antes de fazer merge

---

## ⚙️ Variáveis de Ambiente

Cada aplicação pode precisar de variáveis de ambiente. Crie um arquivo `.env` na raiz de cada projeto (backend/frontend) seguindo o modelo `.env.example` (se disponível).

### ⚠️ Segurança

**NUNCA compartilhe ou commite arquivos `.env` no GitHub!**

O arquivo `.gitignore` já está configurado para ignorar arquivos `.env`, mas sempre confira antes de fazer commit.

---

## 📚 Documentação da API

A documentação completa da API do backend e-commerce pode ser acessada através do Swagger:

- URL: `http://localhost:3000/api-docs` (quando o servidor estiver rodando)

---

## 🤝 Como Contribuir

1. Certifique-se de estar na branch `develop` atualizada
2. Crie uma branch de feature (`feat/sua-feature`)
3. Implemente suas alterações
4. Teste localmente
5. Faça commit seguindo os padrões
6. Envie para o GitHub (`git push origin feat/sua-feature`)
7. Abra um Pull Request para `develop`
8. Aguarde a revisão do código
9. Após aprovação, faça o merge

---

## 📝 Notas Adicionais

- Mantenha seu código limpo e bem documentado
- Siga os padrões de código da equipe
- Participe das revisões de código dos colegas
- Tire dúvidas no grupo antes de fazer alterações grandes
- Sempre teste suas alterações antes de fazer commit

---

## 📄 Licença

Este é um projeto acadêmico desenvolvido para fins educacionais.

---

**Desenvolvido com 💥 pela equipe Explosion**
