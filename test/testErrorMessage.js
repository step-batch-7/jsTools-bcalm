const assert = require("chai").assert;
const error = require("../src/errorMessage.js");

describe("#noFileMessage", () => {
  it("should give there is no file", () => {
    const actual = error.noFileMessage("one.txt");
    const expected = "cut: one.txt: No such file or directory";

    assert.strictEqual(actual, expected);
  });
});

describe("#optionError", () => {
  it("should give the option of cut command", () => {
    const actual = error.optionError();
    const expected =
      "usage: cut -b list [-n] [file ...]\ncut -c list [file ...]\ncut -f list [-s] [-d delim] [file ...]";
    assert.strictEqual(actual, expected);
  });
});

describe("#displayDelimiterError", () => {
  it("should give bad delimiter", () => {
    const actual = error.displayDelimiterError();
    const expected = "cut: bad delimiter";
    assert.strictEqual(actual, expected);
  });
});
