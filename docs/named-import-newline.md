<!-- prettier-ignore-start -->

# rapid7/named-import-newline

_Enforce newlines between named imports from a package_

Enforce a convention where if multiple named imports are used from a package, they are separated by a newline. When only one named import is used, this does not apply.

> The `--fix` option on the command line automatically fixes problems reported by this rule.

## Rule details

Examples of **incorrect** code for this rule:

```javascript
import {foo, bar} from 'package';
import {
  foo, bar
} from 'package';
```

Examples of **correct** code for this rule:

```javascript
import {
  foo, 
  bar
} from 'package';
```

## Version

This rule was introduced in `eslint-plugin-rapid7` 7.0.0.

<!-- prettier-ignore-end -->
