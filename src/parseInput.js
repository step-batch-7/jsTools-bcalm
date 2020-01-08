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

class OptionParser {
  constructor(optionLookup) {
    this.optionLookup = optionLookup;
  }
  parse(commandLineArgs) {
    const optionIndex = 0;
    const optionArgIndex = 1;
    const options = commandLineArgs.reduce(getOptions, []);
    const commandOptions = options.reduce((option, options) => {
      option[this.optionLookup[options[optionIndex]]] = options[optionArgIndex];
      return option;
    }, {});

    const fileIndex = 4;
    commandOptions.fileName = commandLineArgs[fileIndex];
    return commandOptions;
  }
}

module.exports = {OptionParser, getOptions};
