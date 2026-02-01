const { getDatabase } = require('../config/database');

class TransactionService {
  constructor() {
    this.db = getDatabase();
  }

  /**
   * Buscar todas as transações com filtros opcionais
   * @param {Object} filters - { type, category_id, startDate, endDate }
   */
  getAll(filters = {}) {
    let query = `
      SELECT 
        t.id,
        t.type,
        t.amount,
        t.category_id,
        c.name as category_name,
        t.date,
        t.description,
        t.created_at
      FROM transactions t
      INNER JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    
    const params = [];

    if (filters.type) {
      query += ` AND t.type = ?`;
      params.push(filters.type);
    }

    if (filters.category_id) {
      query += ` AND t.category_id = ?`;
      params.push(filters.category_id);
    }

    if (filters.startDate) {
      query += ` AND t.date >= ?`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ` AND t.date <= ?`;
      params.push(filters.endDate);
    }

    query += ` ORDER BY t.date DESC, t.id DESC`;

    return this.db.prepare(query).all(...params);
  }

  /**
   * Buscar transação por ID
   */
  getById(id) {
    return this.db.prepare(`
      SELECT 
        t.id,
        t.type,
        t.amount,
        t.category_id,
        c.name as category_name,
        t.date,
        t.description,
        t.created_at
      FROM transactions t
      INNER JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(id);
  }

  /**
   * Criar nova transação
   */
  create(data) {
    const { type, amount, category_id, date, description } = data;
    
    const stmt = this.db.prepare(`
      INSERT INTO transactions (type, amount, category_id, date, description)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(type, amount, category_id, date, description || null);
    
    return this.getById(result.lastInsertRowid);
  }

  /**
   * Atualizar transação existente
   */
  update(id, data) {
    const { type, amount, category_id, date, description } = data;
    
    const stmt = this.db.prepare(`
      UPDATE transactions 
      SET type = ?,
          amount = ?,
          category_id = ?,
          date = ?,
          description = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(type, amount, category_id, date, description || null, id);
    
    if (result.changes === 0) {
      return null;
    }
    
    return this.getById(id);
  }

  /**
   * Deletar transação
   */
  delete(id) {
    const stmt = this.db.prepare('DELETE FROM transactions WHERE id = ?');
    const result = stmt.run(id);
    
    return result.changes > 0;
  }

  /**
   * Obter estatísticas gerais
   */
  getStats(filters = {}) {
    let query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance,
        COUNT(*) as transaction_count
      FROM transactions
      WHERE 1=1
    `;
    
    const params = [];

    if (filters.startDate) {
      query += ` AND date >= ?`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ` AND date <= ?`;
      params.push(filters.endDate);
    }

    return this.db.prepare(query).get(...params);
  }
}

module.exports = new TransactionService();
