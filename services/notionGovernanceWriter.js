// services/notionClient.js

const { Client } = require("@notionhq/client");

if (!process.env.NOTION_API_TOKEN) {
  throw new Error("Missing NOTION_API_TOKEN");
}

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

module.exports = notion;
