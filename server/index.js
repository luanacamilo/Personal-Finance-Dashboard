const express = require('express');
const cors = require('cors');
const { getDatabase } = require('./config/database');

// Import routes
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar banco de dados
const db = getDatabase();

// API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/user', userProfileRoutes);

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando! 🚀',
    database: 'SQLite conectado',
    timestamp: new Date().toISOString()
  });
});

// Rota para verificar tabelas do banco de dados
app.get('/api/tables', (req, res) => {
  try {
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `).all();
    
    res.json({ 
      success: true,
      tables: tables.map(t => t.name)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`📋 Transactions: http://localhost:${PORT}/api/transactions`);
});

// Fechar banco de dados ao encerrar
process.on('SIGINT', () => {
  db.close();
  console.log('\n👋 Servidor encerrado');
  process.exit(0);
});
