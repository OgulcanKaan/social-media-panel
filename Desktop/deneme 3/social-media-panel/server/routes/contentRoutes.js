const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

// Tüm içerikleri getir (Takvim görünümü için)
router.get('/', authMiddleware, contentController.getAllContents);

// Yeni içerik planı oluştur
router.post('/', authMiddleware, contentController.createContent);

// İçerik güncelle (Durum değişikliği vb.)
router.put('/:id', authMiddleware, contentController.updateContent);

// İçerik sil
router.delete('/:id', authMiddleware, contentController.deleteContent);

module.exports = router;