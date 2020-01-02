const getOptions = function(options, cmdLineArg) {
  if (cmdLineArg.startsWith('-')) {
    options.push(cmdLineArg);
    return options;
  }
  const index = 1;
  const lastElementIndex = options.length - index;
  if (Array.isArray(options[lastElementIndex])) {
    return options;
  }

  const previousElement = options.pop();
  options.push([previousElement, cmdLineArg]);
  return options;
};

const parseInput = function(commandLineArgs) {
  const optionIndex = 0;
  const optionArgIndex = 1;
  const options = commandLineArgs.reduce(getOptions, []);
  const lookup = {'-d': 'delimiter', '-f': 'fieldValue'};

  const commandOptions = options.reduce((commandOption, option) => {
    commandOption[lookup[option[optionIndex]]] = option[optionArgIndex];
    return commandOption;
  }, {});

  const fileIndex = 4;
  commandOptions.fileName = commandLineArgs[fileIndex];
  return commandOptions;
};

module.exports = {parseInput, getOptions};
