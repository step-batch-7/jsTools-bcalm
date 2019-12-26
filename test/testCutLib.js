const assert = require("assert");
const cut = require("../src/cutLib.js");

describe("#displayMessage", () => {
  it("should display the cut content of each line", () => {
    const showResult = message => {
      assert.strictEqual(message.output, "h\nhow ar");
      assert.strictEqual(message.error, "");
    };
    const data = "hello\nhow are you";
    const options = { delimiter: "e", fileName: "todo.txt", fieldValue: "1" };
    cut.displayMessage(data, options, showResult);
  });
});

describe("#performAction", () => {
  it("should give the specific field of each line of given file", () => {
    const callBack = function(content) {
      assert.deepStrictEqual(content, ["h", "how ar"]);
    };
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
    cut.performAction(reader, cmdLineArgs, showResult);
  });

  it("should give delimiter error if bad delimiter is given", () => {
    const callBack = function(content) {
      assert.deepStrictEqual(content, ["h", "how ar"]);
    };
    const reader = (path, encode) => {
      assert.strictEqual(path, "todo.txt");
      assert.strictEqual(encode, "utf8");
      callBack(null, "h\nhow ar");
    };
    const cmdLineArgs = ["-d", "", "-f", "1", "todo.txt"];
    const showResult = message => {
      assert.strictEqual(message.output, "");
      assert.strictEqual(message.error, "cut: bad delimiter");
    };
    cut.performAction(reader, cmdLineArgs, showResult);
  });

  it("should give file error if file is not present ", () => {
    const callBack = function(content) {
      assert.deepStrictEqual(content, {
        error: "cut: todo.txt: No such file or directory",
        output: ""
      });
    };
    const reader = (path, encode) => {
      assert.strictEqual(path, "todo.txt");
      assert.strictEqual(encode, "utf8");
      callBack({
        error: "cut: todo.txt: No such file or directory",
        output: ""
      });
    };
    const cmdLineArgs = ["-d", "e", "-f", "1", "todo.txt"];
    const showResult = message => {
      assert.strictEqual(message.output, "");
      assert.strictEqual(
        message.error,
        "cut: todo.txt: No such file or directory"
      );
    };
    cut.performAction(reader, cmdLineArgs, showResult);
  });

  it("should give option error if field is not specified", () => {
    const callBack = function(content) {
      assert.deepStrictEqual(content, ["h", "how ar"]);
    };

    const reader = (path, encode) => {
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
    cut.performAction(reader, cmdLineArgs, showResult);
  });
});

describe("#getStructure", () => {
  it("should give content after separating fields", () => {
    const lines = "hello\nI";
    const actual = cut.getStructure(lines, "e", "2");
    const expected = "llo\nI";
    assert.deepStrictEqual(actual, expected);
  });

  it("should give content if separating fields are more than one", () => {
    const lines = "hello\nI";
    const actual = cut.getStructure(lines, "e", "1,2");
    const expected = "hello\nI";
    assert.deepStrictEqual(actual, expected);
  });
});

describe("#loadFileLines", () => {
  it("should load content of given file", () => {
    const callBack = function(content) {
      assert.deepStrictEqual(content, { output: "h\nhow ar", error: "" });
    };

    const reader = (path, encode) => {
      assert.strictEqual(path, "todo.txt");
      assert.strictEqual(encode, "utf8");
      callBack({ output: "h\nhow ar", error: "" });
    };
    const options = { delimiter: "e", fieldValue: 1, fileName: "todo.txt" };
    const showResult = message => {
      assert.strictEqual(message.output, "h\nhow ar");
      assert.deepStrictEqual(message.error, "");
    };
    cut.loadFileLines(reader, options, showResult);
  });
});
