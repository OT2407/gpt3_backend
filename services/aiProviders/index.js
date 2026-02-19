// services/aiProviders/index.js

const groq = require("./groqProvider");
const ollama = require("./ollamaProvider");
const openai = require("./openaiProvider");

const providerMap = {
  groq,
  ollama,
  openai
};

const providerOrder = (process.env.AI_PROVIDER_ORDER || "groq,ollama,openai")
  .split(",")
  .map(p => p.trim());

async function generateWithFallback(prompt) {
  const errors = [];

  for (const providerName of providerOrder) {
    const provider = providerMap[providerName];
    if (!provider) continue;

    try {
      const result = await provider.generate(prompt);
      return result;
    } catch (err) {
      console.error(`Provider ${providerName} failed:`, err.message);
      errors.push({ provider: providerName, error: err.message });
    }
  }

  throw new Error(`All providers failed: ${JSON.stringify(errors)}`);
}

module.exports = { generateWithFallback };
