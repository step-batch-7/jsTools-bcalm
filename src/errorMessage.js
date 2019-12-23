const displayDelimiterError = function() {
  return "cut: bad delimiter";
};

const noFileMessage = function(fileName) {
  return `cut: ${fileName}: No such file or directory`;
};

const optionError = function() {
  return "usage: cut -b list [-n] [file ...]\ncut -c list [file ...]\ncut -f list [-s] [-d delim] [file ...]";
};

module.exports = { noFileMessage, optionError, displayDelimiterError };
