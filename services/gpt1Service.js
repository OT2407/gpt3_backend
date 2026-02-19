async function decide(userInput) {
  return {
    taskType: "MOCK_TASK",
    objective: userInput,
    instructions: "Execute mock processing"
  };
}

module.exports = { decide };
