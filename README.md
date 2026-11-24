# Menu with calculator

The Omarchy menu, plus the instant math Omarchy 3's launcher had. Press
Super+Space, type a sum, and the answer is the first row. Enter copies it.

![Typing 1920/1.5-80 into the menu shows = 1200](preview.png)

Supports `+ - * / %`, powers (`^` or `**`), parentheses, and decimals.
Anything that is not arithmetic searches the menu as usual.

## Install

```bash
omarchy plugin add https://github.com/z19r/omarchy-menu-calc --enable
```

## Remove

```bash
omarchy plugin remove z19r.menu-calc
```

Removing it brings the built-in menu back.

## How it works

Omarchy has no hook for adding rows to its menu, so this plugin is a clone of
the built-in `omarchy.menu` (as made by `omarchy plugin clone`) and replaces
it while enabled. The only changes are `Calc.js`, a small arithmetic parser
that never evaluates typed text as code, and the dozen lines in `Menu.qml`
that show its result.

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
