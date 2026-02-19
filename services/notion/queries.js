// services/notion/queries.js

const { notion, withRetry } = require("./client");

async function createPage({ databaseId, properties }) {
  return withRetry(() =>
    notion.pages.create({
      parent: { database_id: databaseId },
      properties,
    })
  );
}

async function updatePage({ pageId, properties }) {
  return withRetry(() =>
    notion.pages.update({
      page_id: pageId,
      properties,
    })
  );
}

async function queryDatabase({ databaseId, filter }) {
  return withRetry(() =>
    notion.databases.query({
      database_id: databaseId,
      filter,
    })
  );
}

module.exports = {
  createPage,
  updatePage,
  queryDatabase,
};
