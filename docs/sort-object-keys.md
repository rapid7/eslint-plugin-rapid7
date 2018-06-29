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

// Case-sensitive by default.
const object = {
  foo: 'foo',
  Bar: 'bar',
  baz: 'baz'
};

// Non-natural order by default.
const object = {
  1: 'one',
  2: 'two',
  10: 'ten',
};

// This rule checks computed properities as well.
const bar = 'bar';
const object = {
  foo: 'foo',
  baz: 'baz'
  [bar]: 'bar',
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

// Case-sensitive by default.
const object = {
  Bar: 'bar',
  foo: 'foo',
  baz: 'baz'
};

// Non-natural order by default.
const object = {
  1: 'one',
  10: 'ten',
  2: 'two',
};

// This rule checks computed properities as well.
const bar = 'bar';
const object = {
  foo: 'foo',
  [bar]: 'bar',
  baz: 'baz'
};
```

## Options

```javascript
{
  "rapid7/sort-object-keys": ["error", "asc", {caseSensitive: true, natural: false}]
}
```

The first option is a `string` that represents the order, either `"asc"` (ascending) or `"desc"` (descending).

The second option is an object when has 2 available properties:

- `caseSensitive` => if `true`, enforce properties to be case-sensitive order. Default is `true`.
- `natural` => if `true`, enforce properties to be in natural order. Default is `false`.
  + Natural Order compares strings containing combination of letters and numbers in the way a human being would sort. It basically sorts numerically, instead of sorting alphabetically.
    + With `natural` as `true`, ordering would be `[1, 3, 6, 8, 10]`
    + WIth `natural` as `false`, ordering would be `[1, 10, 3, 6, 8]`

## Unfixable cases

When there are comments declared within the context of the object, the rule will report problems but will not be able to autofix the issue.

```javascript
const object = {
  foo: 'foo',
  // this comment will cause the fixer to fail
  bar: 'bar',
  baz: 'baz',
};
```

When there are complex computed properties that are assigned to the object, the rule will report problems but will not be able to autofix the issue.

```javascript
const object = {
  foo: 'foo',
  [bar.baz]: 'bar-baz',
  quz: 'quz',
};
```

Examples of what are considered "complex computed properties":

```javascript
const object = {
  [a + b]: 'computation in key',
  [`${c}.${d}`]: 'template literals',
  [foo.bar.baz]: 'deeply-nested object properties',
  [quz[1]]: 'array values',
  [Symbol('e')]: 'symbols',
  [tagged`f`]: 'tagged template literals',
};
```

## Version

This rule was introduced in `eslint-plugin-rapid7` 7.1.0.

<!-- prettier-ignore-end -->
