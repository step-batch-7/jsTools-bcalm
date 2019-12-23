const assert = require("chai").assert;
const error = require("../src/errorMessage.js");

describe("#noFileMessage", () => {
  it("should return there is no file", () => {
    const actual = error.noFileMessage("one.txt");
    const expected = "cut: one.txt: No such file or directory";
    
    assert.strictEqual(actual, expected);
  });
});
