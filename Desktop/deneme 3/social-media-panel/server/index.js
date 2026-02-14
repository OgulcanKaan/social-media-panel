const express = require("express");
const cors = require("cors");

// 1. KRİTİK ADIM: Ortam değişkenlerini her şeyden önce yükle
require("dotenv").config(); 

// Bağlantı linkinin yüklenip yüklenmediğini terminalde görmek için log
console.log("---- SİSTEM KONTROLÜ ----");
console.log("DATABASE_URL Durumu:", process.env.DATABASE_URL ? "✅ YÜKLENDİ" : "❌ EKSİK ( .env dosyasını kontrol et! )");
console.log("-------------------------");

const { connectDB, sequelize } = require("./config/db");

// Modelleri İmport Et
const User = require("./models/User");
const Customer = require("./models/Customer");
const SocialAccount = require("./models/SocialAccount");
const Task = require("./models/Task");
const ContentPlan = require("./models/ContentPlan"); 

// Rotaları İmport Et
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const socialAccountRoutes = require('./routes/socialAccountRoutes');
const taskRoutes = require('./routes/taskRoutes');
const contentRoutes = require('./routes/contentRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Rotaları
app.use('/api/auth', authRoutes); 
app.use('/api/customers', customerRoutes);
app.use('/api/social-accounts', socialAccountRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/content-plans', contentRoutes); 

// -----------------------------------------
// İLİŞKİLERİ TANIMLA (DATABASE ASSOCIATIONS)
// -----------------------------------------
Customer.hasMany(SocialAccount, { onDelete: 'CASCADE' }); 
SocialAccount.belongsTo(Customer);

Customer.hasMany(ContentPlan, { onDelete: 'CASCADE' });
ContentPlan.belongsTo(Customer);

Customer.hasMany(Task, { onDelete: 'CASCADE' });
Task.belongsTo(Customer);

SocialAccount.hasMany(Task, { onDelete: 'CASCADE' });
Task.belongsTo(SocialAccount);

User.hasMany(Task);
Task.belongsTo(User);
// -----------------------------------------

const startServer = async () => {
    try {
        // Önce veritabanına bağlan
        await connectDB();
        
        // Tabloları Render'daki veritabanıyla senkronize et (Eksik sütunları ekler)
        await sequelize.sync({ alter: true }); 
        console.log("✅ Veritabanı ve tüm ilişkiler başarıyla senkronize edildi.");
        
        app.listen(PORT, () => {
            console.log(`🚀 Sunucu yerelde http://localhost:${PORT} adresinde aktif.`);
            console.log(`📡 Canlı Veritabanı bağlantısı aktif!`);
        });
    } catch (error) {
        console.error("❌ Sunucu başlatılırken kritik hata:", error);
    }
};

startServer();

// Ana dizin kontrolü
app.get("/", (req, res) => {
    res.json({ 
        status: "success",
        message: "Ajans CRM API Canlı Veritabanı ile Çalışıyor!",
        timestamp: new Date().toISOString()
    });
});