// services/notion/governanceWriter.js

const { createPage } = require("./queries");

const GOVERNANCE_DB_ID = process.env.NOTION_GOVERNANCE_DB;

if (!GOVERNANCE_DB_ID) {
  throw new Error("Missing NOTION_GOVERNANCE_DB in environment");
}

async function writeGovernanceEntry({ properties }) {
  return createPage({
    databaseId: GOVERNANCE_DB_ID,
    properties,
  });
}

module.exports = {
  writeGovernanceEntry,
};
