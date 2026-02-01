const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');

router.get('/profile', userProfileController.getProfile);
router.post('/profile', userProfileController.saveProfile);
router.get('/onboarding-status', userProfileController.checkOnboarding);

module.exports = router;
