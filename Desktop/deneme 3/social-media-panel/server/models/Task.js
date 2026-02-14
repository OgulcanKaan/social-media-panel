//Görevlerin başlığı, içeriği, durumu ve hangi firmaya/sosyal hesaba ait olduğu bilgisi.
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    baslik: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icerik: {
        type: DataTypes.TEXT
    },
    durum: {
        type: DataTypes.ENUM('yapilacak', 'devam_ediyor', 'tamamlandi'),
        defaultValue: 'yapilacak'
    },
    son_tarih: {
        type: DataTypes.DATEONLY
    },
    oncelik: {
        type: DataTypes.ENUM('dusuk', 'orta', 'yuksek'),
        defaultValue: 'orta'
    },
    // Foreign Key alanları index.js'deki ilişkilerle otomatik oluşur 
    // ama manuel eklemek istersen:
    CustomerId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    SocialAccountId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Task;