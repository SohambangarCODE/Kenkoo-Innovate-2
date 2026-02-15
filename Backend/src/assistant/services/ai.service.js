const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeMedicalReport = async (text, question = null) => {
  const prompt = `
You are a medical AI assistant.

Analyze the medical report.

Return ONLY JSON:

{
  "patient_name": "",
  "diagnosis": "",
  "abnormal_values": [],
  "risk_level": "",
  "summary": "",
  "answer_to_user": ""
}

User Question: ${question || "No question asked"}

Report:
${text}
`;

  const response = await model.invoke(prompt);

  try {
    return JSON.parse(response.content);
  } catch {
    return { raw: response.content };
  }
};

module.exports = analyzeMedicalReport;
