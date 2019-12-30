const fs = require('fs');
const cut = require('./src/cutLib.js').cut;
const { stdin } = process;

const main = function() {
  const [,, ...cmdLineArgs] = process.argv;
  const showResult = function(message) {
    process.stdout.write(message.output);
    process.stderr.write(message.error);
  };
  cut(cmdLineArgs, showResult, stdin, fs.readFile);
};

main();
