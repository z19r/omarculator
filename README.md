# Omarculator

[![Monitored by Cooper&Wright](https://img.shields.io/badge/monitored%20by-Cooper%26Wright-8a6a3b?style=flat-square)](https://cooperwright.com)

The Omarchy menu, plus the instant math Omarchy 3's launcher had. Press
Super+Space, type a sum, and the answer is the first row. Enter copies it.

![Typing 1920/1.5-80 into the menu shows = 1200](preview.png)

| Type | Get |
|---|---|
| `1920/1.5-80`, `2^10`, `7%4` | `1200`, `1024`, `3` |
| `2(3+4)`, `2pi` | `14`, `6.28318530718` |
| `sqrt(2)`, `log(1000)`, `sin(pi/2)` | `1.41421356237`, `3`, `1` |
| `5 ft to m`, `72 f in c`, `1.5 hours to min` | `1.524 m`, `22.2222222222 c`, `90 min` |

- Arithmetic: `+ - * / %` (remainder), powers (`^` or `**`), parentheses,
  decimals, and `1e3` notation.
- Functions: `sqrt cbrt abs exp ln log log2 round floor ceil sin cos tan asin
  acos atan`, with trigonometry in radians. Constants: `pi`, `tau`, `e`.
- Conversions between units of length, mass, time, data, volume (US), speed,
  and temperature, written `<amount> <unit> to <unit>` or `in`. Only the
  number is copied, not the unit. Case is ignored, so `mb` is megabytes;
  write megabits as `mbit`.

Anything that is not a calculation searches the menu as usual, including a
bare number or name such as `42` or `pi`.

## Install

```bash
omarchy plugin add https://github.com/z19r/omarculator --enable
omarchy restart shell
```

The menu stays loaded between uses, so restart the shell after installing or
updating for the new version to take effect.

## Remove

```bash
omarchy plugin remove z19r.omarculator
```

Removing it brings the built-in menu back.

## How it works

Omarchy has no hook for adding rows to its menu, so this plugin is a clone of
the built-in `omarchy.menu` (as made by `omarchy plugin clone`) and replaces
it while enabled. The only changes are `Calc.js`, a small parser
that never evaluates typed text as code, and the 16 lines in `Menu.qml` that
show its result.

Because it is a clone, it carries the menu as it was in Omarchy 4.0.0.alpha. Menu
changes in later Omarchy releases arrive here only when this plugin is
updated.

## Dependencies

`wl-copy`, which Omarchy ships. No network access, and no config files are
written.

## Development

```bash
node test/calc.test.js
```

## License

MIT. The menu is Omarchy's, copyright David Heinemeier Hansson.
