<!-- prettier-ignore-start -->

# rapid7/no-trailing-underscore

_Enforce no trailing underscore on variable / method names_

Enforce a convention where variable or method names do not have an underscore as the last character.

## Rule details

Examples of **incorrect** code for this rule:

```javascript
const FOO_ = 'foo';

const object = {
  _bar_() {}
};
```

Examples of **correct** code for this rule:

```javascript
const FOO = 'foo';

const object = {
  _bar() {}
};
```

## Version

This rule was introduced in `eslint-plugin-rapid7` 7.2.0.

<!-- prettier-ignore-end -->
