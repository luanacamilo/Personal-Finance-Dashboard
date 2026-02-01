const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET /api/transactions/stats - deve vir antes de /:id
router.get('/stats', transactionController.getStats.bind(transactionController));

// GET /api/transactions
router.get('/', transactionController.getAll.bind(transactionController));

// GET /api/transactions/:id
router.get('/:id', transactionController.getById.bind(transactionController));

// POST /api/transactions
router.post('/', transactionController.create.bind(transactionController));

// PUT /api/transactions/:id
router.put('/:id', transactionController.update.bind(transactionController));

// DELETE /api/transactions/:id
router.delete('/:id', transactionController.delete.bind(transactionController));

module.exports = router;
