const { updateHealthSummary } = require("./notionGovernanceWriter");

async function audit(executionResult) {
  const valid = executionResult.status === "COMPLETED";

  const auditResult = {
    auditStatus: valid ? "PASS" : "FAIL",
    reviewedOutput: executionResult.processed,
    timestamp: Date.now()
  };

  // 🔐 Write audit summary to Notion
  const summaryText = `
Status: ${auditResult.auditStatus}
Output: ${auditResult.reviewedOutput}
Time: ${new Date(auditResult.timestamp).toISOString()}
  `;

  try {
    await updateHealthSummary(summaryText);
    console.log("Governance updated in Notion.");
  } catch (err) {
    console.error("Governance write failed:", err.message);
  }

  return auditResult;
}

module.exports = { audit };
