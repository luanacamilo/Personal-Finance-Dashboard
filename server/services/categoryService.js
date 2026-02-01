const { getDatabase } = require('../config/database');

class CategoryService {
  constructor() {
    this.db = getDatabase();
  }

  getAll() {
    return this.db.prepare(`
      SELECT id, name, created_at
      FROM categories
      ORDER BY name
    `).all();
  }

  getById(id) {
    return this.db.prepare(`
      SELECT id, name, created_at
      FROM categories
      WHERE id = ?
    `).get(id);
  }
}

module.exports = new CategoryService();
