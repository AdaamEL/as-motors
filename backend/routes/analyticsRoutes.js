const express = require("express");
const { getTrackingOverview } = require("../controllers/analyticsController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/overview", authMiddleware, adminMiddleware, getTrackingOverview);

module.exports = router;
