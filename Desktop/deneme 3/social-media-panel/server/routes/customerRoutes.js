const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

// Listeleme ve Ekleme
router.get('/', authMiddleware, customerController.getAllCustomers);
router.post('/', authMiddleware, customerController.createCustomer);

// Silme ve Güncelleme (ID gerektirir) -> /api/customers/:id
router.delete('/:id', authMiddleware, customerController.deleteCustomer); // YENİ
router.put('/:id', authMiddleware, customerController.updateCustomer);    // YENİ

module.exports = router;