const { getDatabase } = require('../config/database');

class CategoryService {
  getAll() {
    const db = getDatabase();
    return db.data.categories || [];
  }

  getById(id) {
    const db = getDatabase();
    return (db.data.categories || []).find(c => c.id === parseInt(id));
  }
}

module.exports = new CategoryService();
