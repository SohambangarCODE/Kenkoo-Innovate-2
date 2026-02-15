const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeMedicalReport = async (text) => {
  const prompt = `
You are a medical AI assistant.

Analyze this medical report and return ONLY JSON:

{
  "patient_name": "",
  "diagnosis": "",
  "abnormal_values": [],
  "risk_level": "",
  "summary": ""
}

Report:
${text}
`;

  const response = await model.invoke(prompt);
  return response.content;
};

module.exports = analyzeMedicalReport;
