const { getDatabase } = require('../config/database');

class RecurringTransactionService {
  getAll(filters = {}) {
    const db = getDatabase();
    let transactions = db.data.recurring_transactions || [];

    if (filters.is_active !== undefined) {
      transactions = transactions.filter(t => t.is_active === (filters.is_active ? 1 : 0));
    }

    if (filters.type) {
      transactions = transactions.filter(t => t.type === filters.type);
    }

    if (filters.frequency) {
      transactions = transactions.filter(t => t.frequency === filters.frequency);
    }

    transactions = transactions.map(t => {
      const category = (db.data.categories || []).find(c => c.id === t.category_id);
      const account = (db.data.bank_accounts || []).find(a => a.id === t.bank_account_id);
      return {
        ...t,
        category_name: category ? category.name : 'Unknown',
        bank_account_name: account ? account.name : 'Unknown'
      };
    });

    return transactions.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  }

  getById(id) {
    const db = getDatabase();
    const transaction = (db.data.recurring_transactions || []).find(t => t.id === parseInt(id));
    if (transaction) {
      const category = (db.data.categories || []).find(c => c.id === transaction.category_id);
      const account = (db.data.bank_accounts || []).find(a => a.id === transaction.bank_account_id);
      return {
        ...transaction,
        category_name: category ? category.name : 'Unknown',
        bank_account_name: account ? account.name : 'Unknown'
      };
    }
    return null;
  }

  create(data) {
    const db = getDatabase();
    const { type, description, amount, category_id, frequency, start_date, end_date, day_of_month, bank_account_id } = data;

    if (!type || !['income', 'expense'].includes(type)) {
      throw new Error('Invalid type. Must be "income" or "expense"');
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      throw new Error('Description is required');
    }

    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (!category_id) {
      throw new Error('Category ID is required');
    }

    if (!frequency || !['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'].includes(frequency)) {
      throw new Error('Invalid frequency');
    }

    if (!start_date) {
      throw new Error('Start date is required');
    }

    if (!db.data.recurring_transactions) {
      db.data.recurring_transactions = [];
    }

    const now = new Date().toISOString();
    const newTransaction = {
      id: Math.max(0, ...db.data.recurring_transactions.map(t => t.id)) + 1,
      type,
      description: description.trim(),
      amount: parseFloat(amount),
      category_id: parseInt(category_id),
      frequency,
      start_date,
      end_date: end_date || null,
      day_of_month: day_of_month || null,
      bank_account_id: bank_account_id || null,
      is_active: 1,
      created_at: now,
      updated_at: now
    };

    db.data.recurring_transactions.push(newTransaction);
    db.saveData();

    return this.getById(newTransaction.id);
  }

  update(id, data) {
    const db = getDatabase();
    const { type, description, amount, category_id, frequency, start_date, end_date, day_of_month, bank_account_id, is_active } = data;

    const index = (db.data.recurring_transactions || []).findIndex(t => t.id === parseInt(id));
    if (index === -1) return null;

    const now = new Date().toISOString();
    db.data.recurring_transactions[index] = {
      ...db.data.recurring_transactions[index],
      type: type || db.data.recurring_transactions[index].type,
      description: description ? description.trim() : db.data.recurring_transactions[index].description,
      amount: amount ? parseFloat(amount) : db.data.recurring_transactions[index].amount,
      category_id: category_id ? parseInt(category_id) : db.data.recurring_transactions[index].category_id,
      frequency: frequency || db.data.recurring_transactions[index].frequency,
      start_date: start_date || db.data.recurring_transactions[index].start_date,
      end_date: end_date !== undefined ? end_date : db.data.recurring_transactions[index].end_date,
      day_of_month: day_of_month !== undefined ? day_of_month : db.data.recurring_transactions[index].day_of_month,
      bank_account_id: bank_account_id !== undefined ? bank_account_id : db.data.recurring_transactions[index].bank_account_id,
      is_active: is_active !== undefined ? (is_active ? 1 : 0) : db.data.recurring_transactions[index].is_active,
      updated_at: now
    };

    db.saveData();
    return this.getById(id);
  }

  deactivate(id) {
    const db = getDatabase();
    const index = (db.data.recurring_transactions || []).findIndex(t => t.id === parseInt(id));
    if (index === -1) return null;

    const now = new Date().toISOString();
    db.data.recurring_transactions[index] = {
      ...db.data.recurring_transactions[index],
      is_active: 0,
      updated_at: now
    };

    db.saveData();
    return this.getById(id);
  }

  delete(id) {
    const db = getDatabase();
    const index = (db.data.recurring_transactions || []).findIndex(t => t.id === parseInt(id));
    if (index === -1) return false;

    db.data.recurring_transactions.splice(index, 1);
    db.saveData();
    return true;
  }

  getActive() {
    return this.getAll({ is_active: true });
  }

  getMonthlyIncome() {
    const transactions = this.getActive().filter(t => t.type === 'income');
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  getMonthlyExpense() {
    const transactions = this.getActive().filter(t => t.type === 'expense');
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  getSummary() {
    const income = this.getMonthlyIncome();
    const expense = this.getMonthlyExpense();

    return {
      monthly_income: income,
      monthly_expense: expense,
      monthly_balance: income - expense,
      total_recurring: this.getActive().length
    };
  }
}

module.exports = new RecurringTransactionService();
