// Servidor simples para compartilhar dados da rifa
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Arquivo para armazenar dados
const DATA_FILE = path.join(__dirname, 'rifa-data.json');

// Função para ler dados
const readData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    return { reservations: {}, config: {} };
  } catch (error) {
    console.error('Erro ao ler dados:', error);
    return { reservations: {}, config: {} };
  }
};

// Função para salvar dados
const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
};

// Rotas da API

// GET - Buscar todas as reservas
app.get('/api/reservations', (req, res) => {
  const data = readData();
  res.json(data.reservations || {});
});

// POST - Salvar reservas
app.post('/api/reservations', (req, res) => {
  const { reservations } = req.body;
  const data = readData();
  data.reservations = reservations;
  saveData(data);
  res.json({ success: true });
});

// GET - Buscar configuração
app.get('/api/config', (req, res) => {
  const data = readData();
  res.json(data.config || {});
});

// POST - Salvar configuração
app.post('/api/config', (req, res) => {
  const { config } = req.body;
  const data = readData();
  data.config = config;
  saveData(data);
  res.json({ success: true });
});

// DELETE - Reset completo
app.delete('/api/reset', (req, res) => {
  const data = { reservations: {}, config: {} };
  saveData(data);
  res.json({ success: true });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log('  GET  /api/reservations - Buscar reservas');
  console.log('  POST /api/reservations - Salvar reservas');
  console.log('  GET  /api/config - Buscar configuração');
  console.log('  POST /api/config - Salvar configuração');
  console.log('  DELETE /api/reset - Reset completo');
});
