# 🚀 Deploy no Vercel - Gerenciador de Rifa

## 📋 **Passos para Deploy:**

### **1. Preparar o Projeto:**
```bash
# Instalar dependências
npm install

# Testar localmente
npm start
```

### **2. Criar Conta no Vercel:**
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. Conecte com GitHub (recomendado)

### **3. Fazer Deploy:**
1. **Opção A - Via GitHub:**
   - Faça push do código para GitHub
   - Conecte o repositório no Vercel
   - Deploy automático!

2. **Opção B - Via CLI:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

3. **Opção C - Via Interface:**
   - Arraste a pasta do projeto no Vercel
   - Deploy instantâneo!

### **4. Configurações do Vercel:**
- **Framework Preset:** Create React App
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

## 🔧 **Funcionalidades Implementadas:**

### **✅ Armazenamento de Dados:**
- **API Routes:** `/api/data` para gerenciar dados
- **Backup Local:** Download/Upload de arquivos JSON
- **Persistência:** Dados salvos automaticamente
- **Reset:** Limpeza completa dos dados

### **✅ Recursos Avançados:**
- **Indicador de Conexão:** Online/Offline
- **Backup Automático:** Arquivos JSON
- **Exportação CSV:** Relatórios completos
- **Interface Responsiva:** Mobile e Desktop

## 🌐 **URLs após Deploy:**

- **Produção:** `https://seu-projeto.vercel.app`
- **API:** `https://seu-projeto.vercel.app/api/data`

## 📱 **Como Usar:**

1. **Acesse a URL** do seu projeto
2. **Login:** Senha `admin123`
3. **Gerencie a rifa** normalmente
4. **Dados salvos** automaticamente no Vercel

## 🔄 **Sincronização:**

- **Dados compartilhados** entre todos os usuários
- **Mudanças em tempo real** (quando online)
- **Backup local** sempre disponível
- **Modo offline** com sincronização posterior

## 🛠️ **Personalização:**

### **Alterar Configurações:**
Edite em `src/AppVercel.js`:
```javascript
const [rifaConfig, setRifaConfig] = useState({
  totalNumbers: 300,        // Total de números
  rifaTitle: 'Sua Rifa',   // Título
  prizeDescription: 'Prêmio: R$ 5.000,00',
  numberPrice: 5.00        // Preço por número
});
```

### **Alterar Senha:**
Edite em `src/AppVercel.js`:
```javascript
if (password === 'sua_nova_senha') {
```

## 🚨 **Importante:**

- **Dados são compartilhados** entre todos os usuários
- **Backup regular** recomendado
- **Senha forte** para produção
- **HTTPS** incluído automaticamente

## 📞 **Suporte:**

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **React Docs:** [reactjs.org](https://reactjs.org)
- **Problemas:** Verifique console do navegador (F12)

---

**🎉 Pronto! Sua rifa está online e funcionando!**
