const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.post('/login',AuthController.login);
router.post('/logout',AuthController.logout);
router.post('/signup',AuthController.signUp);

module.exports = router;