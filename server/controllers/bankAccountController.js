const bankAccountService = require('../services/bankAccountService');

class BankAccountController {

  async getAll(req, res) {
    try {
      const accounts = bankAccountService.getAll();

      res.json({
        success: true,
        count: accounts.length,
        data: accounts
      });
    } catch (error) {
      console.error('Error getting bank accounts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve bank accounts'
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const account = bankAccountService.getById(id);

      if (!account) {
        return res.status(404).json({
          success: false,
          error: 'Bank account not found'
        });
      }

      res.json({
        success: true,
        data: account
      });
    } catch (error) {
      console.error('Error getting bank account:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve bank account'
      });
    }
  }

  async getTotalBalance(req, res) {
    try {
      const total = bankAccountService.getTotalBalance();

      res.json({
        success: true,
        data: { total_balance: total }
      });
    } catch (error) {
      console.error('Error getting total balance:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve total balance'
      });
    }
  }

  async create(req, res) {
    try {
      const { name, account_type, initial_balance } = req.body;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Account name is required'
        });
      }

      if (!account_type || !['checking', 'savings', 'investment', 'other'].includes(account_type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid account type. Must be one of: checking, savings, investment, other'
        });
      }

      const account = bankAccountService.create({
        name,
        account_type,
        initial_balance: parseFloat(initial_balance) || 0
      });

      res.status(201).json({
        success: true,
        message: 'Bank account created successfully',
        data: account
      });
    } catch (error) {
      console.error('Error creating bank account:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create bank account'
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, account_type, current_balance } = req.body;

      const account = bankAccountService.getById(id);
      if (!account) {
        return res.status(404).json({
          success: false,
          error: 'Bank account not found'
        });
      }

      const updated = bankAccountService.update(id, {
        name,
        account_type,
        current_balance: current_balance !== undefined ? parseFloat(current_balance) : undefined
      });

      res.json({
        success: true,
        message: 'Bank account updated successfully',
        data: updated
      });
    } catch (error) {
      console.error('Error updating bank account:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update bank account'
      });
    }
  }

  async deactivate(req, res) {
    try {
      const { id } = req.params;

      const account = bankAccountService.getById(id);
      if (!account) {
        return res.status(404).json({
          success: false,
          error: 'Bank account not found'
        });
      }

      const deactivated = bankAccountService.deactivate(id);

      res.json({
        success: true,
        message: 'Bank account deactivated successfully',
        data: deactivated
      });
    } catch (error) {
      console.error('Error deactivating bank account:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to deactivate bank account'
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const account = bankAccountService.getById(id);
      if (!account) {
        return res.status(404).json({
          success: false,
          error: 'Bank account not found'
        });
      }

      bankAccountService.delete(id);

      res.json({
        success: true,
        message: 'Bank account deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting bank account:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete bank account'
      });
    }
  }

  async updateBalance(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      if (amount === undefined || amount === null) {
        return res.status(400).json({
          success: false,
          error: 'Amount is required'
        });
      }

      const account = bankAccountService.getById(id);
      if (!account) {
        return res.status(404).json({
          success: false,
          error: 'Bank account not found'
        });
      }

      const updated = bankAccountService.updateBalance(id, parseFloat(amount));

      res.json({
        success: true,
        message: 'Bank account balance updated successfully',
        data: updated
      });
    } catch (error) {
      console.error('Error updating bank account balance:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update bank account balance'
      });
    }
  }
}

module.exports = new BankAccountController();
