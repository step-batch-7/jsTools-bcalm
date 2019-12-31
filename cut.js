const fs = require('fs');
const {cut, getInputStream} = require('./src/performCut.js');
const {stdin} = process;

const main = function() {

  const [, , ...cmdLineArgs] = process.argv;
  const showResult = function(result) {
    process.stdout.write(result.output);
    process.stderr.write(result.error);
  };
  const streams = {
    fileStream: fs.createReadStream,
    stdin
  };
  const fileNameIndex = 4;
  const inputStream = getInputStream(streams, cmdLineArgs[fileNameIndex]);
  cut(cmdLineArgs, showResult, inputStream );
};

main();
