const fs = require("fs");
const extractText = require("../services/parser.service");
const analyzeMedicalReport = require("../services/ai.service");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    const text = await extractText(filePath);

    const analysis = await analyzeMedicalReport(text);

    fs.unlinkSync(filePath); // delete file after processing

    res.json({
      success: true,
      analysis,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
};

module.exports = uploadFile;
