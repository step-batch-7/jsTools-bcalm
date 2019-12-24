const assert = require("assert");
const cut = require("../src/cutLib.js");

describe("#displayMessage", () => {
  it("should display the cut content of each line", () => {
    const message = { output: "h\nhow ar", error: "" };
    const showResult = message => {
      assert.strictEqual(message.output, "h\nhow ar");
      assert.strictEqual(message.error, "");
    };
    const data = "hello\nhow are you";
    const options = { delimiter: "e", fileName: "todo.txt", fieldValue: [1] };
    cut.displayMessage(data, options, showResult);
  });
});

describe("#performAction", () => {
  it("should give the specific field of each line of given file", () => {
    const callBack = function(content) {
      assert.deepStrictEqual(content, ["h", "how ar"]);
    };
    const fileFunctions = {
      readFile: (path, encode, callBack) => {
        assert.strictEqual(path, "todo.txt");
        assert.strictEqual(encode, "utf8");
        callBack(null, "h\nhow ar");
      },
      existsFile: path => {
        assert.strictEqual(path, "todo.txt");
        return true;
      }
    };
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];
    const showResult = message => {
      assert.strictEqual(message.output, "h\nhow ar");
      assert.strictEqual(message.error, "");
    };
    cut.performAction(fileFunctions, cmdLineArgs, showResult);
  });

  it("should give delimiter error if bad delimiter is given", () => {
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
    const cmdLineArgs = ["-d", "", "-f", "1", "todo.txt"];
    const showResult = message => {
      assert.strictEqual(message.output, "");
      assert.strictEqual(message.error, "cut: bad delimiter");
    };
    cut.performAction(fileFunctions, cmdLineArgs, showResult);
  });

  it("should give file error if file is not present ", () => {
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
        return false;
      }
    };
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];
    const showResult = message => {
      assert.strictEqual(message.output, "");
      assert.strictEqual(
        message.error,
        "cut: todo.txt: No such file or directory"
      );
    };
    cut.performAction(fileFunctions, cmdLineArgs, showResult);
  });

  it("should five option error if field is not specified", () => {
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
        return false;
      }
    };
    const cmdLineArgs = ["-d", "e", "todo.txt"];
    const showResult = message => {
      assert.strictEqual(message.output, "");
      assert.strictEqual(
        message.error,
        "usage: cut -b list [-n] [file ...]\ncut -c list [file ...]\ncut -f list [-s] [-d delim] [file ...]"
      );
    };
    cut.performAction(fileFunctions, cmdLineArgs, showResult);
  });
});

describe("#getStructure", () => {
  it("should give content after separating fields", () => {
    const lines = "hello\nI";
    const actual = cut.getStructure(lines, "e", ["2"]);
    const expected = "llo\nI";
    assert.deepStrictEqual(actual, expected);
  });
});
