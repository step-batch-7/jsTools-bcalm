const fs = require("fs");
const performAction = require("./src/cutLib.js").performAction;

const showResult = function(message) {
  process.stdout.write(message.output);
  process.stderr.write(message.error);
};

const main = function() {
  const cmdLineArgs = process.argv.slice(2);
  performAction(fs.readFile, cmdLineArgs, showResult);
};

main();
