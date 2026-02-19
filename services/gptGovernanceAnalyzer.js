// services/gptGovernanceAnalyzer.js

require("dotenv").config();
const OpenAI = require("openai");

function createClient(provider) {
  if (provider === "groq") {
    return new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  if (provider === "openai") {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return null;
}

async function callProvider(provider, diffData) {
  const prompt = `
You are an AI governance engine.
Return STRICT JSON only:
{ "severity": "PATCH | MINOR | MAJOR", "risk_score": number (1-10), "impact_scope": "LOCAL | SERVICE | SYSTEM | BREAKING", "confidence": "LOW | MEDIUM | HIGH" }

Change Data:
${JSON.stringify(diffData, null, 2)}
`;

  // ---------------- OLLAMA ----------------
  if (provider === "ollama") {
    const response = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error ${response.status}`);
    }

    const data = await response.json();
    return (data.response || "").trim();
  }

  // ---------------- GROQ / OPENAI ----------------
  const client = createClient(provider);
  if (!client) throw new Error("No client for provider");

  const model =
    provider === "groq"
      ? process.env.GROQ_MODEL
      : "gpt-4o-mini";

  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      { role: "system", content: "Return JSON only." },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty AI response");

  return content;
}

async function analyzeArchitectureDiff(diffData) {
  const providers = (process.env.AI_PROVIDER_ORDER || "groq,ollama,openai")
    .split(",")
    .map(p => p.trim())
    .filter(Boolean);

  for (const provider of providers) {
    try {
      if (provider === "groq" && !process.env.GROQ_API_KEY) continue;
      if (provider === "openai" && !process.env.OPENAI_API_KEY) continue;
      if (provider === "ollama" && !process.env.OLLAMA_URL) continue;

      const raw = await callProvider(provider, diffData);

      try {
        const json = JSON.parse(raw);
        if (!json.severity) throw new Error("Invalid shape");
        return json;
      } catch {
        console.warn(`${provider} returned invalid JSON`);
      }

    } catch (err) {
      console.warn(`${provider} failed:`, err.message);
    }
  }

  return {
    severity: "PATCH",
    risk_score: 2,
    impact_scope: "LOCAL",
    confidence: "LOW",
  };
}

module.exports = { analyzeArchitectureDiff };
