# 🔐 Gerenciamento de Usuários Admin

## ⚠️ Importante

O sistema **NÃO** permite criar usuários admin através do endpoint de registro (`POST /auth/register`). Por questões de segurança, esse endpoint cria apenas usuários com perfil **cliente**.

Usuários **admin** precisam ser criados manualmente através do script fornecido.

---

## 📝 Como criar um usuário admin

### Método 1: Usando o script interativo (Recomendado)

Execute o comando:

```bash
npm run create-admin
```

O script irá solicitar:
- Nome completo
- E-mail
- Senha

A senha será automaticamente hasheada antes de ser salva no banco de dados.

### Método 2: Inserção direta no banco (SQL)

Se preferir, você pode inserir diretamente no banco usando SQL.

**⚠️ Atenção:** A senha precisa estar em formato bcrypt hash.

#### Gerar hash da senha:

Execute no terminal Node.js:

```javascript
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash('sua_senha_aqui', 10);
console.log(hash);
```

#### Inserir no banco:

```sql
INSERT INTO usuarios (nome, email, senha, perfil) 
VALUES ('Admin', 'admin@explosion.com', '$2b$10$...hash_gerado...', 'admin');
```

---

## 🔑 Credenciais Sugeridas (Desenvolvimento)

Para ambiente de **desenvolvimento local**, você pode criar:

```
E-mail: admin@explosion.com
Senha: admin123
Perfil: admin
```

**⚠️ ATENÇÃO:** Em produção, use senhas fortes e complexas!

---

## ✅ Verificar se admin existe

Execute no MySQL/Railway:

```sql
SELECT id_usuario, nome, email, perfil, data_criacao 
FROM usuarios 
WHERE perfil = 'admin';
```

---

## 🔐 Login com admin

Depois de criar o admin, faça login através da API:

```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@explosion.com",
  "senha": "admin123"
}
```

Resposta:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "nome": "Admin",
      "email": "admin@explosion.com",
      "perfil": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Use o **token** retornado no header `Authorization: Bearer <token>` para acessar rotas protegidas.
