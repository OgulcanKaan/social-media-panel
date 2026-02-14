//Kullanıcı verileri.
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Aynı email ile tek kayıt olabilir
        validate: {
            isEmail: true
        }
    },
    sifre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('admin', 'calisan'),
        defaultValue: 'calisan'
    }
}, {
    timestamps: true // created_at ve updated_at otomatik eklenir
});

module.exports = User;