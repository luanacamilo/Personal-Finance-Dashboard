const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/stats', transactionController.getStats.bind(transactionController));

router.get('/', transactionController.getAll.bind(transactionController));

router.get('/:id', transactionController.getById.bind(transactionController));

router.post('/', transactionController.create.bind(transactionController));

router.put('/:id', transactionController.update.bind(transactionController));

router.delete('/:id', transactionController.delete.bind(transactionController));

module.exports = router;
