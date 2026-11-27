const assert = require("node:assert")
const { evaluate } = require("../Calc.js")

const cases = {
  "2+2": "4", " 2 + 2 * 3 ": "8", "(2+2)*3": "12", "10/4": "2.5", "0.1+0.2": "0.3",
  "2^10": "1024", "2**3": "8", "-2^2": "-4", "2^-1": "0.5", "2^3^2": "512", "7%4": "3",
  "1.5*-2": "-3", ".5+.5": "1", "1e3*2": "2000",
  // Implicit multiplication.
  "2(3)": "6", "(1+2)(3+4)": "21", "2pi": "6.28318530718", "2sqrt(16)": "8",
  // Functions and constants.
  "sqrt(2)": "1.41421356237", "SQRT(16)+1": "5", "sin(pi)": "0", "cos(pi)": "-1", "sin(pi/2)": "1",
  "log(1000)": "3", "log2(8)": "3", "ln(e)": "1", "abs(-3)": "3", "round(2.5)+floor(2.9)": "5",
  "pi*2": "6.28318530718", "tau/pi": "2",
  // Conversions. The first word of every answer is the number that gets copied.
  "5 ft to m": "1.524 m", "5ft in cm": "152.4 cm", "5 in in cm": "12.7 cm", "1 mile to km": "1.609344 km",
  "12 inches to feet": "1 feet", "100 f to c": "37.7777777778 c", "0 °C to °F": "32 f", "0 c to k": "273.15 k",
  "1.5 hours to min": "90 min", "(1+1) kg to lbs": "4.4092452437 lbs", "1 gib to mb": "1073.741824 mb",
  "2 cups to ml": "473.176473 ml", "60 mph to kph": "96.56064 kph", "100 mbit to mb": "12.5 mb",
  "1 gbit to mb": "125 mb", "sin(1e-20)*1e20": "1", "cos(pi/2)": "0",
  // Not calculations: plain searches, malformed input, no finite answer.
  "": "", "42": "", "-5": "", "pi": "", "e": "", "7zip": "", "1+": "", "(1+2": "", "1+2)": "",
  "1/0": "", "1..2+1": "", "alert(1)": "", "1+<b>": "", "constructor(1)": "", "sqrt": "", "sqrt(-1)": "",
  "5 ft to kg": "", "5 zorks to m": "", "log in to 5": "", "3 to 5": "",
  "log 2(8)": "", "-500 c to k": "", "-1 k to c": "",
}
for (const [input, expected] of Object.entries(cases)) {
  assert.strictEqual(evaluate(input), expected, JSON.stringify(input))
  // Menu.qml hands the first word to the shell unquoted: it must stay a bare number.
  if (expected) assert.match(expected.split(" ")[0], /^[-+.e\d]+$/, JSON.stringify(input))
}
console.log("ok", Object.keys(cases).length)
