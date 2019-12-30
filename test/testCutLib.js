const assert = require('chai').assert;
const {Readable} = require('stream');
const cut = require('../src/cutLib.js');
const EventEmitter = require('events').EventEmitter;

describe('#getResult', () => {
  it('should display the cut content of each line', () => {
    const showResult = result => {
      assert.strictEqual(result.output, 'h\nhow ar');
      assert.strictEqual(result.error, '');
    };
    const data = 'hello\nhow are you';
    const options = { delimiter: 'e', fileName: 'todo.txt', fieldValue: '1' };
    cut.getResult(data, options, showResult);
  });
});

describe('#cut', () => {
  it('should give the specific field of each line of given file', done => {
    const cmdLineArgs = ['-d', 'e', '-f', '1', 'todo.txt'];
    const streams = new EventEmitter();
    const showResult = result => {
      assert.strictEqual(result.output, 'h\nhow ar');
      assert.strictEqual(result.error, '');
      done();
    };
    cut.cut(cmdLineArgs, showResult, streams);
    streams.emit('data', 'hello\nhow are you');
  });


  it('should give delimiter error if bad delimiter is given', () => {
    const streams = null;
    const cmdLineArgs = ['-d', '', '-f', '1', 'todo.txt'];
    const showResult = result => {
      assert.strictEqual(result.output, '');
      assert.strictEqual(result.error, 'cut: bad delimiter');
    };
    cut.cut(cmdLineArgs, showResult, streams);
  });

  it('should give file error if file is not present ', done => {
    const streams = new EventEmitter();
    const cmdLineArgs = ['-d', 'e', '-f', '1', 'todo.txt'];
    const showResult = result => {
      assert.strictEqual(result.output, '');
      const expectedError = 'cut: todo.txt: No such file or directory';
      assert.strictEqual(result.error, expectedError);
      done();
    };
    cut.cut(cmdLineArgs, showResult, streams);
    streams.emit('error', {code: 'ENOENT'});
  });

  it('should give option error if field is not specified', () => {
    const streams = null;
    const cmdLineArgs = ['-d', 'e', 'todo.txt'];
    const showResult = result => {
      assert.strictEqual(result.output, '');
      assert.strictEqual(
        result.error,
        'usage: cut -f list [-s] [-d delim] [file ...]'
      );
    };
    cut.cut(cmdLineArgs, showResult, streams);
  });

  it('should given specific field for stdin', done => {
    const cmdLineArgs = ['-d', ',', '-f', '1'];
    let count = 0;
    const showResult = function(result) {
      count++;
      assert.deepStrictEqual(result, { output: 'a\n', error: '' });
      done();
    };
    const stdinStream = new EventEmitter();
    cut.cut(cmdLineArgs, showResult, stdinStream);
    stdinStream.emit('data', 'a,b\n');
    const expectedCount = 1;
    assert.strictEqual(count, expectedCount);
  });
});

describe('#cutLines', () => {
  it('should give content after separating fields', () => {
    const lines = 'hello\nI';
    const actual = cut.cutLines(lines, 'e', '2');
    const expected = 'llo\nI';
    assert.deepStrictEqual(actual, expected);
  });

  it('should give content if separating fields are more than one', () => {
    const lines = 'hello\nI';
    const actual = cut.cutLines(lines, 'e', '1,2');
    const expected = 'hello\nI';
    assert.deepStrictEqual(actual, expected);
  });
});


describe('#whichError', () => {
  it('should give option error if field is not given', () => {
    const cmdLineArgs = ['-d', 'e', '1', 'todo.txt'];
    const options = { fileName: 'todo.txt', fieldValue: '1' };

    const actual = cut.whichError(cmdLineArgs, options);
    const expected =
      'usage: cut -f list [-s] [-d delim] [file ...]';
    assert.strictEqual(actual, expected);
  });

  it('should give delimiter error if delimiter is null', () => {
    const options = { delimiter: '', fileName: 'todo.txt' };
    const cmdLineArgs = ['-d', '', '-f', '1', 'todo.txt'];

    const actual = cut.whichError(cmdLineArgs, options);
    const expected = 'cut: bad delimiter';
    assert.strictEqual(actual, expected);
  });

  it('should give delimiter error if delimiter is more than one char', () => {
    const options = { delimiter: 'acx', fileName: 'todo.txt' };
    const cmdLineArgs = ['-d', 'acx', '-f', '1', 'todo.txt'];

    const actual = cut.whichError(cmdLineArgs, options);
    const expected = 'cut: bad delimiter';
    assert.strictEqual(actual, expected);
  });

  it('should give field value error if field values are not integers', () => {
    const options = { delimiter: 'a', fieldValue: 'hello', fileName: 'foo' };
    const cmdLineArgs = ['-d', 'acx', '-f', 'hello', 'foo'];

    const actual = cut.whichError(cmdLineArgs, options);
    const expected = 'cut: [-cf] list: illegal list value';
    assert.strictEqual(actual, expected);
  });
});

describe('#isInteger', () => {
  it('should check given values are integers or not', () => {
    const actual = cut.isInteger('1,2,3');
    assert.isTrue(actual);
  });

  it('should check given value is integer or not', () => {
    const actual = cut.isInteger('1');
    assert.isTrue(actual);
  });
});

describe('#getInputStream', () => {
  it('should give fileStream if fileName is given', () => {
    const fileInputStream = new Readable();
    const stream = {
      fileStream: () => fileInputStream,
      stdin: new Readable({_read: function(){}})
    };
    const actual = cut.getInputStream(stream, 'todo.txt');
    assert.strictEqual(actual, fileInputStream);
  });

  it('should give stdin stream if fileName is not given', () => {
    const fileInputStream = new Readable();
    const stream =  {
      fileStream: () => fileInputStream,
      stdin: new Readable({_read: function(){}})
    };
    const actual = cut.getInputStream(stream, undefined);
    assert.strictEqual(actual, stream.stdin);
  });
});

describe('#loadStreamline', () => {
  it('should load data from given file', done => {
    const options = {delimiter: ',', fieldValue: '1', fileName: 'todo.txt'};
    const showResult = result => {
      assert.strictEqual(result.output, 'a\nc');
      assert.strictEqual(result.error, '');
      done();
    };
    const inputStream = new EventEmitter();
    cut.loadStreamLine(inputStream, options, showResult);
    inputStream.emit('data', 'a,b\nc,d');
  });

  it('should give error if file is not given', done => {
    const options = {delimiter: ',', fieldValue: '1', fileName: 'todo.txt'};
    const showResult = result => {
      assert.strictEqual(result.output, '');
      const expectedError = 'cut: todo.txt: No such file or directory';
      assert.strictEqual(result.error, expectedError);
      done();
    };
    const inputStream = new EventEmitter();
    cut.loadStreamLine(inputStream, options, showResult);
    inputStream.emit('error', {code: 'ENOENT'});
  });

  it('should giver error if directory name is given', done => {
    const options = {delimiter: ',', fieldValue: '1', fileName: 'todo.txt'};
    const showResult = result => {
      assert.strictEqual(result.output, '');
      const expectedError = 'cut: Error reading todo.txt';
      assert.strictEqual(result.error, expectedError);
      done();
    };
    const inputStream = new EventEmitter();
    cut.loadStreamLine(inputStream, options, showResult);
    inputStream.emit('error', {code: 'EISDIR'});
  });

  it('should take standard input', done => {
    const options = {delimiter: ',', fieldValue: '1', fileName: 'todo.txt'};
    const showResult = result => {
      assert.strictEqual(result.output, 'a\nc');
      assert.strictEqual(result.error, '');
      done();
    };
    const inputStream = new EventEmitter();
    cut.loadStreamLine(inputStream, options, showResult);
    inputStream.emit('data', 'a,b\nc,d');
  });
});
