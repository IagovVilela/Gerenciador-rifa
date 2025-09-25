# 🗄️ Configurar Armazenamento Real no Vercel

## ⚠️ **IMPORTANTE:**
Sem configuração de armazenamento, os dados **NÃO são compartilhados** entre usuários!

## 🚀 **Opção 1: Vercel KV (Recomendado)**

### **Passo 1: Criar Database KV**
1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Vá em **"Storage"** → **"Create Database"**
3. Escolha **"KV"** (Redis)
4. Nome: `rifa-database`
5. Região: `São Paulo` (mais próxima)

### **Passo 2: Configurar Variáveis**
1. No projeto Vercel, vá em **"Settings"** → **"Environment Variables"**
2. Adicione as variáveis que aparecem no KV:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### **Passo 3: Deploy**
```bash
vercel --prod
```

## 🆓 **Opção 2: Supabase (Gratuito)**

### **Passo 1: Criar Conta Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Clique **"Start your project"**
3. Conecte com GitHub
4. Clique **"New Project"**

### **Passo 2: Configurar Database**
1. Nome: `rifa-database`
2. Senha: (anote bem!)
3. Região: `South America (São Paulo)`
4. Clique **"Create new project"**

### **Passo 3: Criar Tabela**
1. Vá em **"SQL Editor"**
2. Execute este código:
```sql
CREATE TABLE rifa_data (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) UNIQUE,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir dados iniciais
INSERT INTO rifa_data (type, data) VALUES 
('config', '{"totalNumbers": 300, "rifaTitle": "Grande Rifa Beneficente", "prizeDescription": "Prêmio Principal: R$ 5.000,00", "numberPrice": 5.00}'),
('reservations', '{}');
```

### **Passo 4: Obter Credenciais**
1. Vá em **"Settings"** → **"API"**
2. Copie:
   - **Project URL**
   - **anon public** key

### **Passo 5: Configurar Vercel**
1. No projeto Vercel, vá em **"Settings"** → **"Environment Variables"**
2. Adicione:
   - `SUPABASE_URL` = Project URL
   - `SUPABASE_ANON_KEY` = anon public key

### **Passo 6: Trocar API**
Renomeie os arquivos:
```bash
# Trocar para usar Supabase
mv api/data.js api/data-backup.js
mv api/data-supabase.js api/data.js
```

## ✅ **Como Funciona Após Configuração:**

### **Com Armazenamento Real:**
- ✅ **Dados compartilhados** entre todos os usuários
- ✅ **Mudanças em tempo real** para todos
- ✅ **Persistência** - dados não se perdem
- ✅ **Backup automático** no banco

### **Sem Armazenamento:**
- ❌ Cada usuário vê apenas seus dados
- ❌ Dados não são compartilhados
- ❌ Perda de dados ao recarregar

## 🧪 **Testar Compartilhamento:**

1. **Abra em 2 navegadores** diferentes
2. **Faça login** em ambos
3. **Crie uma reserva** em um navegador
4. **Recarregue** o outro navegador
5. **Veja a reserva** aparecer automaticamente!

## 💰 **Custos:**

### **Vercel KV:**
- ✅ **Gratuito** até 30MB
- ✅ **$0.20/GB** após limite
- ✅ **Ideal** para rifas

### **Supabase:**
- ✅ **Gratuito** até 500MB
- ✅ **$25/mês** após limite
- ✅ **Mais recursos** disponíveis

## 🚨 **Importante:**

- **Configure ANTES** de fazer deploy
- **Teste localmente** primeiro
- **Backup regular** recomendado
- **Monitore uso** do banco

---

**🎯 Com armazenamento configurado, todos os usuários verão as mesmas mudanças!**
