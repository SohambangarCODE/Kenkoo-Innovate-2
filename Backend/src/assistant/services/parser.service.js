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
const pdfParse = require("pdf-parse");

const extractText = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
};

module.exports = extractText;
