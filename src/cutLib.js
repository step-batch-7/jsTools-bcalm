const error = require("./errorMessage");

const parseInput = function(commandLineArgs) {
  const command = {};
  const args = commandLineArgs.map(e => e.split(""));
  const options = args.flat(Infinity);
  command.delimiter = options[options.indexOf("d") + 1];
  command.fieldValue = options[options.indexOf("f") + 1];
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
  if (!isFileExists(options.fileName, fileFunctions.existsFile)) {
    return error.noFileMessage(options.fileName);
  }
  const contents = loadContents(options.fileName, fileFunctions.readFile);
  const structuredContent = getStructuredContents(contents);
  const format = formatMessage(structuredContent, options.delimiter);
  return displayMessage(format, options.fieldValue);
};

module.exports = {
  formatMessage,
  displayMessage,
  getStructuredContents,
  loadContents,
  isFileExists,
  parseInput,
  performAction
};
