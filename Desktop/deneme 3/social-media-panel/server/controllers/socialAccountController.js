const SocialAccount = require('../models/SocialAccount');
const Customer = require('../models/Customer');

// 1. SOSYAL MEDYA HESABI EKLE
exports.createSocialAccount = async (req, res) => {
    try {
        const { customer_id, platform, kullanici_adi, url } = req.body;

        // Önce müşteri var mı diye kontrol edelim
        const customer = await Customer.findByPk(customer_id);
        if (!customer) {
            return res.status(404).json({ message: "Müşteri bulunamadı." });
        }

        // Hesabı oluştur (CustomerId veritabanında otomatik oluşan sütun adıdır)
        const newAccount = await SocialAccount.create({
            CustomerId: customer_id, // İlişkiyi burada kuruyoruz
            platform,
            kullanici_adi,
            url
        });

        res.status(201).json({ message: "Sosyal hesap eklendi.", account: newAccount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hesap eklenirken hata oluştu." });
    }
};

// 2. BİR MÜŞTERİNİN HESAPLARINI GETİR
exports.getAccountsByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params; // URL'den ID'yi alacağız

        const accounts = await SocialAccount.findAll({
            where: { CustomerId: customerId }
        });

        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: "Hesaplar alınamadı." });
    }
};

// 3. HESAP SİL
exports.deleteSocialAccount = async (req, res) => {
    try {
        const { id } = req.params;
        await SocialAccount.destroy({ where: { id } });
        res.json({ message: "Sosyal hesap silindi." });
    } catch (error) {
        res.status(500).json({ message: "Silme başarısız." });
    }
};