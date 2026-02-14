const express = require('express');
const router = express.Router();
const socialAccountController = require('../controllers/socialAccountController');
const authMiddleware = require('../middleware/authMiddleware');

// Yeni Hesap Ekle (POST /api/social-accounts)
router.post('/', authMiddleware, socialAccountController.createSocialAccount);

// Bir Müşterinin Hesaplarını Getir (GET /api/social-accounts/customer/:customerId)
router.get('/customer/:customerId', authMiddleware, socialAccountController.getAccountsByCustomer);

// Hesap Sil (DELETE /api/social-accounts/:id)
router.delete('/:id', authMiddleware, socialAccountController.deleteSocialAccount);

module.exports = router;