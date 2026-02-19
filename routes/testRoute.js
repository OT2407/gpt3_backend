// routes/testRoute.js
const express = require("express");
const router = express.Router();

router.get("/test-pipeline", (req, res) => {
  const input = req.query.input || "hello world";
  const processed = input.toUpperCase();
  const out = {
    decision: { taskType: "MOCK_TASK", objective: input, instructions: "Execute mock processing" },
    execution: { status: "COMPLETED", processed, metadata: { executionTime: Date.now() } },
    audit: { auditStatus: "PASS", reviewedOutput: processed, timestamp: Date.now() },
  };
  res.json(out);
});

module.exports = router;
