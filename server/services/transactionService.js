const { getDatabase } = require('../config/database');

class TransactionService {
  getAll(filters = {}) {
    const db = getDatabase();
    let transactions = db.data.transactions || [];
    
    if (filters.type) {
      transactions = transactions.filter(t => t.type === filters.type);
    }

    if (filters.category_id) {
      transactions = transactions.filter(t => t.category_id === parseInt(filters.category_id));
    }

    if (filters.startDate) {
      transactions = transactions.filter(t => new Date(t.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      transactions = transactions.filter(t => new Date(t.date) <= new Date(filters.endDate));
    }

    // Join with categories
    transactions = transactions.map(t => {
      const category = (db.data.categories || []).find(c => c.id === t.category_id);
      return {
        ...t,
        category_name: category ? category.name : 'Unknown'
      };
    });

    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getById(id) {
    const db = getDatabase();
    const transaction = (db.data.transactions || []).find(t => t.id === parseInt(id));
    if (transaction) {
      const category = (db.data.categories || []).find(c => c.id === transaction.category_id);
      return {
        ...transaction,
        category_name: category ? category.name : 'Unknown'
      };
    }
    return null;
  }

  create(data) {
    const db = getDatabase();
    const { type, amount, category_id, date, description } = data;
    
    if (!type || !['income', 'expense'].includes(type)) {
      throw new Error('Type must be income or expense');
    }
    if (!amount || amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (!category_id) {
      throw new Error('Category is required');
    }
    if (!date) {
      throw new Error('Date is required');
    }

    if (!db.data.transactions) {
      db.data.transactions = [];
    }

    const now = new Date().toISOString();
    const newTransaction = {
      id: Math.max(0, ...db.data.transactions.map(t => t.id)) + 1,
      type,
      amount: parseFloat(amount),
      category_id: parseInt(category_id),
      date,
      description: description || null,
      created_at: now,
      updated_at: now
    };

    db.data.transactions.push(newTransaction);
    db.saveData();

    return this.getById(newTransaction.id);
  }

  update(id, data) {
    const db = getDatabase();
    const { type, amount, category_id, date, description } = data;
    
    const index = (db.data.transactions || []).findIndex(t => t.id === parseInt(id));
    if (index === -1) return null;

    const now = new Date().toISOString();
    db.data.transactions[index] = {
      ...db.data.transactions[index],
      type: type || db.data.transactions[index].type,
      amount: amount ? parseFloat(amount) : db.data.transactions[index].amount,
      category_id: category_id ? parseInt(category_id) : db.data.transactions[index].category_id,
      date: date || db.data.transactions[index].date,
      description: description !== undefined ? description : db.data.transactions[index].description,
      updated_at: now
    };

    db.saveData();
    return this.getById(id);
  }

  delete(id) {
    const db = getDatabase();
    const index = (db.data.transactions || []).findIndex(t => t.id === parseInt(id));
    if (index === -1) return false;

    db.data.transactions.splice(index, 1);
    db.saveData();
    return true;
  }

  getStats(filters = {}) {
    const transactions = this.getAll(filters);
    
    const total_income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const total_expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      total_income,
      total_expense,
      balance: total_income - total_expense,
      transaction_count: transactions.length
    };
  }
}

module.exports = new TransactionService();
