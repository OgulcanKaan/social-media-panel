//Firma adı, sektör ve durum gibi müşteri bilgileri.
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firma_adi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sektor: {
        type: DataTypes.STRING
    },
    iletisim: {
        type: DataTypes.STRING
    },
    notlar: {
        type: DataTypes.TEXT
    },
    durum: {
        type: DataTypes.ENUM('aktif', 'pasif', 'deneme'),
        defaultValue: 'aktif'
    }
}, {
    timestamps: true
});

module.exports = Customer;