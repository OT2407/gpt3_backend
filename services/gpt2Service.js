async function execute(decision) {
  return {
    status: "COMPLETED",
    processed: decision.objective.toUpperCase(),
    metadata: {
      executionTime: Date.now()
    }
  };
}

module.exports = { execute };
