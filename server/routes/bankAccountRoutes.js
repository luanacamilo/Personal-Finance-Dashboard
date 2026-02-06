const express = require('express');
const router = express.Router();
const bankAccountController = require('../controllers/bankAccountController');

router.get('/', bankAccountController.getAll);

router.get('/summary/balance', bankAccountController.getTotalBalance);

router.get('/:id', bankAccountController.getById);

router.post('/', bankAccountController.create);

router.put('/:id', bankAccountController.update);

router.put('/:id/balance', bankAccountController.updateBalance);

router.delete('/:id/deactivate', bankAccountController.deactivate);

router.delete('/:id', bankAccountController.delete);

module.exports = router;
