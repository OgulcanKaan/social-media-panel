const ContentPlan = require('../models/ContentPlan');
const Customer = require('../models/Customer');

// Yeni içerik planı oluştur
exports.createContent = async (req, res) => {
  try {
    const { customer_id, platform, icerik, tarih, durum } = req.body;

    const newPlan = await ContentPlan.create({
      CustomerId: customer_id,
      platform,
      icerik,
      tarih,
      durum: durum || 'Taslak'
    });

    res.status(201).json(newPlan);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "İçerik planı oluşturulamadı." });
  }
};

// Tüm içerik planlarını getir
exports.getAllContents = async (req, res) => {
  try {
    const contents = await ContentPlan.findAll({
      include: [{ model: Customer, attributes: ['firma_adi'] }],
      order: [['tarih', 'ASC']]
    });
    res.json(contents);
  } catch (error) {
    console.error("Getirme hatası:", error);
    res.status(500).json({ message: "Veriler getirilemedi." });
  }
};

// Genel Güncelleme (tüm alanlar)
exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await ContentPlan.findByPk(id);
    if (!plan) return res.status(404).json({ message: "Bulunamadı" });

    await plan.update(req.body);
    res.json(plan);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    res.status(500).json({ message: "Güncellenemedi." });
  }
};

// ✅ Durum Güncelleme (sadece durum)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { durum } = req.body;

    // İstersen burada allowed durumları modeline göre netleştir:
    // Örnek:
    const validStatus = ['Taslak', 'Planlandi', 'Paylasildi', 'Iptal']; 
    // Eğer sende enum yoksa bu kontrolü kaldırabilirsin.
    if (durum && !validStatus.includes(durum)) {
      return res.status(400).json({ message: "Geçersiz durum" });
    }

    const plan = await ContentPlan.findByPk(id);
    if (!plan) return res.status(404).json({ message: "Bulunamadı" });

    plan.durum = durum;
    await plan.save();

    res.json({ message: "Durum güncellendi", plan });
  } catch (error) {
    console.error("Durum güncelleme hatası:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Tek bir Silme fonksiyonu bırakıyoruz (çakışma yok)
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await ContentPlan.findByPk(id);
    if (!plan) return res.status(404).json({ message: "Bulunamadı" });

    await plan.destroy();
    res.json({ message: "Silindi" });
  } catch (error) {
    console.error("Silme hatası:", error);
    res.status(500).json({ message: "Silinemedi." });
  }
};
