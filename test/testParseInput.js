const assert = require('chai').assert;
const {OptionParser} = require('../src/parseInput.js');

describe('#OptionParser', () => {
  describe('#parser', () => {
    
    it('should give a object which includes all options and their values', () => {
      const cmdLineArgs = ['-d', 'e', '-f', '1', 'one.txt'];
      const options = new OptionParser({'-d': 'delimiter', '-f': 'fieldValue'});
      const actual = options.parse(cmdLineArgs);
      const expected = {delimiter: 'e', fieldValue: '1', fileName: 'one.txt'};
      assert.deepStrictEqual(actual, expected);
    });
    
    it('should give undefined if file is not given', () => {
      const cmdLineArgs = ['-d', 'e', '-f', '1'];
      const options = new OptionParser({'-d': 'delimiter', '-f': 'fieldValue'});
      const actual = options.parse(cmdLineArgs);
      const expected = {delimiter: 'e', fieldValue: '1', fileName: undefined};
      assert.deepStrictEqual(actual, expected);
    });
  });
});
  
