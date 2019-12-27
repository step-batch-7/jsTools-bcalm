const getError = function(fileName) {
  const error = {};
  error.delimiterError = "cut: bad delimiter";
  error.fieldValueError = "cut: [-cf] list: illegal list value";
  error.optionError =
    "usage: cut -b list [-n] [file ...]\ncut -c list [file ...]\ncut -f list [-s] [-d delim] [file ...]";
  return error;
};

const isInteger = function(values) {
  const range = getFieldRange(values);
  return range.every(field => Number.isInteger(+field));
};

const whichError = function(cmdLineArgs, options) {
  const error = getError(options.fileName);
  if (!cmdLineArgs.includes("-f")) return error.optionError;
  if (options.delimiter.length != 1) return error.delimiterError;
  if (!isInteger(options.fieldValue)) return error.fieldValueError;
};

const parseInput = function(commandLineArgs) {
  const command = {};
  command.delimiter = commandLineArgs[commandLineArgs.lastIndexOf("-d") + 1];
  command.fieldValue = commandLineArgs[commandLineArgs.lastIndexOf("-f") + 1];
  command.fileName = commandLineArgs[4] || "";
  return command;
};

const getFieldRange = function(fieldValue) {
  return fieldValue.split(",");
};

const cutLines = function(line, delimiter, fieldValue) {
  const range = getFieldRange(fieldValue);
  const getFields = line.split(delimiter);
  if (getFields.length == 1) return line;
  const desiredFields = range.map(element => getFields[element - 1]);
  return desiredFields.filter(element => element).join(delimiter);
};

const displayResult = function(fileContent, options, showResult) {
  const lines = fileContent.split("\n");
  const contents = lines.map(line => cutLines(line, options.delimiter, options.fieldValue));
  const message = contents.join("\n");
  showResult({ output: message, error: "" });
};

const onCompletion = function(errorMessages, showResult, options) {
  return (err, fileContent) => {
    if (err) {
      showResult({ error: errorMessages[err.code], output: "" });
      return;
    }
    displayResult(fileContent, options, showResult);
  };
};

const loadFileLines = function(reader, options, showResult) {
  const errorMessages = {
    ENOENT: `cut: ${options.fileName}: No such file or directory`,
    EISDIR: `cut: Error reading ${options.fileName}`
  };
  reader(options.fileName, "utf8", onCompletion(errorMessages, showResult, options));
};

const cut = function(reader, cmdLineArgs, showResult) {
  const options = parseInput(cmdLineArgs);
  const validation = whichError(cmdLineArgs, options);
  if (validation) {
    showResult({ error: validation, output: "" });
    return;
  }
  loadFileLines(reader, options, showResult);
};

module.exports = {
  displayResult,
  cut,
  cutLines,
  loadFileLines,
  getError,
  whichError,
  parseInput,
  getFieldRange,
  isInteger
};
