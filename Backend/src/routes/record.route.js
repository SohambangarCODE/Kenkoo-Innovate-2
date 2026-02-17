const express = require("express");
const router = express.Router();
const { getRecords } = require("../controllers/record.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getRecords);

module.exports = router;
