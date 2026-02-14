const Task = require('../models/Task');

// 1. Yeni Görev Oluştur
exports.createTask = async (req, res) => {
    try {
        const { social_account_id, baslik, planlanan_tarih } = req.body;

        const newTask = await Task.create({
            baslik: baslik,
            son_tarih: planlanan_tarih,
            SocialAccountId: social_account_id,
            durum: 'yapilacak'
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Görev oluşturma hatası:", error);
        res.status(500).json({ message: "Görev eklenirken hata oluştu" });
    }
};

// 2. Sosyal Hesaba Göre Görevleri Getir
exports.getTasksBySocialAccount = async (req, res) => {
    try {
        const { social_id } = req.params;

        const tasks = await Task.findAll({
            where: { SocialAccountId: social_id },
            order: [['son_tarih', 'ASC']]
        });

        res.json(tasks);
    } catch (error) {
        console.error("Görev getirme hatası:", error);
        res.status(500).json({ message: "Görevler yüklenemedi" });
    }
};

// 3. Görev Güncelle (Durum Update)
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { durum } = req.body;

        // ENUM kontrolü (güvenli yapı)
        const validStatus = ['yapilacak', 'devam_ediyor', 'tamamlandi'];

        if (!validStatus.includes(durum)) {
            return res.status(400).json({ message: "Geçersiz görev durumu" });
        }

        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: "Görev bulunamadı" });
        }

        task.durum = durum;
        await task.save();

        res.json({ message: "Görev güncellendi", task });

    } catch (error) {
        console.error("Güncelleme hatası:", error);
        res.status(500).json({ message: "Görev güncellenemedi" });
    }
};

// 4. Görev Sil
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: "Görev bulunamadı" });
        }

        await task.destroy();
        res.json({ message: "Görev başarıyla silindi" });

    } catch (error) {
        console.error("Silme hatası:", error);
        res.status(500).json({ message: "Görev silinemedi" });
    }
};
