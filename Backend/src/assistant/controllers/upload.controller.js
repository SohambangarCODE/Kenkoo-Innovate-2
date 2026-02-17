const fs = require("fs");
const extractText = require("../services/parser.service");
const { analyzeMedicalReport } = require("../services/ai.service");
const Record = require("../../models/record.model");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // ✅ get optional user question
    const userPrompt = req.body.message || "";

    let text = "";
    try {
        text = await extractText(filePath);
    } catch (parseErr) {
        console.error("Text Extraction Failed:", parseErr);
        text = "Text extraction failed.";
    }

    // send both text + prompt to AI
    let analysis = {};
    try {
        analysis = await analyzeMedicalReport(text, req.body.question);
    } catch (aiError) {
        console.error("AI Analysis Failed:", aiError);
        // Fallback analysis object
        analysis = {
            title: "Uploaded Document",
            type: "Other",
            provider: "Unknown",
            date: null,
            summary: "AI analysis failed. Document uploaded successfully."
        };
    }

    // Create a new record in the database
    const newRecord = new Record({
      user: req.user._id, // Assumes protect middleware is used
      title: req.file.originalname, // Set title to original filename as requested 
      type: req.body.type || analysis.type || "Lab Report",     // Use manual type if provided, else AI, else default
      provider: analysis.provider || "Unknown Provider",
      date: analysis.date ? new Date(analysis.date) : Date.now(),
      fileUrl: `/uploads/${req.file.filename}`, 
      fileName: req.file.originalname,
      fileType: req.file.mimetype ? req.file.mimetype.split('/')[1] : "pdf", 
      analysis: analysis,
    });

    await newRecord.save();

    // fs.unlinkSync(filePath); // WE KEEP THE FILE NOW for valid access via URL

    res.json({
      success: true,
      result: analysis.answer_to_user || analysis.summary || "Analysis complete.",
      analysis,
      record: newRecord
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
};

module.exports = uploadFile;
