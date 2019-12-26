const displayError = function(fileName) {
  const error = {};
  error.fileError = `cut: ${fileName}: No such file or directory`;
  error.delimiterError = "cut: bad delimiter";
  error.optionError =
    "usage: cut -b list [-n] [file ...]\ncut -c list [file ...]\ncut -f list [-s] [-d delim] [file ...]";
  return error;
};

const validateUserArgs = function(cmdLineArgs, options) {
  const error = displayError(options.fileName);
  if (!cmdLineArgs.includes("-f"))
    return { isError: true, errorMessage: error.optionError };

  if (options.delimiter.length != 1)
    return { isError: true, errorMessage: error.delimiterError };

  return { isError: false, errorType: null };
};

const parseInput = function(commandLineArgs) {
  const command = {};
  command.delimiter = commandLineArgs[commandLineArgs.indexOf("-d") + 1];
  command.fieldValue = commandLineArgs[commandLineArgs.indexOf("-f") + 1];
  command.fileName = commandLineArgs[4] || "";
  return command;
};

const createRange = function(fieldValue) {
  return fieldValue.split(",");
};

const cutLines = function(line, delimiter, fieldValue) {
  const range = createRange(fieldValue);
  const getFields = line.split(delimiter);
  if (getFields.length == 1) return line;
  const desiredFields = range.map(element => getFields[element - 1]);
  return desiredFields.filter(element => element).join(delimiter);
};

const displayResult = function(fileContent, options, showResult) {
  const lines = fileContent.split("\n");
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
    displayResult(fileContent, options, showResult);
  });
};

const executeCut = function(reader, cmdLineArgs, showResult) {
  const options = parseInput(cmdLineArgs);
  const validation = validateUserArgs(cmdLineArgs, options);
  if (validation.isError) {
    showResult({ error: validation.errorMessage, output: "" });
    return;
  }
  loadFileLines(reader, options, showResult);
};

module.exports = {
  displayResult,
  executeCut,
  cutLines,
  loadFileLines,
  displayError,
  validateUserArgs,
  parseInput,
  createRange
};
