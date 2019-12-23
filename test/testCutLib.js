const assert = require("chai").assert;
const lib = require("../src/cutLib.js");

describe("#displayMessage", () => {
  it("should display the nth field of content", () => {
    const content = [["h", "llo"], ["how ar", "you"], ["I am fin"]];
    const actual = lib.displayMessage(content, 1);
    const expected = "h\nhow ar\nI am fin";
    assert.strictEqual(actual, expected);
  });
});

describe("#formatMessage", () => {
  it("should separate each line content by delimiter", () => {
    const fileContent = [["hello"], ["how are you"], ["I am fine."]];
    const actual = lib.formatMessage(fileContent, "e");
    const expected = [
      ["h", "llo"],
      ["how ar", " you"],
      ["I am fin", "."]
    ];
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#getStructuredContents", () => {
  it("should give whole line contents in an array", () => {
    const fileContents = "hello\nhow are you\nI am fine.";
    const actual = lib.getStructuredContents(fileContents);
    const expected = [["hello"], ["how are you"], ["I am fine."]];
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#loadContents", function() {
  it("should give content of the file with true flag if file exists", function() {
    const actualValue = lib.loadContents("path", function(path, encode) {
      assert.strictEqual(path, "path");
      assert.strictEqual(encode, "utf8");
      return '{"key": "value"}';
    });
    const expectedValue = '{"key": "value"}';
    assert.deepStrictEqual(actualValue, expectedValue);
  });
});

describe("#isFileExists", () => {
  it("should give true if file is given", () => {
    const actual = lib.isFileExists("path", function(path) {
      assert.strictEqual(path, "path");
      return true;
    });
    assert.isTrue(actual);
  });

  it("should give false if file isn't given", () => {
    const actual = lib.isFileExists("noFile.txt", function(path) {
      assert.strictEqual(path, "noFile.txt");
      return false;
    });
    assert.isFalse(actual);
  });
});

describe("#parseInput", () => {
  it("should read the input and separate if there is space b/w delimiter and delimiter option", () => {
    const cmdLineArgs = ["-d", "e", "-f", "1", "one.txt"];
    const actual = lib.parseInput(cmdLineArgs);
    const expected = { delimiter: "e", fieldValue: "1", fileName: "one.txt" };
    assert.deepStrictEqual(actual, expected);
  });

  it("should read the input and separate if there is no space b/w delimiter and delimiter option", () => {
    const cmdLineArgs = ["-de", "-f1", "one.txt"];
    const actual = lib.parseInput(cmdLineArgs);
    const expected = { delimiter: "e", fieldValue: "1", fileName: "one.txt" };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("performAction", function() {
  it("should give specific field of each line", function() {
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];
    const fileFunctions = {
      readFile: (path, encode) => {
        assert.strictEqual(path, "todo.txt");
        assert.strictEqual(encode, "utf8");
        return "[]";
      },
      existsFile: path => {
        assert.strictEqual(path, "todo.txt");
        return true;
      }
    };
    const actual = lib.performAction(fileFunctions, cmdLineArgs);
    const expected = { output: "[]" };
    assert.deepStrictEqual(actual, expected);
  });

  it("should give error if there is no file", () => {
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];
    const fileFunctions = {
      readFile: (path, encode) => {
        assert.strictEqual(path, "todo.txt");
        assert.strictEqual(encode, "utf8");
        return `cut: ${
          cmdLineArgs[cmdLineArgs.length - 1]
        }: No such file or directory`;
      },
      existsFile: path => {
        assert.strictEqual(path, "todo.txt");
        return false;
      }
    };
    const actual = lib.performAction(fileFunctions, cmdLineArgs);
    const expected = { error: "cut: todo.txt: No such file or directory" };
    assert.deepStrictEqual(actual, expected);
  });

  it("should give error if there is no file", () => {
    const cmdLineArgs = ["-d", "e", "1", "todo.txt"];
    const fileFunctions = {
      readFile: (path, encode) => {
        assert.strictEqual(path, "todo.txt");
        assert.strictEqual(encode, "utf8");
        return "[]";
      },
      existsFile: path => {
        assert.strictEqual(path, "todo.txt");
        return true;
      }
    };
    const actual = lib.performAction(fileFunctions, cmdLineArgs);
    const expected = {
      error:
        "usage: cut -b list [-n] [file ...]\ncut -c list [file ...]\ncut -f list [-s] [-d delim] [file ...]"
    };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#isValidInput", () => {
  it("should give false if input isn't in correct format", () => {
    const cmdLineArgs = ["-d", "e", "1", "todo.txt"];
    const actual = lib.isValidInput(cmdLineArgs);
    assert.isFalse(actual);
  });

  it("should give true if input is in correct form", () => {
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];
    const actual = lib.isValidInput(cmdLineArgs);
    assert.isTrue(actual);
  });
});
