const fs = require('fs');
const path = require('path');

let db = null;

class MockDatabase {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.data = {};
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.dbPath + '.json')) {
        const content = fs.readFileSync(this.dbPath + '.json', 'utf8');
        this.data = JSON.parse(content);
      } else {
        this.initializeData();
      }
    } catch (error) {
      console.error('Error loading database:', error);
      this.initializeData();
    }
  }

  saveData() {
    try {
      fs.writeFileSync(this.dbPath + '.json', JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  initializeData() {
    this.data = {
      users: [],
      categories: [
        { id: 1, name: 'Salary', created_at: new Date().toISOString() },
        { id: 2, name: 'Freelance', created_at: new Date().toISOString() },
        { id: 3, name: 'Investments', created_at: new Date().toISOString() },
        { id: 4, name: 'Food', created_at: new Date().toISOString() },
        { id: 5, name: 'Transport', created_at: new Date().toISOString() },
        { id: 6, name: 'Housing', created_at: new Date().toISOString() },
        { id: 7, name: 'Entertainment', created_at: new Date().toISOString() },
        { id: 8, name: 'Health', created_at: new Date().toISOString() },
        { id: 9, name: 'Education', created_at: new Date().toISOString() },
        { id: 10, name: 'Others', created_at: new Date().toISOString() },
      ],
      transactions: [],
      bank_accounts: [
        { id: 1, name: 'Checking Account', account_type: 'checking', initial_balance: 5000, current_balance: 5000, is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: 'Savings', account_type: 'savings', initial_balance: 10000, current_balance: 10000, is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, name: 'Investments', account_type: 'investment', initial_balance: 20000, current_balance: 20000, is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ],
      recurring_transactions: [
        { id: 1, type: 'income', description: 'Salary', amount: 5000, category_id: 1, bank_account_id: 1, frequency: 'monthly', start_date: '2026-02-05', end_date: null, day_of_month: 5, is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, type: 'expense', description: 'Rent', amount: 1200, category_id: 6, bank_account_id: 1, frequency: 'monthly', start_date: '2026-02-01', end_date: null, day_of_month: 1, is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, type: 'expense', description: 'Internet', amount: 120, category_id: 10, bank_account_id: 1, frequency: 'monthly', start_date: '2026-02-10', end_date: null, day_of_month: 10, is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ],
    };
    this.saveData();
  }

  prepare(sql) {
    const self = this;
    return {
      run(...params) {
        return { lastInsertRowid: 0, changes: 0 };
      },
      get(...params) {
        return null;
      },
      all(...params) {
        return [];
      }
    };
  }

  pragma() {
    return null;
  }
}

function getDatabase() {
  if (!db) {
    const dbPath = path.join(__dirname, '../../database/database.db');
    db = new MockDatabase(dbPath);
    console.log('✅ Mock Database initialized:', dbPath + '.json');
  }
  return db;
}

module.exports = { getDatabase };
