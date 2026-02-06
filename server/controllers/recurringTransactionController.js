const recurringTransactionService = require('../services/recurringTransactionService');

class RecurringTransactionController {

  async getAll(req, res) {
    try {
      const filters = {
        is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
        type: req.query.type,
        frequency: req.query.frequency
      };

      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const transactions = recurringTransactionService.getAll(filters);

      res.json({
        success: true,
        count: transactions.length,
        data: transactions
      });
    } catch (error) {
      console.error('Error getting recurring transactions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve recurring transactions'
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const transaction = recurringTransactionService.getById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Recurring transaction not found'
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Error getting recurring transaction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve recurring transaction'
      });
    }
  }

  async getSummary(req, res) {
    try {
      const summary = recurringTransactionService.getSummary();

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Error getting recurring transaction summary:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve summary'
      });
    }
  }

  async create(req, res) {
    try {
      const { type, description, amount, category_id, frequency, start_date, end_date, day_of_month, bank_account_id } = req.body;

      if (!type || !['income', 'expense'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid type. Must be "income" or "expense"'
        });
      }

      if (!description || typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Description is required'
        });
      }

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0'
        });
      }

      if (!category_id) {
        return res.status(400).json({
          success: false,
          error: 'Category ID is required'
        });
      }

      if (!frequency || !['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'].includes(frequency)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid frequency. Must be one of: daily, weekly, biweekly, monthly, quarterly, yearly'
        });
      }

      if (!start_date) {
        return res.status(400).json({
          success: false,
          error: 'Start date is required'
        });
      }

      const transaction = recurringTransactionService.create({
        type,
        description,
        amount: parseFloat(amount),
        category_id: parseInt(category_id),
        frequency,
        start_date,
        end_date: end_date || null,
        day_of_month: day_of_month ? parseInt(day_of_month) : null,
        bank_account_id: bank_account_id ? parseInt(bank_account_id) : null
      });

      res.status(201).json({
        success: true,
        message: 'Recurring transaction created successfully',
        data: transaction
      });
    } catch (error) {
      console.error('Error creating recurring transaction:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create recurring transaction'
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { type, description, amount, category_id, frequency, start_date, end_date, day_of_month, bank_account_id, is_active } = req.body;

      const transaction = recurringTransactionService.getById(id);
      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Recurring transaction not found'
        });
      }

      const updated = recurringTransactionService.update(id, {
        type,
        description,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        category_id: category_id !== undefined ? parseInt(category_id) : undefined,
        frequency,
        start_date,
        end_date: end_date || null,
        day_of_month: day_of_month ? parseInt(day_of_month) : null,
        bank_account_id: bank_account_id ? parseInt(bank_account_id) : null,
        is_active
      });

      res.json({
        success: true,
        message: 'Recurring transaction updated successfully',
        data: updated
      });
    } catch (error) {
      console.error('Error updating recurring transaction:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update recurring transaction'
      });
    }
  }

  async deactivate(req, res) {
    try {
      const { id } = req.params;

      const transaction = recurringTransactionService.getById(id);
      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Recurring transaction not found'
        });
      }

      const deactivated = recurringTransactionService.deactivate(id);

      res.json({
        success: true,
        message: 'Recurring transaction deactivated successfully',
        data: deactivated
      });
    } catch (error) {
      console.error('Error deactivating recurring transaction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to deactivate recurring transaction'
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const transaction = recurringTransactionService.getById(id);
      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Recurring transaction not found'
        });
      }

      recurringTransactionService.delete(id);

      res.json({
        success: true,
        message: 'Recurring transaction deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting recurring transaction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete recurring transaction'
      });
    }
  }
}

module.exports = new RecurringTransactionController();
