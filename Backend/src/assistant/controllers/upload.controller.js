const fs = require("fs");
const extractText = require("../services/parser.service");
const { analyzeMedicalReport } = require("../services/ai.service");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // ✅ get optional user question
    const userPrompt = req.body.message || "";

    const text = await extractText(filePath);

    // send both text + prompt to AI
    const analysis = await analyzeMedicalReport(text, req.body.question);


    fs.unlinkSync(filePath); // delete file after processing

    res.json({
      success: true,
      result: analysis.answer_to_user || analysis.summary || "Analysis complete.",
      analysis,
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
};

module.exports = uploadFile;
