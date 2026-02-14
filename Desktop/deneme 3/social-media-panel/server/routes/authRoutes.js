const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Korumalı rotalar için

// POST /api/auth/register — Yeni kullanıcı kaydı [cite: 53]
router.post('/register', authController.register);

// POST /api/auth/login — Giriş ve JWT token alma [cite: 54]
router.post('/login', authController.login);

// GET /api/auth/me — Mevcut kullanıcı bilgisi (Token gerektirir) [cite: 55]
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;