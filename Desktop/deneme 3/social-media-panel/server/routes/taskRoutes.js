const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController'); // ✅ EKLENDİ

// Tüm görevleri getir veya Filtrele
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { social_account_id, customer_id } = req.query;
    let whereClause = {};

    if (social_account_id) whereClause.SocialAccountId = social_account_id;
    if (customer_id) whereClause.CustomerId = customer_id;

    const tasks = await Task.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Görevler getirilemedi." });
  }
});

// Belirli bir ID'ye göre tekil görev (Social Account ID bazlı eski yapı desteği için)
router.get('/:socialAccountId', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { SocialAccountId: req.params.socialAccountId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Görevler bulunamadı." });
  }
});

// Yeni görev ekle
router.post('/', authMiddleware, async (req, res) => {
  try {
    const taskData = {
      baslik: req.body.baslik,
      icerik: req.body.icerik || '',
      durum: req.body.durum || 'yapilacak',
      son_tarih: req.body.planlanan_tarih || req.body.son_tarih,
      oncelik: req.body.oncelik || 'orta',
      CustomerId: req.body.customer_id,
      SocialAccountId: req.body.social_account_id,
    };

    const newTask = await Task.create(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Görev oluşturma hatası:", error);
    res.status(500).json({ message: "Görev oluşturulamadı." });
  }
});

// ✅ Görevi güncelle (status/durum güncelleme için) — Controller üzerinden
router.put('/:id', authMiddleware, taskController.updateTask);

// Görev sil
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Task.destroy({ where: { id: req.params.id } });
    res.json({ message: "Görev silindi." });
  } catch (error) {
    res.status(500).json({ message: "Silme hatası." });
  }
});

module.exports = router;
