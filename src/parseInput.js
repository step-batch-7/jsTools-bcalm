const getOptions = function(context, element) {
  if (element.startsWith("-")) {
    context.push(element);
    return context;
  }

  if (Array.isArray(context[context.length - 1])) return context;

  if (context[context.length - 1].startsWith("-")) {
    const previousElement = context.pop();
    context.push([previousElement, element]);
  }
  return context;
};

const parseInput = function(commandLineArgs) {
  const options = commandLineArgs.reduce(getOptions, []);
  const lookup = { "-d": "delimiter", "-f": "fieldValue" };

  const commandOptions = options.reduce((context, option) => {
    context[lookup[option[0]]] = option[1];
    return context;
  }, {});

  commandOptions.fileName = commandLineArgs[4] || "";
  return commandOptions;
};

module.exports = { parseInput };
