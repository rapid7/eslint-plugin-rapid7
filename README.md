# eslint-plugin-rapid7

Rapid7-specific linting rules for ESLint

## Installation

Install [ESLint](https://www.github.com/eslint/eslint) as well as the plugin.

```sh
$ npm install eslint eslint-plugin-rapid7 --save-dev
```

## Configuration

Add `plugins` section and specify `eslint-plugin-rapid7` as a plugin to your `.eslintrc`.

```json
{
  "plugins": ["rapid7"]
}
```

Enable the rules that you would like to use.

```json
{
  "rules": {
    "rapid7/named-import-newline": 1,
    "rapid7/no-trailing-underscore": [2, {
      "allow": [
        "__REDUX_DEVTOOLS_EXTENSION__"
      ],
      "allowAfterSuper": false,
      "allowAfterThis": false,
      "enforceInMethodNames": true,
      "enforceInPropertyNames": true
    }]
  }
}
```

## List of supported rules

- [named-import-newline](docs/named-import-newline.md): Enforce newlines between named imports from a package (fixable)
- [no-trailing-underscore](docs/no-trailing-underscore.md): Enforce no trailing underscore on variable / method names
