// Math typed into the menu search. Returns the answer as a string whose first
// word is always a plain number ("1200", "3.048 m"), or "" when the text is not
// a calculation. A hand-written parser, so nothing typed is ever eval'd.
//
//   arithmetic   + - * / % ^ (or **), parentheses, 2(3) and 2pi multiply
//   functions    sqrt(2), sin(pi/2), log(1000) ... (trig in radians)
//   conversions  5 ft to m, 72 f in c, 1.5 hours to min

function trig(fn) {
  // sin(pi) is 1.2e-16 in floating point; snap that to the 0 it should be,
  // but keep real tiny answers like sin(1e-20).
  return function(x) { var r = fn(x); return Math.abs(r) < 1e-15 && Math.abs(x) >= 1e-15 ? 0 : r }
}

var FUNCTIONS = {
  sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, exp: Math.exp,
  round: Math.round, floor: Math.floor, ceil: Math.ceil,
  ln: Math.log, log: Math.log10, log2: Math.log2,
  sin: trig(Math.sin), cos: trig(Math.cos), tan: trig(Math.tan),
  asin: Math.asin, acos: Math.acos, atan: Math.atan
}

var CONSTANTS = { pi: Math.PI, tau: 2 * Math.PI, e: Math.E }

// Each unit's size in its dimension's base unit. Volumes are US customary.
var UNITS = {
  length: { mm: 0.001, cm: 0.01, m: 1, meter: 1, metre: 1, km: 1000, in: 0.0254, inch: 0.0254,
            ft: 0.3048, foot: 0.3048, feet: 0.3048, yd: 0.9144, yard: 0.9144,
            mi: 1609.344, mile: 1609.344, nmi: 1852 },
  mass: { mg: 0.001, g: 1, gram: 1, kg: 1000, oz: 28.349523125, ounce: 28.349523125,
          lb: 453.59237, pound: 453.59237, stone: 6350.29318, t: 1e6, tonne: 1e6 },
  time: { ms: 0.001, s: 1, sec: 1, second: 1, min: 60, minute: 60, h: 3600, hr: 3600, hour: 3600,
          d: 86400, day: 86400, wk: 604800, week: 604800, yr: 31557600, year: 31557600 },
  // Typed text is lowercased, so "Mb" reads as megabytes; megabits are "mbit".
  data: { bit: 0.125, b: 1, byte: 1, kb: 1e3, mb: 1e6, gb: 1e9, tb: 1e12,
          kbit: 125, mbit: 125000, gbit: 125000000,
          kib: 1024, mib: 1048576, gib: 1073741824, tib: 1099511627776 },
  volume: { ml: 0.001, l: 1, liter: 1, litre: 1, tsp: 0.00492892159375, tbsp: 0.01478676478125,
            floz: 0.0295735295625, cup: 0.2365882365, pt: 0.473176473, pint: 0.473176473,
            qt: 0.946352946, quart: 0.946352946, gal: 3.785411784, gallon: 3.785411784 },
  speed: { mps: 1, kph: 1 / 3.6, kmh: 1 / 3.6, mph: 0.44704, knot: 1852 / 3600 }
}

var TEMPERATURES = { c: "c", celsius: "c", f: "f", fahrenheit: "f", k: "k", kelvin: "k" }

function own(table, key) {
  return Object.prototype.hasOwnProperty.call(table, key)
}

// { dimension, factor } for a unit name, singular or plural; null if unknown.
function unit(name) {
  var names = [name, name.replace(/s$/, ""), name.replace(/es$/, "")]
  for (var i = 0; i < names.length; i++) {
    if (own(TEMPERATURES, names[i])) return { dimension: "temperature", scale: TEMPERATURES[names[i]] }
    for (var dimension in UNITS)
      if (own(UNITS[dimension], names[i])) return { dimension: dimension, factor: UNITS[dimension][names[i]] }
  }
  return null
}

function convert(value, from, to) {
  if (from.dimension !== to.dimension) return NaN
  if (from.dimension !== "temperature") return value * from.factor / to.factor
  var kelvin = from.scale === "c" ? value + 273.15 : from.scale === "f" ? (value - 32) * 5 / 9 + 273.15 : value
  if (kelvin < 0) return NaN
  return to.scale === "c" ? kelvin - 273.15 : to.scale === "f" ? (kelvin - 273.15) * 9 / 5 + 32 : kelvin
}

// { value, operators } for an arithmetic expression, or null if it is not one.
function compute(text) {
  // "log 2(8)" would glue into log2(8); a name then a spaced number is not math.
  if (/[a-z]\s+[\d.]/i.test(text)) return null
  var src = String(text || "").replace(/\s+/g, "").replace(/\*\*/g, "^")
  if (!src || src.length > 100 || !/^[0-9a-z.+\-*\/%^()]+$/.test(src)) return null

  var pos = 0
  var operators = 0
  var ok = true

  function peek() { return src.charAt(pos) }

  function expr() {
    var value = term()
    for (;;) {
      var c = peek()
      if (c === "+") { pos++; operators++; value += term() }
      else if (c === "-") { pos++; operators++; value -= term() }
      else return value
    }
  }

  function term() {
    var value = unary()
    for (;;) {
      var c = peek()
      if (c === "*") { pos++; operators++; value *= unary() }
      else if (c === "/") { pos++; operators++; value /= unary() }
      else if (c === "%") { pos++; operators++; value %= unary() }
      // 2(3), 2pi, (1+2)(3+4): a bracket or a name right after a value multiplies.
      else if (ok && (c === "(" || /[a-z]/.test(c))) { operators++; value *= unary() }
      else return value
    }
  }

  function unary() {
    if (peek() === "-") { pos++; return -unary() }
    if (peek() === "+") { pos++; return unary() }
    var base = atom()
    if (peek() === "^") { pos++; operators++; return Math.pow(base, unary()) }
    return base
  }

  function group() {
    pos++
    var inner = expr()
    if (peek() !== ")") ok = false
    pos++
    return inner
  }

  function fail() { ok = false; pos = src.length; return NaN }

  function atom() {
    if (peek() === "(") return group()

    var name = /^[a-z]+\d?/.exec(src.slice(pos))
    if (name && !own(FUNCTIONS, name[0])) name = /^[a-z]+/.exec(src.slice(pos))
    if (name) {
      pos += name[0].length
      if (own(FUNCTIONS, name[0]) && peek() === "(") { operators++; return FUNCTIONS[name[0]](group()) }
      return own(CONSTANTS, name[0]) ? CONSTANTS[name[0]] : fail()
    }

    var number = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/.exec(src.slice(pos))
    if (!number) return fail()
    pos += number[0].length
    return parseFloat(number[0])
  }

  var value = expr()
  return ok && pos === src.length && isFinite(value) ? { value: value, operators: operators } : null
}

// 12 significant digits hides binary float noise (0.1 + 0.2).
function format(value) {
  return String(parseFloat(value.toPrecision(12)))
}

function evaluate(text) {
  var query = String(text || "").trim().toLowerCase()

  var conversion = /^(.*[\d)])\s*°?([a-z]+)\s+(?:to|in)\s+°?([a-z]+)$/.exec(query)
  if (conversion) {
    var amount = compute(conversion[1])
    var from = unit(conversion[2])
    var to = unit(conversion[3])
    var converted = amount && from && to ? convert(amount.value, from, to) : NaN
    return isFinite(converted) ? format(converted) + " " + conversion[3] : ""
  }

  var result = compute(query)
  // A bare number or name is a search, not a sum: "42" and "pi" get no row.
  return result && result.operators > 0 ? format(result.value) : ""
}

if (typeof module !== "undefined") module.exports = { evaluate: evaluate }
