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
