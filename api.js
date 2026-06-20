import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const { formData, sectorName } = req.body;

  const prompt = `Act as an expert Indian Career Consultant. Analyze this profile:
  Name: ${formData.name}, Edu: ${formData.edu}, City: ${formData.city}, Skills: ${formData.skills}, Exp: ${formData.exp}, Target: ${sectorName}, Salary: ${formData.salary}.
  
  Respond ONLY in raw JSON. Format:
  {
    "employabilityScore": 0-100,
    "scoreColor": "green|yellow|red",
    "verdictTitle": "Short honest title",
    "verdictBody": "Brutally honest analysis including city context.",
    "crossIndustryDetected": true/false,
    "crossIndustryNote": "Note on gap",
    "bridgePath": { "fromField": "...", "toField": "...", "steps": [{"n":1, "action":"...", "resource":"...","time":"..."}] },
    "currentStrengths": [{"skill":"...", "level":0-100, "mv":"high|medium|low", "why":"..."}],
    "criticalGaps": [{"skill":"...", "priority":"high|medium|low", "why":"...", "how":"...","time":"..."}],
    "jobMatches": [{"title":"...", "sector":"...", "match":0-100, "salary":"...", "why":"...", "where":"...","first":"..."}],
    "actionPlan": [{"when":"Today/Week1/Month1", "title":"...", "detail":"..."}],
    "hiddenOpportunity": "Real local niche/company",
    "platforms": ["Platform1", "Platform2"]
  }`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().replace(/```json|```/g, "").trim();
    res.status(200).json(JSON.parse(text));
  } catch (e) {
    res.status(500).json({ error: "AI Analysis failed" });
  }
}