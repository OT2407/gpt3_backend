// services/aiProviders/groqProvider.js

const fetch = global.fetch || require("node-fetch");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

async function generate(prompt, options = {}) {
  if (!GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const model = options.model || GROQ_MODEL;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a governance AI. Return strict JSON when requested." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 600
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`groq error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return {
    provider: "groq",
    text: data.choices?.[0]?.message?.content || ""
  };
}

module.exports = { generate };
