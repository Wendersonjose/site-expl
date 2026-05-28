# 💥 Explosion E-commerce

> Plataforma de e-commerce full stack desenvolvida como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas.

## 📋 Sobre o Projeto

O **Explosion** nasceu como um site institucional simples desenvolvido em HTML, CSS e JavaScript, mas foi completamente remodelado para se tornar uma **plataforma completa de e-commerce** com área de gerenciamento administrativo.

### Objetivos

- Desenvolver uma aplicação web full stack moderna
- Praticar trabalho colaborativo usando Git e GitHub
- Aplicar conceitos de desenvolvimento frontend e backend
- Implementar boas práticas de arquitetura de software
- Gerenciar banco de dados relacional (PostgreSQL)

### Divisão do Sistema

O projeto está dividido em **duas áreas principais**:

#### 🛒 E-commerce (Área Pública)
Área voltada para os clientes finais, onde os usuários podem:
- Navegar pelo catálogo de produtos
- Visualizar detalhes dos produtos
- Adicionar itens ao carrinho
- Realizar compras (em desenvolvimento)
- Gerenciar perfil e pedidos

#### 🔧 Gerencial (Área Administrativa)
Painel administrativo para gestão da loja, onde administradores podem:
- Gerenciar produtos (cadastro, edição, remoção)
- Controlar estoque
- Visualizar pedidos
- Gerenciar usuários e permissões
- Acompanhar métricas de vendas

---

## 🛠️ Stack Tecnológica

### Frontend
- **React** - Biblioteca para construção de interfaces
- **Vite** - Build tool e dev server
- **JavaScript** - Linguagem de programação
- **React Router DOM** - Gerenciamento de rotas
- **Axios** - Cliente HTTP para requisições

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web minimalista
- **JavaScript ES Modules** - Sistema de módulos moderno
- **Swagger/OpenAPI** - Documentação da API

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional

---

## 📁 Estrutura do Repositório

```
site-expl/
├── frontend/                    # Aplicações frontend
│   ├── ecommerce/              # Interface do e-commerce (clientes)
│   └── admin/                  # Interface administrativa (gerencial)
│
├── backend/                     # APIs e serviços backend
│   ├── ecommerce/              # API do e-commerce
│   │   ├── src/
│   │   │   ├── config/         # Configurações (DB, variáveis de ambiente)
│   │   │   ├── controllers/    # Controladores (lógica de requisições)
│   │   │   ├── docs/           # Documentação Swagger/OpenAPI
│   │   │   ├── middlewares/    # Middlewares (autenticação, validação)
│   │   │   ├── models/         # Modelos de dados
│   │   │   ├── modules/        # Módulos auxiliares
│   │   │   ├── routes/         # Definição de rotas da API
│   │   │   ├── services/       # Regras de negócio
│   │   │   └── server.js       # Arquivo principal do servidor
│   │   ├── package.json
│   │   └── package-lock.json
│   └── admin/                  # API gerencial (em desenvolvimento)
│
├── database/                    # Scripts SQL e migrations
├── docs/                        # Documentação adicional do projeto
├── .gitignore                  # Arquivos ignorados pelo Git
└── README.md                   # Este arquivo
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** (gerenciador de pacotes)
- **PostgreSQL** (banco de dados)
- **Git** (controle de versão)

### Backend E-commerce

O backend do e-commerce já está funcional e pode ser executado seguindo os passos abaixo:

1. **Navegue até a pasta do backend:**
   ```bash
   cd backend/ecommerce
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na pasta `backend/ecommerce`
   - Configure as variáveis necessárias (DB, porta, etc.)
   - **⚠️ IMPORTANTE:** Nunca envie o arquivo `.env` para o GitHub!

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse o servidor:**
   - URL padrão: `http://localhost:3000`
   - Rota inicial: `GET /`

### Frontend E-commerce *(Em desenvolvimento)*

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
