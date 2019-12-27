const fs = require("fs");
const cut = require("./src/cutLib.js").cut;

const main = function() {
  const cmdLineArgs = process.argv.slice(2);
  const showResult = function(message) {
    process.stdout.write(message.output);
    process.stderr.write(message.error);
  };
  cut(fs.readFile, cmdLineArgs, showResult);
};

main();
