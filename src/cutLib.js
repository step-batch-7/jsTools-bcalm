const parseInput = function(commandLineArgs) {
  const command = {};
  command.delimiter = commandLineArgs[commandLineArgs.indexOf("-d") + 1];
  command.fieldValue = commandLineArgs[commandLineArgs.indexOf("-f") + 1];
  command.filePath = commandLineArgs[commandLineArgs.length - 1];
  return command;
};

const isFileExists = function(filePath, exists) {
  return exists(filePath);
};

const loadContents = function(filePath, reader) {
  return reader(filePath, "utf8");
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

module.exports = {
  formatMessage,
  displayMessage,
  getStructuredContents,
  loadContents,
  isFileExists,
  parseInput
};
