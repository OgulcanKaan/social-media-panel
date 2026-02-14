const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. KAYIT OL (REGISTER)
exports.register = async (req, res) => {
    try {
        const { ad, email, sifre, rol } = req.body;

        // Email kontrolü
        const mevcutKullanici = await User.findOne({ where: { email } });
        if (mevcutKullanici) {
            return res.status(400).json({ message: "Bu email adresi zaten kayıtlı." });
        }

        // Şifreleme (Bcrypt)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(sifre, salt);

        // Kullanıcı oluşturma
        const newUser = await User.create({
            ad,
            email,
            sifre: hashedPassword,
            rol: rol || 'calisan' // Dokümana göre admin veya calisan rolü atanabilir [cite: 29]
        });

        res.status(201).json({ 
            message: "Kullanıcı başarıyla oluşturuldu.", 
            user: { id: newUser.id, ad: newUser.ad, email: newUser.email, rol: newUser.rol } 
        });

    } catch (error) {
        console.error("Kayıt Hatası:", error);
        res.status(500).json({ message: "Sunucu hatası oluştu." });
    }
};

// 2. GİRİŞ YAP (LOGIN)
exports.login = async (req, res) => {
    try {
        const { email, sifre } = req.body;

        // 1. Kullanıcıyı veritabanında bul [cite: 25]
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        // 2. Şifreyi kontrol et
        const isMatch = await bcrypt.compare(sifre, user.sifre);
        if (!isMatch) {
            return res.status(400).json({ message: "Hatalı şifre." });
        }

        // 3. Token oluştur (JWT) 
        const token = jwt.sign(
            { id: user.id, rol: user.rol }, 
            process.env.JWT_SECRET,        
            { expiresIn: '1d' }            
        );

        res.json({
            message: "Giriş başarılı.",
            token, 
            user: {
                id: user.id,
                ad: user.ad,
                email: user.email,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error("Login Hatası:", error);
        res.status(500).json({ message: "Sunucu hatası." });
    } 
};

// 3. MEVCUT KULLANICI BİLGİSİ (GET ME) [cite: 55]
exports.getMe = async (req, res) => {
    try {
        // req.user, authMiddleware tarafından doldurulur
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['sifre'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Kullanıcı bilgisi alınamadı." });
    }
};