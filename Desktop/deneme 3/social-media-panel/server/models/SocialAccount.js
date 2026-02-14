//Müşterilerin Instagram, LinkedIn gibi hesaplarının verileri.Müşterilerin Instagram, LinkedIn gibi hesaplarının verileri.
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SocialAccount = sequelize.define('SocialAccount', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    platform: {
        type: DataTypes.ENUM('Instagram', 'Facebook', 'X', 'LinkedIn', 'TikTok'),
        allowNull: false
    },
    kullanici_adi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING
    }
    // customer_id ilişkisini index.js dosyasında kuracağız
}, {
    timestamps: true
});

module.exports = SocialAccount;