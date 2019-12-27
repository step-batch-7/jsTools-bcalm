const getOptions = function(option, cmdLineArg) {
  if (cmdLineArg.startsWith("-")) {
    option.push(cmdLineArg);
    return option;
  }

  if (Array.isArray(option[option.length - 1])) return option;

  if (option[option.length - 1].startsWith("-")) {
    const previousElement = option.pop();
    option.push([previousElement, cmdLineArg]);
  }
  return option;
};

const parseInput = function(commandLineArgs) {
  const options = commandLineArgs.reduce(getOptions, []);
  const lookup = { "-d": "delimiter", "-f": "fieldValue" };

  const commandOptions = options.reduce((commandOption, option) => {
    commandOption[lookup[option[0]]] = option[1];
    return commandOption;
  }, {});

  commandOptions.fileName = commandLineArgs[4];
  return commandOptions;
};

module.exports = { parseInput };
