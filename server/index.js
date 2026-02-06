const express = require('express');
const cors = require('cors');
const { getDatabase } = require('./config/database');

const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const bankAccountRoutes = require('./routes/bankAccountRoutes');
const recurringTransactionRoutes = require('./routes/recurringTransactionRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = getDatabase();

app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/user', userProfileRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);
app.use('/api/recurring-transactions', recurringTransactionRoutes);

app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando! 🚀',
    database: 'SQLite conectado',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/tables', (req, res) => {
  try {
    const tables = Object.keys(db.data);
    
    res.json({ 
      success: true,
      tables: tables
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
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});

process.on('SIGINT', () => {
  console.log('\n✋ Server stopped');
  process.exit(0);
});
