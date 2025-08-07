class CongratsReporter {
  onRunComplete(_, results) {
    const groups = {
      stateStyling: [],
    };

    for (const testResult of results.testResults) {
      const filePath = testResult.testFilePath.toLowerCase();

      if (filePath.includes("state-styling.test.js")) {
        groups.stateStyling.push(testResult);
      }
    }

    for (const [groupName, tests] of Object.entries(groups)) {
      const allPassed = tests.every((t) => t.numFailingTests === 0);
      if (tests.length > 0 && allPassed) {
        console.log(
          `\n\x1b[32m🎉 Congratulations! Well done for finishing all tests and tasks in: ${groupName}🎉\x1b[0m\n`
        );
      }
    }
  }
}

module.exports = CongratsReporter;
