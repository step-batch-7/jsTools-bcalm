const getOptions = function(option, cmdLineArg) {
  if (cmdLineArg.startsWith('-')) {
    option.push(cmdLineArg);
    return option;
  }
  const lastElementIndex = 1;
  if (Array.isArray(option[option.length - lastElementIndex])) {return option;}

  const previousElement = option.pop();
  option.push([previousElement, cmdLineArg]);
  return option;
};

const parseInput = function(commandLineArgs) {
  const optionIndex = 0;
  const optionArgIndex = 1;
  const options = commandLineArgs.reduce(getOptions, []);
  const lookup = { '-d': 'delimiter', '-f': 'fieldValue' };

  const commandOptions = options.reduce((commandOption, option) => {
    commandOption[lookup[option[optionIndex]]] = option[optionArgIndex];
    return commandOption;
  }, {});

  const fileIndex = 4;
  commandOptions.fileName = commandLineArgs[fileIndex];
  return commandOptions;
};

module.exports = { parseInput, getOptions };
