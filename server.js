require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const { notion } = require("./services/notion/client");
const { initializeGovernance } = require("./services/governanceService");
const { testGitHubConnection } = require("./services/githubService");

async function startServer() {
  console.log("Environment validation passed.");

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  try {
    const testRoute = require("./routes/testRoute");
    app.use("/", testRoute);
  } catch (err) {
    console.warn("testRoute not found or failed to load:", err.message);
  }

  app.get("/", (req, res) => {
    res.send("Server is running.");
  });

  app.get("/notion-page/:pageId", async (req, res) => {
    try {
      const response = await notion.pages.retrieve({
        page_id: req.params.pageId,
      });
      res.json(response);
    } catch (error) {
      console.error("Error fetching page:", error.body || error);
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.get("/debug/notion-db/:databaseId", async (req, res) => {
    try {
      const response = await notion.databases.retrieve({
        database_id: req.params.databaseId,
      });
      res.json(response.properties);
    } catch (error) {
      console.error("Error retrieving DB:", error.body || error);
      res.status(500).json({ error: "Failed to retrieve database schema" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    initializeGovernance().catch(err =>
      console.warn("Governance background failure:", err.message)
    );

    testGitHubConnection().catch(err =>
      console.warn("GitHub background failure:", err.message)
    );
  });
}

startServer().catch(err => {
  console.error("Startup blocked:", err.message);
  process.exit(1);
});
