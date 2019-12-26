const assert = require("chai").assert;
const utils = require("../src/utils.js");

describe("#displayError", () => {
  it("should return the error object", () => {
    const actual = utils.displayError("one.txt");
    const expected = {
      fileError: "cut: one.txt: No such file or directory",
      delimiterError: "cut: bad delimiter",
      optionError:
        "usage: cut -b list [-n] [file ...]\ncut -c list [file ...]\ncut -f list [-s] [-d delim] [file ...]"
    };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#getLines", () => {
  it("should give whole line contents in an array", () => {
    const fileContents = "hello\nhow are you\nI am fine.";
    const actual = utils.getLines(fileContents);
    const expected = ["hello", "how are you", "I am fine."];
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#parseInput", () => {
  it("should read the input and separate if there is space b/w delimiter and delimiter option", () => {
    const cmdLineArgs = ["-d", "e", "-f", "1", "one.txt"];
    const actual = utils.parseInput(cmdLineArgs);
    const expected = { delimiter: "e", fieldValue: "1", fileName: "one.txt" };
    assert.deepStrictEqual(actual, expected);
  });

  it("shouldn't give undefined if file is not given", () => {
    const cmdLineArgs = ["-d", "e", "-f", "1"];
    const actual = utils.parseInput(cmdLineArgs);
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
      },
      existsFile: path => {
        assert.strictEqual(path, "todo.txt");
        return true;
      }
    };
    const actual = utils.validateUserArgs(cmdLineArgs, options, fileFunctions);
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
      },
      existsFile: path => {
        assert.strictEqual(path, "todo.txt");
        return true;
      }
    };
    const actual = utils.validateUserArgs(cmdLineArgs, options, fileFunctions);
    const expected = { isError: false, errorType: null };
    assert.deepEqual(actual, expected);
  });

  it("should give delimiter error if delimiter is null", () => {
    const options = { delimiter: "", fileName: "todo.txt" };
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];
    const callBack = function(content) {
      assert.deepStrictEqual(content, ["h", "how ar"]);
    };

    const fileFunctions = {
      readFile: (path, encode) => {
        assert.strictEqual(path, "todo.txt");
        assert.strictEqual(encode, "utf8");
        callBack(null, "h\nhow ar");
      },
      existsFile: path => {
        assert.strictEqual(path, "todo.txt");
        return true;
      }
    };
    const actual = utils.validateUserArgs(cmdLineArgs, options, fileFunctions);
    const expected = { isError: true, errorMessage: "cut: bad delimiter" };
    assert.deepEqual(actual, expected);
  });

  it("should give delimiter error if delimiter is more than one character", () => {
    const options = { delimiter: "acx", fileName: "todo.txt" };
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];
    const callBack = function(content) {
      assert.deepStrictEqual(content, ["h", "how ar"]);
    };

    const fileFunctions = {
      readFile: (path, encode) => {
        assert.strictEqual(path, "todo.txt");
        assert.strictEqual(encode, "utf8");
        callBack, (null, "h\nhow ar");
      },
      existsFile: path => {
        assert.strictEqual(path, "todo.txt");
        return true;
      }
    };
    const actual = utils.validateUserArgs(cmdLineArgs, options, fileFunctions);
    const expected = { isError: true, errorMessage: "cut: bad delimiter" };
    assert.deepEqual(actual, expected);
  });
});

describe("#createRange", () => {
  it("should create range of required field of each line", () => {
    const actual = utils.createRange("1,2,3");
    const expected = ["1", "2", "3"];
    assert.deepEqual(actual, expected);
  });
});
