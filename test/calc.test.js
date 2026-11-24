const assert = require("node:assert")
const { evaluate } = require("../Calc.js")

const cases = {
  "2+2": "4", " 2 + 2 * 3 ": "8", "(2+2)*3": "12", "10/4": "2.5", "0.1+0.2": "0.3",
  "2^10": "1024", "2**3": "8", "-2^2": "-4", "2^-1": "0.5", "2^3^2": "512", "7%4": "3",
  "1.5*-2": "-3", ".5+.5": "1",
  // Not calculations: plain searches, malformed input, no finite answer.
  "": "", "42": "", "-5": "", "7zip": "", "1+": "", "(1+2": "", "1+2)": "", "2(3)": "",
  "1/0": "", "1..2+1": "", "alert(1)": "", "1+<b>": "",
}
for (const [input, expected] of Object.entries(cases))
  assert.strictEqual(evaluate(input), expected, JSON.stringify(input))
console.log("ok", Object.keys(cases).length)
