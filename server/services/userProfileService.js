const { getDatabase } = require('../config/database');

class UserProfileService {
  static getProfile() {
    try {
      const db = getDatabase();
      if (!db.data.user_profile) {
        db.data.user_profile = [];
      }
      return db.data.user_profile[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static saveProfile(data) {
    try {
      const db = getDatabase();
      
      if (!db.data.user_profile) {
        db.data.user_profile = [];
      }

      const {
        main_salary,
        other_income,
        periodicity,
        savings_goal,
        investment_goal,
        emergency_fund_goal,
      } = data;

      if (!main_salary || main_salary < 0) {
        throw new Error('Main salary is required and must be positive');
      }

      if (!periodicity || !['monthly', 'biweekly'].includes(periodicity)) {
        throw new Error('Periodicity must be monthly or biweekly');
      }

      const now = new Date().toISOString();

      if (db.data.user_profile.length > 0) {
        // Update existing
        db.data.user_profile[0] = {
          ...db.data.user_profile[0],
          main_salary,
          other_income: other_income || 0,
          periodicity,
          savings_goal: savings_goal || 0,
          investment_goal: investment_goal || 0,
          emergency_fund_goal: emergency_fund_goal || 0,
          onboarding_completed: 1,
          updated_at: now,
        };
      } else {
        db.data.user_profile.push({
          id: 1,
          main_salary,
          other_income: other_income || 0,
          periodicity,
          savings_goal: savings_goal || 0,
          investment_goal: investment_goal || 0,
          emergency_fund_goal: emergency_fund_goal || 0,
          onboarding_completed: 1,
          created_at: now,
          updated_at: now,
        });
      }

      db.saveData();
      return db.data.user_profile[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserProfileService;
