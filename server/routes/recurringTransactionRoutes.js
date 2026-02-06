const express = require('express');
const router = express.Router();
const recurringTransactionController = require('../controllers/recurringTransactionController');

router.get('/', recurringTransactionController.getAll);

router.get('/summary/overview', recurringTransactionController.getSummary);

router.get('/:id', recurringTransactionController.getById);

router.post('/', recurringTransactionController.create);

router.put('/:id', recurringTransactionController.update);

router.delete('/:id/deactivate', recurringTransactionController.deactivate);

router.delete('/:id', recurringTransactionController.delete);

module.exports = router;
