const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getLastActivities } = require("../controllers/activityLogController");

router.get("/", auth, getLastActivities);
module.exports = router;
