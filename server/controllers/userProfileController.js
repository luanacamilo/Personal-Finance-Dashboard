const { getDatabase } = require('../config/database');

exports.getProfile = (req, res) => {
  try {
    const db = getDatabase();
    const profile = db.prepare('SELECT * FROM user_profile ORDER BY id DESC LIMIT 1').get();
    res.json(profile || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.saveProfile = (req, res) => {
  try {
    const db = getDatabase();
    const { main_salary, other_income, periodicity, savings_goal, investment_goal, emergency_fund_goal } = req.body;

    if (!main_salary || main_salary < 0) {
      return res.status(400).json({ error: 'Main salary is required and must be positive' });
    }

    if (!periodicity || !['monthly', 'biweekly'].includes(periodicity)) {
      return res.status(400).json({ error: 'Periodicity must be monthly or biweekly' });
    }

    const existing = db.prepare('SELECT id FROM user_profile LIMIT 1').get();

    if (existing) {
      const stmt = db.prepare(`
        UPDATE user_profile 
        SET main_salary = ?, 
            other_income = ?, 
            periodicity = ?,
            savings_goal = ?,
            investment_goal = ?,
            emergency_fund_goal = ?,
            onboarding_completed = 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(
        main_salary,
        other_income || 0,
        periodicity,
        savings_goal || 0,
        investment_goal || 0,
        emergency_fund_goal || 0,
        existing.id
      );

      const updated = db.prepare('SELECT * FROM user_profile WHERE id = ?').get(existing.id);
      res.json(updated);
    } else {
      const stmt = db.prepare(`
        INSERT INTO user_profile (main_salary, other_income, periodicity, savings_goal, investment_goal, emergency_fund_goal, onboarding_completed)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `);

      const result = stmt.run(
        main_salary,
        other_income || 0,
        periodicity,
        savings_goal || 0,
        investment_goal || 0,
        emergency_fund_goal || 0
      );

      const created = db.prepare('SELECT * FROM user_profile WHERE id = ?').get(result.lastInsertRowid);
      res.status(201).json(created);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkOnboarding = (req, res) => {
  try {
    const db = getDatabase();
    const profile = db.prepare('SELECT onboarding_completed FROM user_profile LIMIT 1').get();
    res.json({ completed: profile ? Boolean(profile.onboarding_completed) : false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
