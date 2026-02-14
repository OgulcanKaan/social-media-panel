const Customer = require('../models/Customer');
const ActivityLog = require("../models/ActivityLog");

// 1. YENİ MÜŞTERİ EKLE (Create)
exports.createCustomer = async (req, res) => {
    try {
        const { firma_adi, sektor, iletisim, notlar } = req.body;

        const createdCustomer = await Customer.create({
            firma_adi,
            sektor,
            iletisim,
            notlar
        });

        // ✅ LOG EKLEME
        await ActivityLog.create({
            UserId: req.user.id, // giriş yapan kullanıcı
            CustomerId: createdCustomer.id,
            eylem: `Müşteri oluşturuldu: ${createdCustomer.firma_adi}`
        });

        res.status(201).json({ 
            message: "Müşteri başarıyla eklendi.", 
            customer: createdCustomer 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Müşteri eklenirken hata oluştu." });
    }
};


// 2. TÜM MÜŞTERİLERİ GETİR (Read)
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: "Veriler alınamadı." });
    }
};


// 3. MÜŞTERİ SİL (Delete)
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "Müşteri bulunamadı." });
        }

        await Customer.destroy({ where: { id } });

        // ✅ LOG EKLEME
        await ActivityLog.create({
            UserId: req.user.id,
            CustomerId: id,
            eylem: `Müşteri silindi: ${customer.firma_adi}`
        });

        res.json({ message: "Müşteri silindi." });

    } catch (error) {
        res.status(500).json({ message: "Silme işlemi başarısız." });
    }
};


// 4. MÜŞTERİ GÜNCELLE (Update)
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { firma_adi, sektor, iletisim, notlar, durum } = req.body;

        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "Müşteri bulunamadı." });
        }

        customer.firma_adi = firma_adi || customer.firma_adi;
        customer.sektor = sektor || customer.sektor;
        customer.iletisim = iletisim || customer.iletisim;
        customer.notlar = notlar || customer.notlar;
        customer.durum = durum || customer.durum;

        await customer.save();

        // ✅ LOG EKLEME
        await ActivityLog.create({
            UserId: req.user.id,
            CustomerId: customer.id,
            eylem: `Müşteri güncellendi: ${customer.firma_adi}`
        });

        res.json({ message: "Müşteri güncellendi.", customer });

    } catch (error) {
        res.status(500).json({ message: "Güncelleme hatası." });
    }
};
