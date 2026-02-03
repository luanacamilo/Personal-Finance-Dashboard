const transactionService = require('../services/transactionService');

class TransactionController {
 
  async getAll(req, res) {
    try {
      const filters = {
        type: req.query.type,
        category_id: req.query.category_id ? parseInt(req.query.category_id) : null,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      Object.keys(filters).forEach(key => {
        if (filters[key] === null || filters[key] === undefined) {
          delete filters[key];
        }
      });

      const transactions = transactionService.getAll(filters);
      
      res.json({
        success: true,
        count: transactions.length,
        data: transactions
      });
    } catch (error) {
      console.error('Error getting transactions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve transactions'
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const transaction = transactionService.getById(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Error getting transaction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve transaction'
      });
    }
  }


  async create(req, res) {
    try {
      const { type, amount, category_id, date, description } = req.body;

      if (!type || !['income', 'expense'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid type. Must be "income" or "expense"'
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

      if (!date) {
        return res.status(400).json({
          success: false,
          error: 'Date is required'
        });
      }

      const transaction = transactionService.create({
        type,
        amount: parseFloat(amount),
        category_id: parseInt(category_id),
        date,
        description
      });

      res.status(201).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      
      if (error.message.includes('FOREIGN KEY')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create transaction'
      });
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const { type, amount, category_id, date, description } = req.body;

      if (type && !['income', 'expense'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid type. Must be "income" or "expense"'
        });
      }

      if (amount && amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0'
        });
      }

      const transaction = transactionService.update(id, {
        type,
        amount: parseFloat(amount),
        category_id: parseInt(category_id),
        date,
        description
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      
      if (error.message.includes('FOREIGN KEY')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update transaction'
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = transactionService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        message: 'Transaction deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete transaction'
      });
    }
  }

  async getStats(req, res) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
      });

      const stats = transactionService.getStats(filters);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve statistics'
      });
    }
  }
}

module.exports = new TransactionController();
