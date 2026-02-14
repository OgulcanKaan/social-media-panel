const Customer = require("../models/Customer");
const Task = require("../models/Task");
const ContentPlan = require("../models/ContentPlan");

exports.getDashboard = async (req, res) => {
  try {
    const totalCustomers = await Customer.count();

    const activeTasks = await Task.count({
      where: { durum: ["Yapılacak", "Devam Ediyor", "Bekliyor"] } // sende hangi durumlar varsa ona göre düzelt
    });

    const upcomingContents = await ContentPlan.findAll({
      order: [["tarih", "ASC"]],
      limit: 5,
      include: [{ model: Customer, attributes: ["firma_adi"] }]
    });

    res.json({
      totalCustomers,
      activeTasks,
      upcomingContents
    });
  } catch (e) {
    res.status(500).json({ message: "Dashboard verisi alınamadı." });
  }
};
