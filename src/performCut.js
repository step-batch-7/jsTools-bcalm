const {parseInput} = require('./parseInput.js');

const getFieldValueError = () => 'cut: [-cf] list: illegal list value';
const getDelimiterError = () => 'cut: bad delimiter';
const getOptionError = () => 'usage: cut -f list [-s] [-d delim] [file ...]';

const isInteger = function(values) {
  const range = getFieldRange(values);
  return range.every(field => Number.isInteger(+field));
};

const whichError = function(cmdLineArgs, options) {
  if (!cmdLineArgs.includes('-f')) {
    return getOptionError();
  }

  const expectedDelimiterLength = 1;

  if (options.delimiter.length !== expectedDelimiterLength) {
    return getDelimiterError();
  }

  if (!isInteger(options.fieldValue)) {
    return getFieldValueError();
  }
};

const getFieldRange = function(fieldValue) {
  return fieldValue.split(',');
};

const cutLines = function(line, delimiter, fieldValue) {
  const range = getFieldRange(fieldValue);
  const fields = line.split(delimiter);
  const lineLength = 1;
  if (fields.length === lineLength) {
    return line;
  }
  const index = 1;
  const desiredFields = range.map(element => fields[element - index]);  
  return desiredFields.filter(element => element).join(delimiter);
};

const getFormattedResult = function(fileContent, options, showResult) {
  const lines = fileContent.split('\n');
  const {delimiter, fieldValue} = options;
  const contents = lines.map(line => cutLines(line, delimiter, fieldValue));
  const result = contents.join('\n');
  showResult({output: result, error: ''});
};

const loadStreamLine = function(inputStream, options, showResult){
  const errorMessages = {
    ENOENT: `cut: ${options.fileName}: No such file or directory`,
    EISDIR: `cut: Error reading ${options.fileName}`,
    EACCES: 'Permission denied'
  };
  inputStream.on('data', data => {
    let userInput = '';
    userInput += data;
    getFormattedResult(userInput, options, showResult);
  });

  inputStream.on('error', err => {
    showResult({error: errorMessages[err.code], output: ''});
  });
};
 
const getInputStream = function(streams, fileName){
  let inputStream = streams.stdin;
  if(fileName){
    inputStream = streams.fileStream(fileName);
  }
  return inputStream;
};

const cut = function(cmdLineArgs, showResult, inputStream) {
  const options = parseInput(cmdLineArgs);
  const isValid = whichError(cmdLineArgs, options);
  if (isValid) {
    showResult({error: isValid, output: ''});
    return;
  }
  loadStreamLine(inputStream, options, showResult);
};

module.exports = {
  getFormattedResult,
  cut,
  cutLines,
  isInteger,
  whichError,
  loadStreamLine,
  getInputStream
};
