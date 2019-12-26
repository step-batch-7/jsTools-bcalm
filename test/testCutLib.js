const assert = require("assert");
const cut = require("../src/cutLib.js");

describe("#displayResult", () => {
  it("should display the cut content of each line", () => {
    const showResult = message => {
      assert.strictEqual(message.output, "h\nhow ar");
      assert.strictEqual(message.error, "");
    };
    const data = "hello\nhow are you";
    const options = { delimiter: "e", fileName: "todo.txt", fieldValue: "1" };
    cut.displayResult(data, options, showResult);
  });
});

describe("#executeCut", () => {
  it("should give the specific field of each line of given file", () => {
    const reader = (path, encode, callBack) => {
      assert.strictEqual(path, "todo.txt");
      assert.strictEqual(encode, "utf8");
      callBack(null, "h\nhow ar");
    };
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];
    const showResult = message => {
      assert.strictEqual(message.output, "h\nhow ar");
      assert.strictEqual(message.error, "");
    };
    cut.executeCut(reader, cmdLineArgs, showResult);
  });

  it("should give delimiter error if bad delimiter is given", () => {
    const reader = (path, encode, callBack) => {
      assert.strictEqual(path, "todo.txt");
      assert.strictEqual(encode, "utf8");
      callBack(null, "h\nhow ar");
    };
    const cmdLineArgs = ["-d", "", "-f", "1", "todo.txt"];
    const showResult = message => {
      assert.strictEqual(message.output, "");
      assert.strictEqual(message.error, "cut: bad delimiter");
    };
    cut.executeCut(reader, cmdLineArgs, showResult);
  });

  it("should give file error if file is not present ", () => {
    const reader = (path, encode, callBack) => {
      assert.strictEqual(path, "todo.txt");
      assert.strictEqual(encode, "utf8");
      callBack({ code: "ENOENT" });
    };
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];
    const showResult = message => {
      assert.strictEqual(message.output, "");
      assert.strictEqual(
        message.error,
        "cut: todo.txt: No such file or directory"
      );
    };
    cut.executeCut(reader, cmdLineArgs, showResult);
  });

  it("should give option error if field is not specified", () => {
    const reader = (path, encode, callBack) => {
      assert.strictEqual(path, "todo.txt");
      assert.strictEqual(encode, "utf8");
      callBack(null, "h\nhow ar");
    };
    const cmdLineArgs = ["-d", "e", "todo.txt"];
    const showResult = message => {
      assert.strictEqual(message.output, "");
      assert.strictEqual(
        message.error,
        "usage: cut -b list [-n] [file ...]\ncut -c list [file ...]\ncut -f list [-s] [-d delim] [file ...]"
      );
    };
    cut.executeCut(reader, cmdLineArgs, showResult);
  });
});

describe("#cutLines", () => {
  it("should give content after separating fields", () => {
    const lines = "hello\nI";
    const actual = cut.cutLines(lines, "e", "2");
    const expected = "llo\nI";
    assert.deepStrictEqual(actual, expected);
  });

  it("should give content if separating fields are more than one", () => {
    const lines = "hello\nI";
    const actual = cut.cutLines(lines, "e", "1,2");
    const expected = "hello\nI";
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#loadFileLines", () => {
  it("should load content of given file", () => {
    const reader = (path, encode, callBack) => {
      assert.strictEqual(path, "todo.txt");
      assert.strictEqual(encode, "utf8");
      callBack(null, "h\nhow ar");
    };
    const options = { delimiter: "e", fieldValue: "1", fileName: "todo.txt" };
    const showResult = message => {
      assert.strictEqual(message.output, "h\nhow ar");
      assert.deepStrictEqual(message.error, "");
    };
    cut.loadFileLines(reader, options, showResult);
  });

  it("should give file is not present if file is not there", () => {
    const reader = function(path, encode, callBack) {
      assert.strictEqual(path, "foo");
      assert.strictEqual(encode, "utf8");
      callBack({ code: "ENOENT" });
    };
    const options = { delimiter: "d", fieldValue: "3", fileName: "foo" };
    const showResult = function(message) {
      assert.strictEqual(message.output, "");
      assert.strictEqual(message.error, "cut: foo: No such file or directory");
    };
    cut.loadFileLines(reader, options, showResult);
  });

  it("should give error when directory name is given in place of directory name", () => {
    const reader = function(path, encode, callBack) {
      assert.strictEqual(path, "foo");
      assert.strictEqual(encode, "utf8");
      callBack({ code: "EISDIR" });
    };
    const options = { delimiter: "d", fieldValue: "1", fileName: "foo" };
    const showResult = function(message) {
      assert.strictEqual(message.output, "");
      assert.strictEqual(message.error, "cut: Error reading foo");
    };
    cut.loadFileLines(reader, options, showResult);
  });
});

describe("#displayError", () => {
  it("should return the error object", () => {
    const actual = cut.displayError("one.txt");
    const expected = {
      fileError: "cut: one.txt: No such file or directory",
      delimiterError: "cut: bad delimiter",
      optionError:
        "usage: cut -b list [-n] [file ...]\ncut -c list [file ...]\ncut -f list [-s] [-d delim] [file ...]"
    };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#parseInput", () => {
  it("should read the input and separate if there is space b/w delimiter and delimiter option", () => {
    const cmdLineArgs = ["-d", "e", "-f", "1", "one.txt"];
    const actual = cut.parseInput(cmdLineArgs);
    const expected = { delimiter: "e", fieldValue: "1", fileName: "one.txt" };
    assert.deepStrictEqual(actual, expected);
  });

  it("shouldn't give undefined if file is not given", () => {
    const cmdLineArgs = ["-d", "e", "-f", "1"];
    const actual = cut.parseInput(cmdLineArgs);
    const expected = { delimiter: "e", fieldValue: "1", fileName: "" };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#validateUserArgs", () => {
  it("should give option error if field is not given", () => {
    const cmdLineArgs = ["-d", "e", "1", "todo.txt"];
    const options = { fileName: "todo.txt" };
    const callBack = function(content) {
      assert.deepStrictEqual(content, ["h", "how ar"]);
    };
    const fileFunctions = {
      readFile: (path, encode) => {
        assert.strictEqual(path, "todo.txt");
        assert.strictEqual(encode, "utf8");
        callBack(null, "h\nhow ar");
      }
    };
    const actual = cut.validateUserArgs(cmdLineArgs, options, fileFunctions);
    const expected = {
      isError: true,
      errorMessage:
        "usage: cut -b list [-n] [file ...]\ncut -c list [file ...]\ncut -f list [-s] [-d delim] [file ...]"
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("should give true if input is in correct format ", () => {
    const options = { delimiter: "e", fileName: "todo.txt" };
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];
    const callBack = function(content) {
      assert.deepStrictEqual(content, ["h", "how ar"]);
    };

    const fileFunctions = {
      readFile: (path, encode) => {
        assert.strictEqual(path, "todo.txt");
        assert.strictEqual(encode, "utf8");
        callBack(null, "h\nhow ar");
      }
    };
    const actual = cut.validateUserArgs(cmdLineArgs, options, fileFunctions);
    const expected = { isError: false, errorType: null };
    assert.deepEqual(actual, expected);
  });

  it("should give delimiter error if delimiter is null", () => {
    const options = { delimiter: "", fileName: "todo.txt" };
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];

    const fileFunctions = {
      readFile: (path, encode, callBack) => {
        assert.strictEqual(path, "todo.txt");
        assert.strictEqual(encode, "utf8");
        callBack(null, "h\nhow ar");
      }
    };
    const actual = cut.validateUserArgs(cmdLineArgs, options, fileFunctions);
    const expected = { isError: true, errorMessage: "cut: bad delimiter" };
    assert.deepEqual(actual, expected);
  });

  it("should give delimiter error if delimiter is more than one character", () => {
    const options = { delimiter: "acx", fileName: "todo.txt" };
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];

    const fileFunctions = {
      readFile: (path, encode, callBack) => {
        assert.strictEqual(path, "todo.txt");
        assert.strictEqual(encode, "utf8");
        callBack, (null, "h\nhow ar");
      }
    };
    const actual = cut.validateUserArgs(cmdLineArgs, options, fileFunctions);
    const expected = { isError: true, errorMessage: "cut: bad delimiter" };
    assert.deepEqual(actual, expected);
  });
});

describe("#createRange", () => {
  it("should create range of required field of each line", () => {
    const actual = cut.createRange("1,2,3");
    const expected = ["1", "2", "3"];
    assert.deepEqual(actual, expected);
  });
});
