const {
  validateUserArgs,
  parseInput,
  getLines,
  createRange
} = require("./utils.js");

const cutLines = function(line, delimiter, fieldValue) {
  const range = createRange(fieldValue);
  const getFields = line.split(delimiter);
  if (getFields.length == 1) return line;
  const desiredFields = range.map(element => getFields[element - 1]);
  return desiredFields.filter(element => element).join(delimiter);
};

const displayMessage = function(fileContent, options, showResult) {
  const lines = getLines(fileContent);
  const contents = lines.map(line =>
    cutLines(line, options.delimiter, options.fieldValue)
  );
  const message = contents.join("\n");
  showResult({ output: message, error: "" });
};

const loadFileLines = function(reader, options, showResult) {
  const errorMessages = {
    ENOENT: `cut: ${options.fileName}: No such file or directory`,
    EISDIR: `cut: Error reading ${options.fileName}`
  };
  reader(options.fileName, "utf8", (err, fileContent) => {
    if (err) {
      showResult({
        error: errorMessages[err.code],
        output: ""
      });
      return;
    }
    displayMessage(fileContent, options, showResult);
  });
};

const performAction = function(reader, cmdLineArgs, showResult) {
  const options = parseInput(cmdLineArgs);
  const validation = validateUserArgs(cmdLineArgs, options);
  if (validation.isError) {
    showResult({ error: validation.errorMessage, output: "" });
    return;
  }
  loadFileLines(reader, options, showResult);
};

module.exports = {
  displayMessage,
  performAction,
  cutLines,
  loadFileLines
};
