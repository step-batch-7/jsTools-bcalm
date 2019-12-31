const assert = require('chai').assert;
const {parseInput, getOptions} = require('../src/parseInput.js');

describe('#parseInput', () => {
  it('should give a object which includes all options and their values', () => {
    const cmdLineArgs = ['-d', 'e', '-f', '1', 'one.txt'];
    const actual = parseInput(cmdLineArgs);
    const expected = {delimiter: 'e', fieldValue: '1', fileName: 'one.txt'};
    assert.deepStrictEqual(actual, expected);
  });

  it('should give undefined if file is not given', () => {
    const cmdLineArgs = ['-d', 'e', '-f', '1'];
    const actual = parseInput(cmdLineArgs);
    const expected = {delimiter: 'e', fieldValue: '1', fileName: undefined};
    assert.deepStrictEqual(actual, expected);
  });
});

describe('#getOptions', () => {
  it('should give array which includes option', () => {
    const actual = getOptions([], '-d');
    const expected = ['-d'];
    assert.deepStrictEqual(actual, expected);
  });

  it('should make pair of options and their values', () => {
    const actual = getOptions(['-d'], '1');
    const expected = [['-d', '1']];
    assert.deepStrictEqual(actual, expected);
  });

  it('should not make pair of given element if it is not an option', () => {
    const actual = getOptions([['-d', '1']], 'hello.txt');
    const expected = [['-d', '1']];
    assert.deepStrictEqual(actual, expected);
  });
});
