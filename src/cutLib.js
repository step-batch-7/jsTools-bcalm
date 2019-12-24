const utils = require("./utils.js");

const displayMessage = function(data, options, showResult) {
  const lines = utils.getLines(data);
  const formatLines = lines.map(line => line[0].split(options.delimiter));
  const contents = formatLines.map(text => text[options.fieldValue - 1]);
  const message = contents.join("\n");
  showResult({ output: message, error: "" });
};

const performAction = function(fileFunc, cmdLineArgs, showResult) {
  const options = utils.parseInput(cmdLineArgs);
  const validation = utils.validateUserArgs(cmdLineArgs, options, fileFunc);
  if (validation.isError) {
    showResult({ error: validation.errorMessage, output: "" });
    return;
  }
  fileFunc.readFile(options.fileName, "utf8", (err, data) => {
    displayMessage(data, options, showResult);
  });
};

module.exports = {
  displayMessage,
  performAction
};
