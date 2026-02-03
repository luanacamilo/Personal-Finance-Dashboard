const Database = require('better-sqlite3');
const path = require('path');

let db = null;

function getDatabase() {
  if (!db) {
    const dbPath = path.join(__dirname, '../../database/finance.db');
    db = new Database(dbPath);
    
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    
    console.log(' Database connected:', dbPath);
  }
  return db;
}

module.exports = { getDatabase };
