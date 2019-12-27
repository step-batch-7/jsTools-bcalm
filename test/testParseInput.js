const assert = require("chai").assert;
const { parseInput } = require("../src/parseInput.js");

describe("#parseInput", () => {
  it("should read the input and separate if there is space b/w delimiter and delimiter option", () => {
    const cmdLineArgs = ["-d", "e", "-f", "1", "one.txt"];
    const actual = parseInput(cmdLineArgs);
    const expected = { delimiter: "e", fieldValue: "1", fileName: "one.txt" };
    assert.deepStrictEqual(actual, expected);
  });

  it("shouldn't give undefined if file is not given", () => {
    const cmdLineArgs = ["-d", "e", "-f", "1", ""];
    const actual = parseInput(cmdLineArgs);
    const expected = { delimiter: "e", fieldValue: "1", fileName: "" };
    assert.deepStrictEqual(actual, expected);
  });
});
