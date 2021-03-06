const assert = require('chai').assert;
const sinon = require('sinon');
const cut = require('../src/performCut.js');

describe('#getFormattedResult', () => {
  
  it('should display the cut content of each line', () => {
    const data = 'hello\nhow are you';
    const showResult = sinon.fake();
    const options = {delimiter: 'e', fileName: 'todo.txt', fieldValue: '1'};
    cut.getFormattedResult(data, options, showResult);
    assert(showResult.calledOnceWith({output: 'h\nhow ar', error: ''}));
  });
});

describe('#cut', () => {
  let showResult;
  let streams;
  beforeEach(() => {
    showResult = sinon.fake();
    streams = {
      on: sinon.fake()
    };
  });
  it('should give the specific field of each line of given file', () => {
    const cmdLineArgs = ['-d', 'e', '-f', '1', 'todo.txt'];
    cut.cut(cmdLineArgs, showResult, streams);
    assert.strictEqual(streams.on.firstCall.args[0], 'data');
    streams.on.firstCall.args[1]('hello\nhow are you');
    assert(showResult.calledOnceWith({output: 'h\nhow ar', error: ''}));
  });

  it('should give delimiter error if bad delimiter is given', () => {
    const cmdLineArgs = ['-d', '', '-f', '1', 'todo.txt'];
    cut.cut(cmdLineArgs, showResult, streams);
    const result = {output: '', error: 'cut: bad delimiter'};
    assert(showResult.calledOnceWith(result));
  });

  it('should give file error if file is not present ', () => {
    const cmdLineArgs = ['-d', 'e', '-f', '1', 'todo.txt'];
    cut.cut(cmdLineArgs, showResult, streams);
    assert.strictEqual(streams.on.firstCall.args[0], 'data');
    assert.strictEqual(streams.on.secondCall.args[0], 'error');
    streams.on.secondCall.args[1]({code: 'ENOENT'}); 
    const fileErrorMessage = 'cut: todo.txt: No such file or directory';
    assert(showResult.calledOnceWith({output: '', error: fileErrorMessage}));
  });
  
  it('should give option error if field is not specified', () => {
    const cmdLineArgs = ['-d', 'e', 'todo.txt'];
    cut.cut(cmdLineArgs, showResult, streams);
    const optionErrorMessage = 'usage: cut -f list [-s] [-d delim] [file ...]';
    assert(showResult.calledOnceWith({output: '', error: optionErrorMessage}));
  });
  
  it('should given specific field for stdin', () => {
    const cmdLineArgs = ['-d', ',', '-f', '1'];
    cut.cut(cmdLineArgs, showResult, streams);
    assert.strictEqual(streams.on.firstCall.args[0], 'data');
    streams.on.firstCall.args[1]('a,b\nc,d');
    assert(showResult.calledOnceWith({output: 'a\nc', error: ''}));
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

  it('should give all content if there is no delimiter on that line', () => {
    const line = 'hello';
    const actual = cut.cutLines(line, '1', '1');
    const expected = 'hello';
    assert.strictEqual(actual, expected);
  });
});

describe('#whichError', () => {
  it('should give option error if field is not given', () => {
    const cmdLineArgs = ['-d', 'e', '1', 'todo.txt'];
    const options = {fileName: 'todo.txt', fieldValue: '1'};
    
    const actual = cut.whichError(cmdLineArgs, options);
    const expected =
    'usage: cut -f list [-s] [-d delim] [file ...]';
    assert.strictEqual(actual, expected);
  });
  
  it('should give delimiter error if delimiter is null', () => {
    const options = {delimiter: '', fileName: 'todo.txt'};
    const cmdLineArgs = ['-d', '', '-f', '1', 'todo.txt'];
    
    const actual = cut.whichError(cmdLineArgs, options);
    const expected = 'cut: bad delimiter';
    assert.strictEqual(actual, expected);
  });

  it('should give delimiter error if delimiter is more than one char', () => {
    const options = {delimiter: 'acx', fileName: 'todo.txt'};
    const cmdLineArgs = ['-d', 'acx', '-f', '1', 'todo.txt'];

    const actual = cut.whichError(cmdLineArgs, options);
    const expected = 'cut: bad delimiter';
    assert.strictEqual(actual, expected);
  });

  it('should give field value error if field values are not integers', () => {
    const options = {delimiter: 'a', fieldValue: 'hello', fileName: 'foo'};
    const cmdLineArgs = ['-d', 'acx', '-f', 'hello', 'foo'];

    const actual = cut.whichError(cmdLineArgs, options);
    const expected = 'cut: [-cf] list: illegal list value';
    assert.strictEqual(actual, expected);
  });
});

describe('#getInputStream', () => {
  it('should give fileStream if fileName is given', () => {
    const fileName = 'one.txt';
    const fileInputStream = sinon.fake();
    const stdin = sinon.fake();
    const streams = {
      fileStream: function() {
        return fileInputStream;
      },
      stdin
    };
    const actual = cut.getInputStream( streams, fileName);
    assert.strictEqual(actual, fileInputStream);
  });

  it('should give stdin stream if fileName is not given', () => {
    const fileInputStream = sinon.fake();
    const stdin = sinon.fake();
    const streams = {
      fileStream: function() {
        return fileInputStream;
      },
      stdin
    };
    const actual = cut.getInputStream( streams, undefined);
    assert.strictEqual(actual, stdin);
  });
});

describe('#loadStreamline', () => {
  it('should load data from given file', done => {
    const options = {delimiter: ',', fieldValue: '1', fileName: 'todo.txt'};
    const showResult = sinon.fake(() => {
      assert(showResult.calledOnceWith({output: 'a\nb', error: ''}));
      done();
    });
    const inputStream = {on: sinon.fake()};
    cut.loadStreamLine(inputStream, options, showResult);
    assert.strictEqual(inputStream.on.firstCall.args[0], 'data');
    inputStream.on.firstCall.args[1]('a,c\nb,d');
  });

  it('should give error if file is not given', done => {
    const options = {delimiter: ',', fieldValue: '1', fileName: 'todo.txt'};
    const showResult = sinon.fake(() => {
      const fileErrorMessage = 'cut: todo.txt: No such file or directory';
      assert(showResult.calledOnceWith({output: '', error: fileErrorMessage}));
      done();
    });
   
    const inputStream = {on: sinon.fake()};
    cut.loadStreamLine(inputStream, options, showResult);
    assert.strictEqual(inputStream.on.firstCall.args[0], 'data');
    assert.strictEqual(inputStream.on.secondCall.args[0], 'error');
    inputStream.on.secondCall.args[1]({code: 'ENOENT'});  
  });

  it('should giver error if directory name is given', done => {
    const options = {delimiter: ',', fieldValue: '1', fileName: 'todo.txt'};
    const showResult = sinon.fake(() => {
      const fileErrorMessage = 'cut: Error reading todo.txt';
      assert(showResult.calledOnceWith({output: '', error: fileErrorMessage}));
      done();
    });
   
    const inputStream = {on: sinon.fake()};
    cut.loadStreamLine(inputStream, options, showResult);
    assert.strictEqual(inputStream.on.firstCall.args[0], 'data');
    assert.strictEqual(inputStream.on.secondCall.args[0], 'error');
    inputStream.on.secondCall.args[1]({code: 'EISDIR'});  
  });

  it('should take standard input', done => {
    const options = {delimiter: ',', fieldValue: '1', fileName: 'todo.txt'};
    const showResult = sinon.fake(() => {
      assert(showResult.calledOnceWith({output: 'a\nb', error: ''}));
      done();
    });
   
    const inputStream = {on: sinon.fake()};
    cut.loadStreamLine(inputStream, options, showResult);
    assert.strictEqual(inputStream.on.firstCall.args[0], 'data');
    inputStream.on.firstCall.args[1]('a,c\nb,d');  
  });
});
