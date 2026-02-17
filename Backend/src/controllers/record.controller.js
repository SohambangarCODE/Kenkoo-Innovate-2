const Record = require("../models/record.model");

// @desc    Get all records
// @route   GET /api/records
// @access  Private
const getRecords = async (req, res) => {
  try {
    const records = await Record.find({ user: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getRecords,
};
