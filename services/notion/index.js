// services/notion/index.js

const { writeGovernanceEntry } = require("./governanceWriter");
const { queryDatabase } = require("./queries");

module.exports = {
  writeGovernanceEntry,
  queryDatabase,
};
