const express = require('express');
const cors = require('cors');
const { getDatabase } = require('./config/database');

const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = getDatabase();

app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/user', userProfileRoutes);

app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando! 🚀',
    database: 'SQLite conectado',
    timestamp: new Date().toISOString()
  });
});

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

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` API: http://localhost:${PORT}/api`);
  console.log(` Transactions: http://localhost:${PORT}/api/transactions`);
});

process.on('SIGINT', () => {
  db.close();
  console.log('\n Servidor encerrado');
  process.exit(0);
});
