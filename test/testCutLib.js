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
  it("should give empty object if file is not exists", function() {
    const actualValue = lib.loadContents(
      "./NoFile",
      function(arg1, arg2) {
        assert.strictEqual(arg1, "./NoFile");
        assert.strictEqual(arg2, "utf8");
        return "[]";
      },
      function(arg) {
        assert.strictEqual(arg, "./NoFile");
        return false;
      }
    );
    const expectedValue = "No such file or directory.";
    assert.deepStrictEqual(actualValue, expectedValue);
  });

  it("should give content of the file with true flag if file exists", function() {
    const actualValue = lib.loadContents(
      "path",
      function(path, encode) {
        assert.strictEqual(path, "path");
        assert.strictEqual(encode, "utf8");
        return '{"key": "value"}';
      },
      function(path) {
        assert.strictEqual(path, "path");
        return true;
      }
    );
    const expectedValue = '{"key": "value"}';
    assert.deepStrictEqual(actualValue, expectedValue);
  });
});
