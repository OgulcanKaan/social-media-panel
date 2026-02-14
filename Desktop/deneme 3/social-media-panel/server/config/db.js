const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// .env dosyasını yükle
dotenv.config();

/**
 * Sequelize Bağlantı Ayarları
 * Render üzerindeki PostgreSQL veritabanına bağlanmak için 
 * SSL ve DATABASE_URL kullanımı zorunludur.
 */
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Render'da güvenli bağlantı için bu satır şarttır
        }
    },
    logging: false, // Konsol kirliliğini önlemek için SQL sorgularını gizler
});

/**
 * Veritabanı Bağlantı Testi
 */
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('---------------------------------------------');
        console.log('✅ BAĞLANTI BAŞARILI: Render DB aktif!');
        console.log('---------------------------------------------');
    } catch (error) {
        console.error('---------------------------------------------');
        console.error('❌ BAĞLANTI HATASI:', error.message);
        console.error('Lütfen .env dosyasındaki DATABASE_URL linkini kontrol edin.');
        console.error('---------------------------------------------');
    }
};

module.exports = { sequelize, connectDB };