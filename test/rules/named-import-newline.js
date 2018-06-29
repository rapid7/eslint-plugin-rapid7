// test
const test = require('ava');
const {RuleTester} = require('eslint');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
});

// src
const rule = require('lib/rules/named-import-newline');

test('if the rule will validate the basic usage', t => {
  try {
    ruleTester.run('named-import-newline', rule, {
      valid: [
        {
          code: `
  import {
    foo, 
    bar, 
    baz
  } from "package";`.trim(),
        },
      ],
      invalid: [
        {
          code: 'import {foo, bar, baz} from "package";',
          errors: [
            {
              message: 'Imported properties must go on a new line.',
            },
            {
              message: 'Imported properties must go on a new line.',
            },
          ],
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if the rule will validate the usage with aliasing', t => {
  try {
    ruleTester.run('named-import-newline', rule, {
      valid: [
        {
          code: `
  import {
    foo, 
    bar as quz, 
    baz
  } from "package";`.trim(),
        },
      ],
      invalid: [
        {
          code: 'import {foo, bar as quz, baz} from "package";',
          errors: [
            {
              message: 'Imported properties must go on a new line.',
            },
            {
              message: 'Imported properties must go on a new line.',
            },
          ],
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});

test('if the rule will validate the usage where multiple properties are allow per line', t => {
  try {
    ruleTester.run('named-import-newline', rule, {
      valid: [
        {
          code: `
  import {
    foo, bar, baz
  } from "package";`.trim(),
          options: [
            {
              allowMultipleImportsPerLine: true,
            },
          ],
        },
      ],
      invalid: [
        {
          code: 'import {foo, bar, baz} from "package";',
          errors: [
            {
              message: 'Imported properties must go on a new line.',
            },
            {
              message: 'Imported properties must go on a new line.',
            },
          ],
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error);
  }
});
