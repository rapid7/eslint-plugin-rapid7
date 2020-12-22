// test
const test = require('ava');
const {RuleTester} = require('eslint');

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
});

// src
const rule = require('lib/rules/sort-object-keys');

test('if the rule will validate the basic usage', t => {
  try {
    ruleTester.run('sort-object-keys', rule, {
      valid: [
        {
          code: `const object = {
  bar: 'bar',
  baz: 'baz',
  foo: 'foo',
}`.trim(),
        },
      ],
      invalid: [
        {
          code: `const object = {
  bar: 'bar',
  foo: 'foo',
  baz: 'baz',
}`.trim(),
          errors: [
            {
              message: "Expected object keys to be in ascending order. 'baz' should be before 'foo'.",
            },
          ],
          output: `const object = {
  bar: 'bar',
baz: 'baz',
foo: 'foo',
}`.trim(),
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if the rule will validate the numeric key usage', t => {
  try {
    ruleTester.run('sort-object-keys', rule, {
      valid: [
        {
          code: `const object = {
  1: 'baz', 
  2: 'foo',
  3: 'bar',
}`.trim(),
        },
      ],
      invalid: [
        {
          code: `const object = {
  3: 'bar',
  1: 'baz',
  2: 'foo',
}`.trim(),
          errors: [
            {
              message: "Expected object keys to be in ascending order. '1' should be before '3'.",
            },
          ],
          output: `const object = {
  1: 'baz',
2: 'foo',
3: 'bar',
}`.trim(),
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if the rule will validate the usage with comments but not fix them', t => {
  try {
    ruleTester.run('sort-object-keys', rule, {
      valid: [
        {
          code: `const object = {
  1: 'baz',
  // some comment
  2: 'foo',
  3: 'bar',
}`.trim(),
        },
      ],
      invalid: [
        {
          code: `const object = {
  3: 'bar',
  // some comment
  1: 'baz',
  2: 'foo',
}`.trim(),
          errors: [
            {
              message: "Expected object keys to be in ascending order. '1' should be before '3'.",
            },
          ],
          output: `const object = {
  3: 'bar',
  // some comment
  1: 'baz',
  2: 'foo',
}`.trim(),
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if the rule will validate usage with computed properties', t => {
  try {
    ruleTester.run('sort-object-keys', rule, {
      valid: [
        {
          code: `const object = {
  bar: 'bar',
  [baz]: 'baz',
  foo: 'foo',
}`.trim(),
        },
      ],
      invalid: [
        {
          code: `const object = {
  bar: 'bar',
  foo: 'foo',
  [baz]: 'baz',
}`.trim(),
          errors: [
            {
              message: "Expected object keys to be in ascending order. 'baz' should be before 'foo'.",
            },
          ],
          output: `const object = {
  bar: 'bar',
[baz]: 'baz',
foo: 'foo',
}`.trim(),
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if the rule will validate usage with complex computed properties but not fix them', t => {
  try {
    ruleTester.run('sort-object-keys', rule, {
      valid: [
        {
          code: `const object = {
  [array[1]]: 'baz',
  bar: 'bar',
  foo: 'foo',
  [quz.blah]: 'quz',
}`.trim(),
        },
      ],
      invalid: [
        {
          code: `const object = {
  foo: 'foo',
  bar: 'bar',
  [quz.blah]: 'quz',
  [array[1]]: 'baz',
}`.trim(),
          errors: [
            {
              message: "Expected object keys to be in ascending order. 'bar' should be before 'foo'.",
            },
          ],
          output: `const object = {
  foo: 'foo',
  bar: 'bar',
  [quz.blah]: 'quz',
  [array[1]]: 'baz',
}`.trim(),
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if the rule will validate usage with spread operations', t => {
  try {
    ruleTester.run('sort-object-keys', rule, {
      valid: [
        {
          code: `const object = {
  bar: 'bar',
  foo: 'foo',
  ...spread,
  baz: 'baz', 
  quz: 'quz',
  ...otherSpread,
  blah: 'blah',
}`.trim(),
        },
      ],
      invalid: [
        {
          code: `const object = {
  foo: 'foo',
  bar: 'bar',
  ...spread,
  quz: 'quz',
  baz: 'baz',
  ...otherSpread,
  blah: 'blah',
}`.trim(),
          errors: [
            {
              message: "Expected object keys to be in ascending order. 'bar' should be before 'foo'.",
            },
            {
              message: "Expected object keys to be in ascending order. 'baz' should be before 'quz'.",
            },
          ],
          output: `const object = {
  bar: 'bar',
foo: 'foo',
...spread,
baz: 'baz',
quz: 'quz',
...otherSpread,
blah: 'blah',
}`.trim(),
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if the rule will validate usage with spread operations and computed properties', t => {
  try {
    ruleTester.run('sort-object-keys', rule, {
      valid: [
        {
          code: `const object = {
  bar: 'bar',
  foo: 'foo',
  ...spread,
  [baz]: 'baz', 
  quz: 'quz',
  ...otherSpread,
  blah: 'blah',
}`.trim(),
        },
      ],
      invalid: [
        {
          code: `const object = {
  foo: 'foo',
  bar: 'bar',
  ...spread,
  quz: 'quz',
  [baz]: 'baz',
  ...otherSpread,
  blah: 'blah',
}`.trim(),
          errors: [
            {
              message: "Expected object keys to be in ascending order. 'bar' should be before 'foo'.",
            },
            {
              message: "Expected object keys to be in ascending order. 'baz' should be before 'quz'.",
            },
          ],
          output: `const object = {
  bar: 'bar',
foo: 'foo',
...spread,
[baz]: 'baz',
quz: 'quz',
...otherSpread,
blah: 'blah',
}`.trim(),
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if the rule will validate usage with spread operations and complex computed properties but not fix them', t => {
  try {
    ruleTester.run('sort-object-keys', rule, {
      valid: [
        {
          code: `const object = {
  bar: 'bar',
  foo: 'foo',
  ...spread,
  [baz]: 'baz', 
  [quz.blah]: 'quz',
  ...otherSpread,
  blah: 'blah',
}`.trim(),
        },
      ],
      invalid: [
        {
          code: `const object = {
  foo: 'foo',
  bar: 'bar',
  ...spread,
  [quz.blah]: 'quz',
  [baz]: 'baz', 
  ...otherSpread,
  blah: 'blah',
}`.trim(),
          errors: [
            {
              message: "Expected object keys to be in ascending order. 'bar' should be before 'foo'.",
            },
          ],
          output: `const object = {
  foo: 'foo',
  bar: 'bar',
  ...spread,
  [quz.blah]: 'quz',
  [baz]: 'baz', 
  ...otherSpread,
  blah: 'blah',
}`.trim(),
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if the rule will validate the numeric key usage with natural ordering', t => {
  try {
    ruleTester.run('sort-object-keys', rule, {
      valid: [
        {
          code: `const object = {
  1: 'baz',
  2: 'foo',
  10: 'bar',
}`.trim(),
          options: ['asc', {natural: true}],
        },
      ],
      invalid: [
        {
          code: `const object = {
  1: 'baz',
  10: 'bar',
  2: 'foo',
}`.trim(),
          errors: [
            {
              message: "Expected object keys to be in natural ascending order. '2' should be before '10'.",
            },
          ],
          options: ['asc', {natural: true}],
          output: `const object = {
  1: 'baz',
2: 'foo',
10: 'bar',
}`.trim(),
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});
