const isOption = function (argument) {
  return argument.startsWith('-');
  
};

const getKey = function (options) {
  const key = Object.keys(options).find(value => options[value] === null);
  return key;
};

class OptionParser {
  constructor(optionLookup) {
    this.optionLookup = optionLookup;
  }
  parse(commandLineArgs) {
    const options = commandLineArgs.reduce((options, option) => {
      const key = getKey(options, option);

      if (key) {
        options[key] = option;
      }

      if (isOption(option)) {
        options[this.optionLookup[option] || option] = null;
      }

      return options;
    }, {});

    const fileIndex = 4;
    options.fileName = commandLineArgs[fileIndex];
    return options;
  }
}

module.exports = {OptionParser};
