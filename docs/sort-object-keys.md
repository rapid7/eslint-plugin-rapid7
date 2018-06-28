<!-- prettier-ignore-start -->

# rapid7/sort-object-keys

_Enforce object keys sorted alphabetically_

Enforce a convention where object keys are sorted alphabetically within the context of their assignment.

> The `--fix` option on the command line automatically fixes problems reported by this rule.

## Rule details

Examples of **incorrect** code for this rule:

```javascript
const standardObject = {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz',
};

const spreadObject = {
  ...objectOne,
  foo: 'foo',
  bar: 'bar',
  ...objectTwo,
  quz: 'quz',
  baz: 'baz',
};
```

Examples of **correct** code for this rule:

```javascript
const standardObject = {
  bar: 'bar',
  baz: 'baz',
  foo: 'foo',
};

const spreadObject = {
  ...objectOne,
  bar: 'bar',
  foo: 'foo',
  ...objectTwo,
  baz: 'baz',
  quz: 'quz',
};
```

## Caveats

When there are comments declared within the context of the object, the rule will report problems but will not be able to autofix the issue.

```javascript
const standardObject = {
  foo: 'foo',
  // this comment will cause the fixer to fail
  bar: 'bar',
  baz: 'baz',
};
```

## Version

This rule was introduced in `eslint-plugin-rapid7` 7.1.0.

<!-- prettier-ignore-end -->
