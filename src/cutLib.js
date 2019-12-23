const error = require("./errorMessage");

const validateUserArgs = function(cmdLineArgs, options) {
  const result = cmdLineArgs.map(e => e.match(/^-f.*/g));
  if (!result.some(e => e != null))
    return { isError: true, errorMessage: error.optionError() };
  if (options.delimiter.length != 1)
    return { isError: true, errorMessage: error.displayDelimiterError() };
  return { isError: false, errorType: null };
};

const parseInput = function(commandLineArgs) {
  const command = {};
  command.delimiter = commandLineArgs[commandLineArgs.indexOf("-d") + 1];
  command.fieldValue = commandLineArgs[commandLineArgs.indexOf("-f") + 1];
  command.fileName = commandLineArgs[commandLineArgs.length - 1];
  return command;
};

const isFileExists = function(fileName, exists) {
  return exists(fileName);
};

const loadContents = function(fileName, reader) {
  return reader(fileName, "utf8");
};

const getStructuredContents = function(fileContents) {
  const data = fileContents.split("\n");
  return data.map(e => [e]);
};

const formatMessage = function(fileContents, delimiter) {
  return fileContents.map(line => line[0].split(delimiter));
};

const displayMessage = function(content, number) {
  const message = content.map(text => text[number - 1]);
  return message.join("\n");
};

const performAction = function(fileFunctions, cmdLineArgs) {
  const options = parseInput(cmdLineArgs);
  const validationMessage = validateUserArgs(cmdLineArgs, options);
  if (validationMessage.isError)
    return { error: validationMessage.errorMessage, output: "" };
  if (!isFileExists(options.fileName, fileFunctions.existsFile)) {
    return { error: error.noFileMessage(options.fileName), output: "" };
  }
  const contents = loadContents(options.fileName, fileFunctions.readFile);
  const structuredContent = getStructuredContents(contents);
  const message = formatMessage(structuredContent, options.delimiter);
  return { output: displayMessage(message, options.fieldValue), error: "" };
};

module.exports = {
  formatMessage,
  displayMessage,
  getStructuredContents,
  loadContents,
  isFileExists,
  parseInput,
  performAction,
  validateUserArgs
};
