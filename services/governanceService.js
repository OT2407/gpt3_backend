// services/governanceService.js

const { analyzeArchitectureDiff } = require("./gptGovernanceAnalyzer");
const { writeGovernanceEntry } = require("./notion");
const crypto = require("crypto");

function bumpVersion(currentVersion, severity) {
  const [major, minor, patch] = (currentVersion || "0.0.0")
    .split(".")
    .map(n => Number(n) || 0);

  switch (severity) {
    case "MAJOR":
      return `${major + 1}.0.0`;
    case "MINOR":
      return `${major}.${minor + 1}.0`;
    case "PATCH":
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

function buildTitle({ severity, risk, scope }) {
  return `GPT Analysis — severity:${severity}, risk:${risk}, scope:${scope}`;
}

function selectProperty(name) {
  return { select: { name } };
}

function textProperty(content) {
  return {
    rich_text: [
      {
        type: "text",
        text: { content: String(content) },
      },
    ],
  };
}

async function initializeGovernance() {
  const simulatedDiff = {
    changedFiles: ["routes/testRoute.js"],
    addedDependencies: [],
    removedDependencies: [],
    environmentChanges: [],
  };

  let analysis;

  try {
    analysis = await analyzeArchitectureDiff(simulatedDiff);
  } catch (err) {
    console.warn("AI analysis failed, using fallback.");
    analysis = {
      severity: "PATCH",
      risk_score: 2,
      impact_scope: "LOCAL",
      confidence: "LOW",
    };
  }

  const currentVersion = process.env.AI_STACK_VERSION || "3.0.0";
  const newVersion = bumpVersion(currentVersion, analysis.severity);

  console.log("Architecture change detected.");
  console.log(
    "Severity:",
    analysis.severity,
    "Risk:",
    analysis.risk_score,
    "Scope:",
    analysis.impact_scope
  );

  await writeGovernanceEntry({
    properties: {
      AI_STACK_VERSION: {
        title: [
          {
            type: "text",
            text: { content: newVersion },
          },
        ],
      },

      LAST_HEALTH_SUMMARY: textProperty(
        buildTitle({
          severity: analysis.severity,
          risk: analysis.risk_score,
          scope: analysis.impact_scope,
        })
      ),

      CHANGE_SEVERITY: selectProperty(
        capitalize(analysis.severity)
      ),

      RISK_SCORE: {
        number: Number(analysis.risk_score),
      },

      IMPACT_SCOPE: selectProperty(
        analysis.impact_scope
      ),

      UPDATED_BY: textProperty("Governance Engine"),

      SNAPSHOT_ID: textProperty(crypto.randomUUID()),

      CONFIDENCE_LEVEL: selectProperty(
        analysis.confidence
      ),
    },
  });

  console.log(`Governance: Auto-approved → Version ${newVersion}`);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = {
  initializeGovernance,
};
