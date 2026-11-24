// Arithmetic typed into the menu search: + - * / % ^ (or **) and parentheses.
// Returns the result as a string, or "" when the text is not a calculation.
// A hand-written parser, so nothing typed into the search is ever eval'd.
function evaluate(text) {
  var src = String(text || "").replace(/\s+/g, "").replace(/\*\*/g, "^")
  if (!src || src.length > 100 || !/^[0-9.+\-*\/%^()]+$/.test(src)) return ""

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

  function atom() {
    if (peek() === "(") {
      pos++
      var inner = expr()
      if (peek() !== ")") ok = false
      pos++
      return inner
    }
    var match = /^(\d+\.?\d*|\.\d+)/.exec(src.slice(pos))
    if (!match) { ok = false; pos = src.length; return NaN }
    pos += match[0].length
    return parseFloat(match[0])
  }

  var value = expr()
  // A bare number is a search, not a sum: only an operator earns a result row.
  if (!ok || pos !== src.length || operators === 0 || !isFinite(value)) return ""
  // 12 significant digits hides binary float noise (0.1 + 0.2).
  return String(parseFloat(value.toPrecision(12)))
}

if (typeof module !== "undefined") module.exports = { evaluate: evaluate }
