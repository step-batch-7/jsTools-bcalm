const displayError = function(fileName) {
  const error = {};
  error.fileError = `cut: ${fileName}: No such file or directory`;
  error.delimiterError = "cut: bad delimiter";
  error.optionError =
    "usage: cut -b list [-n] [file ...]\ncut -c list [file ...]\ncut -f list [-s] [-d delim] [file ...]";
  return error;
};

const validateUserArgs = function(cmdLineArgs, options, fileFunctions) {
  const error = displayError(options.fileName);
  const result = cmdLineArgs.map(e => e.match(/^-f.*/g));

  if (!result.some(element => element != null))
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

const getLines = function(fileContents) {
  return fileContents.split("\n");
};

const createRange = function(fieldValue) {
  return fieldValue.split(",");
};

module.exports = {
  displayError,
  validateUserArgs,
  parseInput,
  getLines,
  createRange
};