//Takvimde görünen içerik planları.
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ContentPlan = sequelize.define('ContentPlan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    platform: { 
        // Dokümanda istenen platformlar [cite: 43]
        type: DataTypes.ENUM('Instagram', 'Facebook', 'X', 'LinkedIn', 'TikTok'), 
        allowNull: false 
    },
    icerik: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    tarih: { 
        // Takvim görünümü için tarih alanı [cite: 42]
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    durum: { 
        // Taslak, Onaylandı, Yayınlandı durumları [cite: 44]
        type: DataTypes.ENUM('Taslak', 'Onaylandı', 'Yayınlandı'), 
        defaultValue: 'Taslak' 
    }
}, {
    timestamps: true // Aktivite kaydı ve takip için [cite: 25]
});

module.exports = ContentPlan;