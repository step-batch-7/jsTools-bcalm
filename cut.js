const fs = require("fs");
const performAction = require("./src/cutLib.js").performAction;

const main = function() {
  const cmdLineArgs = process.argv.slice(2);
  const fileFunction = { readFile: fs.readFileSync, existsFile: fs.existsSync };
  const message = performAction(fileFunction, cmdLineArgs);
  process.stdout.write(message.output);
  process.stderr.write(message.error);
};

main();
