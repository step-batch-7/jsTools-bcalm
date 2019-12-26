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

const loadFileLines = function(reader, options, showResult) {
  const errorMessages = {
    ENOENT: `cut: ${options.fileName}: No such file or directory`,
    EISDIR: `cut: Error reading ${options.fileName}`
  };
  reader(options.fileName, "utf8", (err, data) => {
    if (err) {
      showResult({
        error: errorMessages[err.code],
        output: ""
      });
      return;
    }
    displayMessage(data, options, showResult);
  });
};

const performAction = function(reader, cmdLineArgs, showResult) {
  const options = utils.parseInput(cmdLineArgs);
  const validation = utils.validateUserArgs(cmdLineArgs, options, reader);
  if (validation.isError) {
    showResult({ error: validation.errorMessage, output: "" });
    return;
  }
  loadFileLines(reader, options, showResult);
};

module.exports = {
  displayMessage,
  performAction,
  getStructure,
  loadFileLines
};
