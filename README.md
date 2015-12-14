ESLint Plugin Rapid7
===================

Rapid7 specific linting rules for ESLint

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally.

```sh
$ npm install eslint
```

If you installed `ESLint` globally, you have to install Rapid7 plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-rapid7
```

# Configuration

Add `plugins` section and specify ESLint-plugin-rapid7 as a plugin.

```json
{
  "plugins": [
    "rapid7"
  ]
}
```

If it is not already the case you must also configure `ESLint` to support JSX.

```json
{
  "ecmaFeatures": {
    "classes": true
  },
  "env": {
    "es6": true
  }
}
```

Finally, enable all of the rules that you would like to use.

```json
{
  "rules": {
    "rapid7/static-magic-numbers": 1,
    "rapid7/static-screaming-snake": 1
  }
}
```

# List of supported rules

* [static-magic-numbers](docs/rules/static-magic-numbers.md): Prevents the use of magic numbers in certain cases
* [static-screaming-snake](docs/rules/static-screaming-snake.md): Enforce static variables be in screaming snake case
