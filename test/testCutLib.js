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
