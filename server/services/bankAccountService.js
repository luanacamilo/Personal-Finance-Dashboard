const { getDatabase } = require('../config/database');

class BankAccountService {
  getAll() {
    const db = getDatabase();
    return (db.data.bank_accounts || []).filter(a => a.is_active === 1);
  }

  getById(id) {
    const db = getDatabase();
    const account = (db.data.bank_accounts || []).find(a => a.id === parseInt(id) && a.is_active === 1);
    return account || null;
  }

  getTotalBalance() {
    const accounts = this.getAll();
    return accounts.reduce((sum, a) => sum + (a.current_balance || 0), 0);
  }

  create(data) {
    const db = getDatabase();
    const { name, account_type, initial_balance } = data;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Account name is required');
    }

    if (!account_type || !['checking', 'savings', 'investment', 'other'].includes(account_type)) {
      throw new Error('Invalid account type');
    }

    const balance = parseFloat(initial_balance) || 0;
    if (balance < 0) {
      throw new Error('Initial balance cannot be negative');
    }

    if (!db.data.bank_accounts) {
      db.data.bank_accounts = [];
    }

    const now = new Date().toISOString();
    const newAccount = {
      id: Math.max(0, ...db.data.bank_accounts.map(a => a.id)) + 1,
      name: name.trim(),
      account_type,
      initial_balance: balance,
      current_balance: balance,
      is_active: 1,
      created_at: now,
      updated_at: now
    };

    db.data.bank_accounts.push(newAccount);
    db.saveData();
    return newAccount;
  }

  update(id, data) {
    const db = getDatabase();
    const { name, account_type, current_balance } = data;

    const index = (db.data.bank_accounts || []).findIndex(a => a.id === parseInt(id));
    if (index === -1) return null;

    const now = new Date().toISOString();
    db.data.bank_accounts[index] = {
      ...db.data.bank_accounts[index],
      name: name || db.data.bank_accounts[index].name,
      account_type: account_type || db.data.bank_accounts[index].account_type,
      current_balance: current_balance !== undefined ? current_balance : db.data.bank_accounts[index].current_balance,
      updated_at: now
    };

    db.saveData();
    return db.data.bank_accounts[index];
  }

  deactivate(id) {
    const db = getDatabase();
    const index = (db.data.bank_accounts || []).findIndex(a => a.id === parseInt(id));
    if (index === -1) return null;

    const now = new Date().toISOString();
    db.data.bank_accounts[index] = {
      ...db.data.bank_accounts[index],
      is_active: 0,
      updated_at: now
    };

    db.saveData();
    return db.data.bank_accounts[index];
  }

  delete(id) {
    const db = getDatabase();
    const index = (db.data.bank_accounts || []).findIndex(a => a.id === parseInt(id));
    if (index === -1) return false;

    db.data.bank_accounts.splice(index, 1);
    db.saveData();
    return true;
  }

  updateBalance(id, amount) {
    const db = getDatabase();
    const index = (db.data.bank_accounts || []).findIndex(a => a.id === parseInt(id));
    if (index === -1) return null;

    const now = new Date().toISOString();
    db.data.bank_accounts[index] = {
      ...db.data.bank_accounts[index],
      current_balance: parseFloat(amount),
      updated_at: now
    };

    db.saveData();
    return db.data.bank_accounts[index];
  }

  syncBalance(accountId) {
    const account = this.getById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    // For now, just return the account as is
    return account;
  }
}

module.exports = new BankAccountService();
