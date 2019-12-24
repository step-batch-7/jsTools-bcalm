const { stdin, stdout } = process;
const utils = require("./utils.js");

const getStructure = function(lines, delimiter, fieldValue) {
  const range = utils.createRange(fieldValue);
  const formatLines = lines.split(delimiter);
  if (formatLines.length == 1) return lines;
  const desiredFields = range.map(element => formatLines[element - 1]);
  return desiredFields.filter(element => element).join(delimiter);
};

const displayMessage = function(data, options, showResult) {
  const lines = utils.getLines(data);
  const contents = lines.map(line =>
    getStructure(line, options.delimiter, options.fieldValue)
  );
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
  performAction,
  getStructure
};
