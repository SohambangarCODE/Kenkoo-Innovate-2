// const fs = require("fs");
// const pdfParse = require("pdf-parse");

// const extractText = async (filePath) => {
//   console.log(pdfParse);
//   const buffer = fs.readFileSync(filePath);

//   const data = await pdfParse(buffer);

//   return data.text;
// };


// module.exports = extractText;


// const fs = require("fs");
// const pdfParse = require("pdf-parse").default || require("pdf-parse");

// const extractText = async (filePath) => {
//   console.log("Reading file:", filePath);

//   const buffer = fs.readFileSync(filePath);

//   console.log("Parsing PDF...");

//   const data = await pdfParse(buffer);

//   console.log("Parsed text length:", data.text.length);

//   return data.text;
// };

// module.exports = extractText;


const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

const extractText = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  // ---------- PDF ----------
  if (ext === ".pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  // ---------- IMAGE ----------
  if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
    const result = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m.status),
    });

    return result.data.text;
  }

  throw new Error("Unsupported file format");
};

module.exports = extractText;

