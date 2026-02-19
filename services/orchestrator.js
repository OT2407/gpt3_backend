const gpt1 = require("./gpt1Service");
const gpt2 = require("./gpt2Service");
const gpt3 = require("./gpt3Service");

async function runPipeline(userInput) {
  console.log("Stage 1: Decision");
  const decision = await gpt1.decide(userInput);

  console.log("Stage 2: Execution");
  const execution = await gpt2.execute(decision);

  console.log("Stage 3: Audit");
  const audit = await gpt3.audit(execution);

  return {
    decision,
    execution,
    audit
  };
}

module.exports = { runPipeline };
