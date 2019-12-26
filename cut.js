const fs = require("fs");
const executeCut = require("./src/cutLib.js").executeCut;

const main = function() {
  const cmdLineArgs = process.argv.slice(2);
  const showResult = function(message) {
    process.stdout.write(message.output);
    process.stderr.write(message.error);
  };
  executeCut(fs.readFile, cmdLineArgs, showResult);
};

main();
