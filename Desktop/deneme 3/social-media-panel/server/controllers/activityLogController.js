const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");
const Customer = require("../models/Customer");

exports.getLastActivities = async (req, res) => {
  const logs = await ActivityLog.findAll({
    order: [["createdAt", "DESC"]],
    limit: 10,
    include: [
      { model: User, attributes: ["ad", "email"] },
      { model: Customer, attributes: ["firma_adi"] }
    ]
  });
  res.json(logs);
};
