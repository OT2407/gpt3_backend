// services/notion/client.js

const { Client } = require("@notionhq/client");

if (!process.env.NOTION_API_KEY) {
  throw new Error("Missing NOTION_API_KEY in environment");
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function withRetry(fn, retries = 3) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    return withRetry(fn, retries - 1);
  }
}

module.exports = {
  notion,
  withRetry,
};
