const fs = require('fs');
const {cut, getInputStream} = require('./src/cutLib.js');
const { stdin } = process;

const main = function() {
  const [,, ...cmdLineArgs] = process.argv;
  const showResult = function(message) {
    process.stdout.write(message.output);
    process.stderr.write(message.error);
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
