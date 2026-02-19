// services/githubService.js
require("dotenv").config();
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function testGitHubConnection() {
  try {
    const { data } = await octokit.users.getAuthenticated();
    console.log("✅ GitHub Authenticated as:", data.login);
    return data;
  } catch (error) {
    // Throw so background caller can catch and log; do not crash server
    console.error("❌ GitHub Auth Failed:", error.message || error);
    throw new Error("GitHub Auth Failed: " + (error.message || "unknown"));
  }
}

module.exports = {
  octokit,
  testGitHubConnection,
};
